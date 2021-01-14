import {connect} from "react-redux";
import React, {Component} from "react";
import {fetchAutoAlbumsList} from "../../store/actions/albumsActions";
import {Map, Marker, TileLayer} from "react-leaflet";

class EventMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.preprocess = this.preprocess.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(fetchAutoAlbumsList());

        console.log("Map was just made visible.");

        var resizeDone = false

        // attempt resize 8 times; mapRef.current might be undefined
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                if (!resizeDone) {
                    if (this.mapRef.current) {
                        const map = this.mapRef.current.leafletElement;
                        map.invalidateSize(true);
                        resizeDone = true
                        console.log('Map resized.')
                    }
                }
            }, 1000 * (i + 1));
        }
        ;
    }

    onViewportChanged = viewport => {
        console.log('Viewport changed, mapping new photo location: ', viewport.center);
        this.setState({viewport});

        const map = this.mapRef.current.leafletElement;
        map.invalidateSize(true);
    };

    preprocess() {
        var eventsWithGPS = this.props.albumsAutoList.filter(function (album) {
            if (album.gps_lat != null && album.gps_lon != null) {
                return true;
            } else {
                return false;
            }
        });

        var sum_lat = 0;
        var sum_lon = 0;
        for (var i = 0; i < eventsWithGPS.length; i++) {
            sum_lat += parseFloat(eventsWithGPS[i].gps_lat);
            sum_lon += parseFloat(eventsWithGPS[i].gps_lon);
        }
        var avg_lat = sum_lat / eventsWithGPS.length;
        var avg_lon = sum_lon / eventsWithGPS.length;

        var markers = eventsWithGPS.map(function (album) {
            return <Marker position={[album.gps_lat, album.gps_lon]}/>;
        });
        return [avg_lat, avg_lon, markers];
    }

    render() {
        if (this.props.fetchedAlbumsAutoList) {
            var res = this.preprocess();
            var avg_lat = res[0];
            var avg_lon = res[1];
            var markers = res[2];

            return (
                <div>
                    <Map
                        ref={this.mapRef}
                        center={[avg_lat, avg_lon]}
                        zoom={2}
                    >
                        <TileLayer
                            attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        />
                        {markers}
                    </Map>
                </div>
            );
        } else {
            return <div/>;
        }
    }
}

EventMap = connect(store => {
    return {
        albumsAutoList: store.albums.albumsAutoList,
        fetchingAlbumsAutoList: store.albums.fetchingAlbumsAutoList,
        fetchedAlbumsAutoList: store.albums.fetchedAlbumsAutoList
    };
})(EventMap);

export default EventMap
