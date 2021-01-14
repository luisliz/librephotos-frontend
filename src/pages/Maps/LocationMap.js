import React, {Component} from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import {Image, Loader, Segment} from "semantic-ui-react";

export class LocationMap extends Component {

    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
    }

    componentDidMount() {
        console.log("Map was just set visible.");

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
            }, 1000*(i+1));
        };
    }

    onViewportChanged = viewport => {
        console.log('Viewport changed, mapping new photo location: ', viewport.center);
        this.setState({ viewport });

        const map = this.mapRef.current.leafletElement;
        map.invalidateSize(true);
    };

    render() {
        var photosWithGPS = this.props.photos.filter(function(photo) {
            if (photo.exif_gps_lon !== null && photo.exif_gps_lon) {
                return true;
            } else {
                return false;
            }
        });

        var sum_lat = 0;
        var sum_lon = 0;
        for (var i = 0; i < photosWithGPS.length; i++) {
            sum_lat += parseFloat(photosWithGPS[i].exif_gps_lat);
            sum_lon += parseFloat(photosWithGPS[i].exif_gps_lon);
        }
        var avg_lat = sum_lat / photosWithGPS.length;
        var avg_lon = sum_lon / photosWithGPS.length;

        var markers = photosWithGPS.map(function(photo) {
            return (
                <Marker
                    key={photo.image_hash}
                    position={[photo.exif_gps_lat, photo.exif_gps_lon]}
                >
                    <Popup>
                        <div>
                            <Image src={photo.square_thumbnail} />
                        </div>
                    </Popup>
                </Marker>
            );
        });

        console.log(markers);

        if (photosWithGPS.length > 0) {
            if (this.props.zoom) {
                var zoom = this.props.zoom;
            } else {
                var zoom = 2;
            }
            return (
                <Segment style={{ zIndex: 2, height: this.props.height, padding: 0 }}>
                    <Map
                        ref={this.mapRef}
                        style={{ height: this.props.height }}
                        center={[avg_lat, avg_lon]}
                        zoom={zoom}
                    >
                        <TileLayer
                            attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        />
                        {markers}
                    </Map>
                </Segment>
            );
        } else {
            return (
                <Segment style={{ height: this.props.height }}>
                    <Loader active>Map loading...</Loader>
                </Segment>
            );
        }
    }
}
