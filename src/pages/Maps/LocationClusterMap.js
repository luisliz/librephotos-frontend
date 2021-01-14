import React, {Component} from "react";
import {fetchPlaceAlbumsList} from "../../store/actions/albumsActions";
import {fetchLocationClusters} from "../../store/actions/utilActions";
import _ from "lodash";
import {Map, Marker, TileLayer} from "react-leaflet";
import {SecuredImageJWT} from "../../components/SecuredImage";
import {Link} from "react-router-dom";
import {serverAddress} from "../../api_client/apiClient";
import {countryNames} from "../../util/countryNames";
import {Flag, Header, Icon, Loader} from "semantic-ui-react";
import {AutoSizer, Grid} from "react-virtualized";
import {connect} from "react-redux";

export class LocationClusterMap extends Component {
    state = {
        visibleMarkers: [],
        visiblePlaceAlbums: [],
        locationClusters: [],
        width: window.innerWidth,
        height: window.innerHeight,
        entrySquareSize: 200,
        gridHeight: window.innerHeight - topMenuHeight - 300,
        headerHeight: 60,
        numEntrySquaresPerRow: 3
    };

    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.preprocess = this.preprocess.bind(this);
        this.calculateEntrySquareSize = this.calculateEntrySquareSize.bind(this);
    }

    componentDidMount() {
        this.calculateEntrySquareSize();

        window.addEventListener("resize", this.calculateEntrySquareSize);

        if (this.props.albumsPlaceList.length === 0) {
            this.props.dispatch(fetchPlaceAlbumsList());
        }

        if (!this.props.fetchedLocationClusters) {
            this.props.dispatch(fetchLocationClusters());
        }

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

        // map.invalidateSize was undefined when this was called from Map div context
        if (map.invalidateSize) {
            map.invalidateSize(true);
        }

        const bounds = map.getBounds();

        const visibleMarkers = this.props.locationClusters.filter(loc => {
            const markerLat = loc[0];
            const markerLng = loc[1];
            if (
                markerLat < bounds._northEast.lat &&
                markerLat > bounds._southWest.lat &&
                markerLng < bounds._northEast.lng &&
                markerLng > bounds._southWest.lng
            ) {
                return true;
            } else {
                return false;
            }
        });

        const visiblePlaceNames = visibleMarkers.map(el => el[2]);

        const visiblePlaceAlbums = this.props.albumsPlaceList.filter(el => {
            if (visiblePlaceNames.includes(el.title)) {
                return true;
            } else {
                return false;
            }
        });

        console.log(visibleMarkers);
        this.setState({
            visibleMarkers: visibleMarkers,
            visiblePlaceAlbums: _.sortBy(visiblePlaceAlbums, [
                "geolocation_level",
                "photo_count"
            ])
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.locationClusters.length === 0) {
            const visibleMarkers = nextProps.locationClusters;
            const visiblePlaceNames = visibleMarkers.map(el => el[2]);
            const visiblePlaceAlbums = nextProps.albumsPlaceList.filter(el => {
                if (visiblePlaceNames.includes(el.title)) {
                    return true;
                } else {
                    return false;
                }
            });

            return {
                visibleMarkers: nextProps.locationClusters,
                locationClusters: nextProps.locationClusters,
                visiblePlaceAlbums: _.sortBy(visiblePlaceAlbums, [
                    "geolocation_level",
                    "photo_count"
                ])
            };
        } else {
            return { ...prevState };
        }
    }

    preprocess() {
        var markers = this.props.locationClusters.map(function(loc) {
            if (loc[0] !== 0) {
                return <Marker position={[loc[0], loc[1]]} title={loc[2]} />;
            }
        });
        return markers;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.calculateEntrySquareSize);
    }

    calculateEntrySquareSize() {
        if (window.innerWidth < 600) {
            var numEntrySquaresPerRow = 2;
        } else if (window.innerWidth < 800) {
            var numEntrySquaresPerRow = 3;
        } else if (window.innerWidth < 1000) {
            var numEntrySquaresPerRow = 4;
        } else if (window.innerWidth < 1200) {
            var numEntrySquaresPerRow = 5;
        } else {
            var numEntrySquaresPerRow = 6;
        }

        var columnWidth = window.innerWidth - SIDEBAR_WIDTH - 5 - 5 - 15;

        var entrySquareSize = columnWidth / numEntrySquaresPerRow;
        var numEntrySquaresPerRow = numEntrySquaresPerRow;
        this.setState({
            ...this.state,
            width: window.innerWidth,
            height: window.innerHeight,
            entrySquareSize: entrySquareSize,
            numEntrySquaresPerRow: numEntrySquaresPerRow
        });
    }

    cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        var place = this.state.visiblePlaceAlbums;
        var albumPlaceIndex =
            rowIndex * this.state.numEntrySquaresPerRow + columnIndex;
        if (albumPlaceIndex < place.length) {
            return (
                <div key={key} style={style}>
                    <div
                        onClick={() => {
                            // store.dispatch(push(`/place/${this.props.albumsPlaceList[albumPlaceIndex].id}/`))
                            // store.dispatch(searchPhotos(this.props.albumsPlaceList[albumPlaceIndex].title))
                            // store.dispatch(push('/search'))
                        }}
                        style={{ padding: 5 }}
                    >
                        {place[albumPlaceIndex].cover_photos.slice(0, 1).map(photo => {
                            return (
                                <SecuredImageJWT
                                    label={{
                                        as: "a",
                                        corner: "left",
                                        icon: "map marker alternate"
                                    }}
                                    style={{ display: "inline-block", zIndex: 1 }}
                                    width={this.state.entrySquareSize - 10}
                                    height={this.state.entrySquareSize - 10}
                                    as={Link}
                                    to={`/place/${place[albumPlaceIndex].id}/`}
                                    src={
                                        serverAddress +
                                        "/media/square_thumbnails/" +
                                        photo.image_hash +
                                        ".jpg"
                                    }
                                />
                            );
                        })}
                    </div>
                    <div style={{ paddingLeft: 15, paddingRight: 15, height: 50 }}>
                        {countryNames.includes(
                            place[albumPlaceIndex].title.toLowerCase()
                        ) ? (
                            <Flag name={place[albumPlaceIndex].title.toLowerCase()} />
                        ) : (
                            ""
                        )}
                        <b>{place[albumPlaceIndex].title}</b>
                        <br /> {place[albumPlaceIndex].photo_count} Photos
                    </div>
                </div>
            );
        } else {
            return <div key={key} style={style} />;
        }
    };

    render() {
        console.log(this.state);
        if (this.props.fetchedLocationClusters) {
            var markers = this.preprocess();

            return (
                <div>
                    <div
                        style={{
                            height: this.state.headerHeight,
                            paddingTop: 10,
                            paddingRight: 5
                        }}
                    >
                        <Header as="h2">
                            <Icon name="map outline" />
                            <Header.Content>
                                Places{" "}
                                <Loader
                                    size="tiny"
                                    inline
                                    active={this.props.fetchingAlbumsPlaceList}
                                />
                                <Header.Subheader>
                                    Showing {this.state.visiblePlaceAlbums.length} places on the map
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                    <div style={{ marginLeft: -5 }}>
                        <Map
                            ref={this.mapRef}
                            className="markercluster-map"
                            style={{
                                height: 240
                            }}
                            onViewportChanged={this.onViewportChanged}
                            center={[40, 0]}
                            zoom={2}
                        >
                            <TileLayer
                                attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MarkerClusterGroup>{markers}</MarkerClusterGroup>
                        </Map>
                    </div>
                    <AutoSizer
                        disableHeight
                        style={{ outline: "none", padding: 0, margin: 0 }}
                    >
                        {({ width }) => (
                            <Grid
                                style={{ outline: "none" }}
                                disableHeader={false}
                                cellRenderer={this.cellRenderer}
                                columnWidth={this.state.entrySquareSize}
                                columnCount={this.state.numEntrySquaresPerRow}
                                height={this.state.gridHeight}
                                rowHeight={this.state.entrySquareSize + 60}
                                rowCount={Math.ceil(
                                    this.state.visiblePlaceAlbums.length /
                                    this.state.numEntrySquaresPerRow.toFixed(1)
                                )}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                </div>
            );
        } else {
            return (
                <div style={{ height: this.props.height }}>
                    <Loader active>Map loading...</Loader>
                </div>
            );
        }
    }
}

LocationClusterMap = connect(store => {
    return {
        albumsPlaceList: store.albums.albumsPlaceList,
        locationClusters: store.util.locationClusters,
        fetchingLocationClusters: store.util.fetchingLocationClusters,
        fetchedLocationClusters: store.util.fetchedLocationClusters
    };
})(LocationClusterMap);
