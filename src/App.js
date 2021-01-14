import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import NotificationSystem from 'reapop';
import theme from 'reapop-theme-wybo';
import './App.css';
import {CountStats} from './components/statistics';
import Login from './containers/login';
import history from './history';
import {
  FaceScatter,
  Graph,
  LocationTree,
  PhotoMap,
  Timeline,
  WordClouds,
} from './pages/Data/DataVisualization'
import {FaceDashboard} from './pages/Data/FaceDashboardV3';
import {FavoritePhotos} from './pages/Photos/FavoritePhotos';
import {HiddenPhotos} from './pages/Photos/HiddenPhotos';
import {SignupPage} from './pages/Auth/SignUpPage';
import {AlbumAutoGalleryView} from './pages/albumAutoGalleryView';

import {AlbumAuto} from './pages/Albums/albumAuto';
import {AlbumPeople} from './pages/Albums/albumPeople';
import {AlbumThing} from './pages/Albums/albumThing';
import {AlbumUser} from './pages/Albums/albumUser';
import {LocationClusterMap} from './pages/Maps/LocationClusterMap';
import {AllPhotosHashListViewRV} from './pages/allPhotosViewHashRV';

import {AlbumPersonGallery} from './pages/albumPersonGallery';
import {AlbumPlaceGallery} from './pages/Albums/albumPlaceGallery';
import {AlbumUserGallery} from './pages/albumUserGallery';
import {NoTimestampPhotosView} from './pages/Photos/noTimestampPhotosView';
import {RecentlyAddedPhotos} from './pages/Photos/RecentlyAddedPhotos';
import PrivateRoute from './layouts/privateRoute';
import {SearchView} from './pages/searchRV';
import {Settings} from './pages/Settings/settings';
import {AdminPage} from './pages/AdminPage';
import {Statistics} from './pages/Data/statistics';
import {SecuredImage} from './pages/Bench';
import {UserPublicPage} from './pages/Photos/UserPublicPage';
import {PublicUserList} from './pages/Sharing/PublicUserList';
import {SharedToMe} from './pages/Sharing/SharedToMe';
import {SharedFromMe} from './pages/Sharing/SharedFromMe';
import TopMenu from "./components/menus/TopMenu";
import SideMenuNarrow from "./components/menus/SideMenuNarrow";

class Nav extends React.Component {
  render() {
    return (
      <div>
        {this.props.showSidebar && <SideMenuNarrow visible={true} />}
        <TopMenu style={{zIndex: -1}} />
      </div>
    );
  }
}

const noMenubarPaths = ['/signup', '/login'];

class App extends Component {

  render() {
    // const menuSpacing = 0;
    return (
      <ConnectedRouter history={history}>
        <div>
          <NotificationSystem theme={theme} />
          {this.props.location &&
          !noMenubarPaths.includes(this.props.location.pathname) &&
          !(
            this.props.location.pathname.startsWith('/public') ||
            this.props.location.pathname.startsWith('/user/') ||
            this.props.location.pathname.startsWith('/users/')
          ) ? (
            <Nav showSidebar={this.props.showSidebar} />
          ) : (
            <div />
          )}

          <Switch>
            {/* Authentication */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignupPage} />

            {/* Photos */}
            <PrivateRoute exact path="/" component={AllPhotosHashListViewRV} />
            <PrivateRoute path="/notimestamp" component={NoTimestampPhotosView}/>
            <PrivateRoute path="/recent" component={RecentlyAddedPhotos} />
            <PrivateRoute path="/hidden" component={HiddenPhotos} />
            <PrivateRoute path="/favorites" component={FavoritePhotos} />
            <Route path="/user/:username" component={UserPublicPage} />

            {/* Albums */}
            <PrivateRoute path="/useralbums" component={AlbumUser} />
            <PrivateRoute path="/people" component={AlbumPeople} />
            <PrivateRoute path="/events" component={AlbumAuto} />
            <PrivateRoute path="/places" component={LocationClusterMap} />
            <PrivateRoute path="/things" component={AlbumThing} />

            {/* Data Visualization */}
            <PrivateRoute path="/placetree" component={LocationTree} />
            <PrivateRoute path="/wordclouds" component={WordClouds} />
            <PrivateRoute path="/timeline" component={Timeline} />
            <PrivateRoute path="/socialgraph" component={Graph} />
            <PrivateRoute path="/facescatter" component={FaceScatter} />
            <PrivateRoute path="/statistics" component={Statistics} />

            {/* Sharing */}
            <Route path="/users" component={PublicUserList} />
            <PrivateRoute path="/shared/tome/:which" component={SharedToMe} />
            <PrivateRoute path="/shared/fromme/:which" component={SharedFromMe} />

            {/* Dashboards */}
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute path="/faces" component={FaceDashboard} />

            {/* This is a component why link */}
            <PrivateRoute path="/countstats" component={CountStats} />

            {/* Others */}
            <Route path="/public" component={UserPublicPage} />
            <PrivateRoute path="/search" component={SearchView} />
            <PrivateRoute path="/bench" component={SecuredImage} />
            <PrivateRoute path="/admin" component={AdminPage} />
            <PrivateRoute path="/map" component={PhotoMap} />
            <PrivateRoute path="/person/:albumID" component={AlbumPersonGallery} />
            <PrivateRoute path="/place/:albumID" component={AlbumPlaceGallery} />
            <PrivateRoute path="/event/:albumID" component={AlbumAutoGalleryView} />
            <PrivateRoute path="/useralbum/:albumID" component={AlbumUserGallery} />
          </Switch>
        </div>
      </ConnectedRouter>
    );
  }
}

App = connect(store => {
  return {
    showSidebar: store.ui.showSidebar,
    location: store.routerReducer.location,
  };
})(App);

export default App;
