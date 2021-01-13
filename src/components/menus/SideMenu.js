import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import {
  Button,
  Divider,
  Dropdown,
  Header,
  Icon,
  Image,
  Input,
  Menu,
  Popup,
  Segment,
  Sidebar,
  Progress,
} from "semantic-ui-react";
import {
  fetchPeopleAlbums,
  fetchPlaceAlbum,
  fetchPlaceAlbumsList,
  fetchThingAlbumsList,
  fetchUserAlbum,
  fetchUserAlbumsList,
} from "../actions/albumsActions";
import { logout } from "../actions/authActions";
import { fetchPeople } from "../actions/peopleActions";
import {
  searchPeople,
  searchPhotos,
  searchPlaceAlbums,
  searchThingAlbums,
} from "../actions/searchActions";
import { toggleSidebar } from "../actions/uiActions";
import {
  fetchCountStats,
  fetchExampleSearchTerms,
  fetchWorkerAvailability,
} from "../actions/utilActions";
import { serverAddress } from "../api_client/apiClient";
import { SecuredImageJWT } from "../components/SecuredImage";


export class SideMenu extends Component {
    state = { activeItem: "photos" };
  
    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    handleLogout = (e, { name }) => this.props.dispatch(logout());
  
    render() {
      if (this.props.jwtToken == null) {
        var authMenu = (
          <Menu.Item name="loginout" as={Link} to="/login">
            <Icon name="sign out" corner /> Log In
          </Menu.Item>
        );
      } else {
        var authMenu = (
          <Menu.Item
            onClick={this.handleLogout}
            name="loginout"
            as={Link}
            to="/login"
          >
            <Icon name="sign in" corner /> Log Out
          </Menu.Item>
        );
      }
  
      const { activeItem } = this.state;
      return (
        <Sidebar
          as={Menu}
          vertical
          fixed="left"
          width="thin"
          color="black"
          animation="overlay"
          floated
          pointing
          borderless
          inverted
        >
          <Menu.Item name="logo">
            <img src="/logo-white.png" />
          </Menu.Item>
  
          {authMenu}
  
          <Menu.Item
            onClick={this.handleItemClick}
            active={activeItem === "all photos"}
            name="all photos"
            as={Link}
            to="/"
          >
            <Icon name="image" corner />
            Browse
          </Menu.Item>
  
          <Menu.Item
            onClick={this.handleItemClick}
            active={activeItem === "search"}
            name="search"
            as={Link}
            to="/search"
          >
            <Icon name="search" corner />
            Search
          </Menu.Item>
  
          <Menu.Item>
            <Menu.Header>
              <Icon name="heart" />
              Favorites
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "favorites auto albums"}
                name="favorites auto albums"
                content="Events"
                as={Link}
                to="/favorite/auto"
              />
            </Menu.Menu>
          </Menu.Item>
  
          <Menu.Item>
            <Menu.Header>
              <Icon name="image" />
              Albums
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "people albums"}
                content="People"
                name="people albums"
                as={Link}
                to="/albums/people"
              />
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "auto albums"}
                content="Events"
                name="auto albums"
                as={Link}
                to="/albums/auto"
              />
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "date albums"}
                content="Days"
                name="date albums"
                as={Link}
                to="/albums/date"
              />
            </Menu.Menu>
          </Menu.Item>
  
          <Menu.Item>
            <Menu.Header>
              <Icon name="dashboard" />
              Dashboards
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "faces dashboard"}
                name="faces dashboard"
                content="Faces"
                as={Link}
                to="/faces"
              />
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "people dashboard"}
                name="people dashboard"
                content="People"
                as={Link}
                to="/people"
              />
  
              <Menu.Item
                onClick={this.handleItemClick}
                active={activeItem === "statistics"}
                name="statistics"
                content="Statistics"
                as={Link}
                to="/statistics"
              />
            </Menu.Menu>
          </Menu.Item>
        </Sidebar>
      );
    }
  }

SideMenu = connect((store) => {
  return {
    jwtToken: store.auth.jwtToken,
  };
})(SideMenu);