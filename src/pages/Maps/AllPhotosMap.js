import React, {Component} from "react";
import {fetchPhotos} from "../../store/actions/photosActions";
import {connect} from "react-redux";
import {LocationMap} from "./LocationMap";

export class AllPhotosMap extends Component {
    componentDidMount() {
        this.props.dispatch(fetchPhotos());
    }

    render() {
        if (this.props.fetchedPhotos) {
            var map = <LocationMap photos={this.props.photos} />;
        } else {
            var map = <div />;
        }
        return <div>{map}</div>;
    }
}

AllPhotosMap = connect(store => {
    return {
        photos: store.photos.photos,
        fetchingPhotos: store.photos.fetchingPhotos,
        fetchedPhotos: store.photos.fetchedPhotos
    };
})(AllPhotosMap);
