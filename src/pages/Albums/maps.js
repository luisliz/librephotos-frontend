import React, { Component } from "react";
import { connect } from "react-redux";
import { Loader, Flag, Segment, Image, Header, Icon } from "semantic-ui-react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchPhotos } from "../../store/actions/photosActions";
import { fetchAutoAlbumsList } from "../../store/actions/albumsActions";
import { fetchLocationClusters } from "../../store/actions/utilActions";
import { serverAddress } from "../../api_client/apiClient";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { fetchPlaceAlbumsList } from "../../store/actions/albumsActions";
import { Grid, AutoSizer } from "react-virtualized";
import { countryNames } from "../../util/countryNames";
import { Link } from "react-router-dom";
import _ from "lodash";
import {SecuredImageJWT} from "../../components/SecuredImage";


var topMenuHeight = 45; // don't change this
// var ESCAPE_KEY = 27;
// var ENTER_KEY = 13;
// var RIGHT_ARROW_KEY = 39;
// var UP_ARROW_KEY = 38;
// var LEFT_ARROW_KEY = 37;
// var DOWN_ARROW_KEY = 40;

var SIDEBAR_WIDTH = 85;



