import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { fetchWordCloud } from "../../store/actions/utilActions";
import { LocationLink } from "../../components/locationLink";
import {LocationClusterMap} from "../Maps/LocationClusterMap";
import {WordCloud} from "../../components/charts/wordCloud";
import {EventCountMonthGraph} from "../../components/eventCountMonthGraph";
import {LocationDurationStackedBar} from "../../components/locationDurationStackedBar";
import {SocialGraph} from "../../components/socialGraph";
import {FaceClusterScatter} from "../../components/faceClusterGraph";

export class LocationTree extends Component {
  render() {
    return (
      <div>
        <LocationLink
          width={window.innerWidth - 120}
          height={window.innerHeight - 50}
        />
      </div>
    );
  }
}

export class PhotoMap extends Component {
  render() {
    return (
      <div style={{ marginLeft: -5 }}>
        <LocationClusterMap
          height={window.innerHeight - 55}
        />
      </div>
    );
  }
}

export class WordClouds extends Component {
  componentWillMount() {
    this.props.dispatch(fetchWordCloud());
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <div>
          <WordCloud height={320} type="location" />
          <Divider hidden />
          <WordCloud height={320} type="captions" />
          <Divider hidden />
          <WordCloud height={320} type="people" />
        </div>
      </div>
    );
  }
}

WordClouds = connect(store => {
  return {
    statusPhotoScan: store.util.statusPhotoScan,
    statusAutoAlbumProcessing: store.util.statusAutoAlbumProcessing,
    generatingAlbumsAuto: store.albums.generatingAlbumsAuto,
    scanningPhotos: store.photos.scanningPhotos,
    fetchedCountStats: store.util.fetchedCountStats
  };
})(WordClouds);

export class Timeline extends Component {
  render() {
    return (
      <div style={{ padding: 10 }}>
        <div>
          <EventCountMonthGraph />
          <Divider hidden />
          <LocationDurationStackedBar />
        </div>
      </div>
    );
  }
}

export class Graph extends Component {
  render() {
    return (
      <div style={{ maringLeft: -5 }}>
        <SocialGraph height={window.innerHeight - 60} />
      </div>
    );
  }
}

export class FaceScatter extends Component {
  render() {
    return (
      <div>
        <FaceClusterScatter height={window.innerHeight - 55} />
      </div>
    );
  }
}
