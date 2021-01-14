import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Image,
  Input,
  Menu,
  Popup,
  Segment,
  Progress,
} from "semantic-ui-react";
import {
  fetchPeopleAlbums,
  fetchPlaceAlbum,
  fetchPlaceAlbumsList,
  fetchThingAlbumsList,
  fetchUserAlbum,
  fetchUserAlbumsList,
} from "../../store/actions/albumsActions";
import { logout } from "../../store/actions/authActions";
import { fetchPeople } from "../../store/actions/peopleActions";
import {
  searchPeople,
  searchPhotos,
  searchPlaceAlbums,
  searchThingAlbums,
} from "../../store/actions/searchActions";
import { toggleSidebar } from "../../store/actions/uiActions";
import {
  fetchCountStats,
  fetchExampleSearchTerms,
  fetchWorkerAvailability,
} from "../../store/actions/utilActions";
import { serverAddress } from "../../api_client/apiClient";
import { SecuredImageJWT } from "../SecuredImage";

function fuzzy_match(str, pattern) {
  if (pattern.split("").length > 0) {
    pattern = pattern.split("").reduce(function (a, b) {
      return a + ".*" + b;
    });
    return new RegExp(pattern).test(str);
  } else {
    return false;
  }
}

var ENTER_KEY = 13;
var topMenuHeight = 45; // don't change this

class TopMenu extends Component {
    state = {
      searchText: "",
      warningPopupOpen: false,
      showEmptyQueryWarning: false,
      width: window.innerWidth,
      exampleSearchTerm: "Search...",
      searchBarFocused: false,
      filteredExampleSearchTerms: [],
      filteredSuggestedPeople: [],
    };
  
    constructor(props) {
      super(props);
      this.handleSearch = this.handleSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this.filterSearchSuggestions = this.filterSearchSuggestions.bind(this);
    }
  
    handleResize() {
      this.setState({ width: window.innerWidth });
    }
  
    componentDidMount() {
      this.props.dispatch(fetchPeople());
      this.props.dispatch(fetchPlaceAlbumsList());
      this.props.dispatch(fetchThingAlbumsList());
      this.props.dispatch(fetchUserAlbumsList());
      this.props.dispatch(fetchExampleSearchTerms());
      this.props.dispatch(fetchCountStats());
      window.addEventListener("resize", this.handleResize.bind(this));
      this.exampleSearchTermCylcer = setInterval(() => {
        this.setState({
          exampleSearchTerm:
            "Search " +
            this.props.exampleSearchTerms[
              Math.floor(Math.random() * this.props.exampleSearchTerms.length)
            ],
        });
      }, 5000);
  
      var _dispatch = this.props.dispatch;
      this.setState({ dispatch: _dispatch });
      var intervalId = setInterval(() => {
        _dispatch(fetchWorkerAvailability(this.props.workerRunningJob));
      }, 2000);
      this.setState({ intervalId: intervalId });
    }
  
    static getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.searchText.trim().length === 0) {
        var filteredExampleSearchTerms = [];
        var filteredSuggestedPeople = [];
        var filteredSuggestedPlaces = [];
        var filteredSuggestedThings = [];
        var filteredSuggestedUserAlbums = [];
      } else {
        filteredExampleSearchTerms = nextProps.exampleSearchTerms.filter((el) =>
          fuzzy_match(el.toLowerCase(), prevState.searchText.toLowerCase())
        );
        filteredSuggestedPeople = nextProps.people.filter((person) =>
          fuzzy_match(
            person.text.toLowerCase(),
            prevState.searchText.toLowerCase()
          )
        );
        filteredSuggestedPlaces = nextProps.albumsPlaceList.filter((place) =>
          fuzzy_match(
            place.title.toLowerCase(),
            prevState.searchText.toLowerCase()
          )
        );
        filteredSuggestedThings = nextProps.albumsThingList.filter((thing) =>
          fuzzy_match(
            thing.title.toLowerCase(),
            prevState.searchText.toLowerCase()
          )
        );
        filteredSuggestedUserAlbums = nextProps.albumsUserList.filter((album) =>
          fuzzy_match(
            album.title.toLowerCase(),
            prevState.searchText.toLowerCase()
          )
        );
      }
      return {
        ...prevState,
        filteredSuggestedPeople,
        filteredExampleSearchTerms,
        filteredSuggestedPlaces,
        filteredSuggestedThings,
        filteredSuggestedUserAlbums,
      };
    }
  
    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize.bind(this));
      clearInterval(this.state.intervalId);
    }
  
    _handleKeyDown(event) {
      switch (event.keyCode) {
        case ENTER_KEY:
          this.props.dispatch(searchPhotos(this.state.searchText));
          this.props.dispatch(push("/search"));
          break;
        default:
          break;
      }
    }
  
    filterSearchSuggestions() {
      if (this.state.searchText.trim().length === 0) {
        var filteredExampleSearchTerms = [];
        var filteredSuggestedPeople = [];
        var filteredSuggestedPlaces = [];
        var filteredSuggestedThings = [];
        var filteredSuggestedUserAlbums = [];
      } else {
        filteredExampleSearchTerms = this.props.exampleSearchTerms.filter((el) =>
          fuzzy_match(el.toLowerCase(), this.state.searchText.toLowerCase())
        );
        filteredSuggestedPeople = this.props.people.filter((person) =>
          fuzzy_match(
            person.text.toLowerCase(),
            this.state.searchText.toLowerCase()
          )
        );
        filteredSuggestedPlaces = this.props.albumsPlaceList.filter((place) =>
          fuzzy_match(
            place.title.toLowerCase(),
            this.state.searchText.toLowerCase()
          )
        );
        filteredSuggestedThings = this.props.albumsThingList.filter((thing) =>
          fuzzy_match(
            thing.title.toLowerCase(),
            this.state.searchText.toLowerCase()
          )
        );
        filteredSuggestedUserAlbums = this.props.albumsUserList.filter((album) =>
          fuzzy_match(
            album.title.toLowerCase(),
            this.state.searchText.toLowerCase()
          )
        );
      }
      this.setState({
        filteredSuggestedPeople,
        filteredExampleSearchTerms,
        filteredSuggestedPlaces,
        filteredSuggestedThings,
        filteredSuggestedUserAlbums,
      });
    }
  
    handleSearch(e, d) {
      if (this.state.searchText.length > 0) {
        this.props.dispatch(searchPhotos(this.state.searchText));
        this.props.dispatch(searchPeople(this.state.searchText));
        this.props.dispatch(searchThingAlbums(this.state.searchText));
        this.props.dispatch(searchPlaceAlbums(this.state.searchText));
        this.props.dispatch(push("/search"));
      } else {
        this.setState({ warningPopupOpen: true, showEmptyQueryWarning: true });
        this.timeout = setTimeout(() => {
          this.setState({ warningPopupOpen: false, showEmptyQueryWarning: true });
        }, 2500);
      }
    }
  
    handleChange(e, d) {
      this.setState('searchText')
      this.state.searchText = d.value;
      this.filterSearchSuggestions();
    }
  
    render() {
      var searchBarWidth =
        this.state.width > 600 ? this.state.width - 200 : this.state.width - 220;
      var searchBarWidth = this.state.width - 300;
  
      const {
        filteredSuggestedUserAlbums,
        filteredExampleSearchTerms,
        filteredSuggestedPeople,
        filteredSuggestedPlaces,
        filteredSuggestedThings,
      } = this.state;
  
      let runningJobPopupProgress = null;
      if (
        this.props.workerRunningJob &&
        this.props.workerRunningJob.result &&
        this.props.workerRunningJob.result.progress
      ) {
        runningJobPopupProgress = (
          <div style={{ width: 150 }}>
            <Progress
              indicating
              progress="ratio"
              value={this.props.workerRunningJob.result.progress.current}
              total={this.props.workerRunningJob.result.progress.target}
            >
              Running {this.props.workerRunningJob.job_type_str} ...
            </Progress>
          </div>
        );
      }
  
      return (
        <div>
          <Menu
            style={{ contentAlign: "left", backgroundColor: "#eeeeee" }}
            borderless
            fixed="top"
            size="mini"
          >
            <Menu.Menu position="left">
              <Menu.Item>
                <Icon
                  size="big"
                  onClick={() => {
                    this.props.dispatch(toggleSidebar());
                  }}
                  name={"sidebar"}
                />
                <Button
                  color="black"
                  style={{
                    padding: 2,
                  }}
                >
                  <Image height={30} src="/logo-white.png" />
                </Button>
              </Menu.Item>
            </Menu.Menu>
  
            <Menu.Menu position="right">
              <Menu.Item>
                <Input
                  size="large"
                  onFocus={() => {
                    this.setState({ searchBarFocused: true });
                  }}
                  onBlur={() => {
                    _.debounce(() => {
                      this.setState({ searchBarFocused: false });
                    }, 200)();
                  }}
                  onKeyDown={(event) => {
                    switch (event.keyCode) {
                      case ENTER_KEY:
                        this.props.dispatch(searchPhotos(this.state.searchText));
                        this.props.dispatch(push("/search"));
                        this.setState({searchBarFocused: false});
                        break;
                      default:
                        break;
                    }
                  }}
                  onChange={this.handleChange}
                  action={{
                    icon: "search",
                    color: "blue",
                    loading: this.props.searchingPhotos,
                    onClick: this.handleSearch,
                  }}
                  placeholder={this.state.exampleSearchTerm}
                />
              </Menu.Item>
              <Menu.Item>
                <Popup
                  trigger={
                    <Icon
                      style={{ paddingRight: 10 }}
                      name="circle"
                      color={!this.props.workerAvailability ? "red" : "green"}
                    />
                  }
                  position="bottom center"
                  content={
                    this.props.workerAvailability
                      ? "Worker available! You can start scanning more photos, infer face labels, auto create event albums, or regenerate auto event album titles."
                      : !this.props.workerAvailability &&
                        this.props.workerRunningJob
                      ? runningJobPopupProgress
                      : "Busy..."
                  }
                />
  
                <Dropdown
                  size="big"
                  button
                  icon="user"
                  labeled
                  text={this.props.auth.access.name}
                  floating
                  className="icon"
                >
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      Logged in as <b>{this.props.auth.access.name}</b>
                    </Dropdown.Header>
                    <Dropdown.Item onClick={() => this.props.dispatch(logout())}>
                      <Icon name="sign out" />
                      <b>Logout</b>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.dispatch(push("/settings"))}
                    >
                      <Icon name="settings" />
                      <b>Settings</b>
                    </Dropdown.Item>
                    {this.props.auth.access.is_admin && <Dropdown.Divider />}
  
                    {this.props.auth.access.is_admin && (
                      <Dropdown.Item
                        onClick={() => this.props.dispatch(push("/admin"))}
                      >
                        <Icon name="wrench" />
                        <b>Admin Area</b>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          {this.state.searchBarFocused && (
            <div
              style={{
                paddingTop: 5,
                paddingLeft: 10,
                paddingRight: 10,
                width: searchBarWidth,
                textAlign: "left",
                zIndex: 120,
                top: topMenuHeight,
                left: (this.state.width - searchBarWidth) / 2,
                position: "absolute",
              }}
            >
              <Header as="h3" attached="top">
                Search Suggestions
              </Header>
              {filteredExampleSearchTerms.length > 0 && (
                <Segment
                  attached
                  raised
                  textAlign="left"
                  style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}
                >
                  <div
                    style={{
                      maxHeight: window.innerHeight / 8,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ height: 10 }} />
                    {filteredExampleSearchTerms.slice(0, 10).map((el) => {
                      return (
                        <p
                          key={"suggestion_" + el}
                          onClick={() => {
                            this.props.dispatch(searchPhotos(el));
                            this.props.dispatch(searchPeople(el));
                            this.props.dispatch(searchThingAlbums(el));
                            this.props.dispatch(searchPlaceAlbums(el));
                            this.props.dispatch(push("/search"));
                          }}
                        >
                          <Icon name="search" />
                          {el}
                        </p>
                      );
                    })}
                    <div style={{ height: 5 }} />
                  </div>
                </Segment>
              )}
              {filteredSuggestedUserAlbums.length > 0 && (
                <Header as="h4" attached>
                  My Albums
                </Header>
              )}
              {filteredSuggestedUserAlbums.length > 0 && (
                <Segment
                  attached
                  raised
                  textAlign="left"
                  style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}
                >
                  <div
                    style={{
                      maxHeight: window.innerHeight / 8,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ height: 10 }} />
                    {filteredSuggestedUserAlbums.slice(0, 10).map((album) => {
                      return (
                        <p
                          key={"suggestion_place_" + album.title}
                          onClick={() => {
                            this.props.dispatch(push(`/useralbum/${album.id}`));
                            this.props.dispatch(fetchUserAlbum(album.id));
                          }}
                        >
                          <Icon name="bookmark" />
                          {album.title}
                        </p>
                      );
                    })}
                    <div style={{ height: 5 }} />
                  </div>
                </Segment>
              )}
  
              {filteredSuggestedPlaces.length > 0 && (
                <Header as="h4" attached>
                  Places
                </Header>
              )}
              {filteredSuggestedPlaces.length > 0 && (
                <Segment
                  attached
                  raised
                  textAlign="left"
                  style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}
                >
                  <div
                    style={{
                      maxHeight: window.innerHeight / 8,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ height: 10 }} />
                    {filteredSuggestedPlaces.slice(0, 10).map((place) => {
                      return (
                        <p
                          key={"suggestion_place_" + place.title}
                          onClick={() => {
                            this.props.dispatch(push(`/place/${place.id}`));
                            this.props.dispatch(fetchPlaceAlbum(place.id));
                          }}
                        >
                          <Icon name="map outline" />
                          {place.title}
                        </p>
                      );
                    })}
                    <div style={{ height: 5 }} />
                  </div>
                </Segment>
              )}
  
              {filteredSuggestedThings.length > 0 && (
                <Header as="h4" attached>
                  Things
                </Header>
              )}
              {filteredSuggestedThings.length > 0 && (
                <Segment
                  attached
                  raised
                  textAlign="left"
                  style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}
                >
                  <div
                    style={{
                      maxHeight: window.innerHeight / 8,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ height: 10 }} />
                    {filteredSuggestedThings.slice(0, 10).map((thing) => {
                      return (
                        <p
                          key={"suggestion_thing_" + thing.title}
                          onClick={() => {
                            this.props.dispatch(push(`/search`));
                            this.props.dispatch(searchPhotos(thing.title));
                          }}
                        >
                          <Icon name="tag" />
                          {thing.title}
                        </p>
                      );
                    })}
                    <div style={{ height: 5 }} />
                  </div>
                </Segment>
              )}
  
              {filteredSuggestedPeople.length > 0 && (
                <Header as="h4" attached>
                  People
                </Header>
              )}
              {filteredSuggestedPeople.length > 0 && (
                <Segment attached raised style={{ padding: 0 }}>
                  <div
                    style={{
                      maxWidth: searchBarWidth - 5,
                      height: 60,
                      padding: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Image.Group>
                      {filteredSuggestedPeople.map((person) => {
                        return (
                          <Popup
                            inverted
                            content={person.text}
                            trigger={
                              <SecuredImageJWT
                                key={"suggestion_person_" + person.key}
                                onClick={() => {
                                  this.props.dispatch(
                                    push(`/person/${person.key}`)
                                  );
                                  this.props.dispatch(
                                    fetchPeopleAlbums(person.key)
                                  );
                                }}
                                height={50}
                                width={50}
                                circular
                                src={serverAddress + person.face_url}
                              />
                            }
                          />
                        );
                      })}
                    </Image.Group>
                  </div>
                </Segment>
              )}
  
              <Header as="h4" attached>
                <Header.Content as={Link} to="/favorites">
                  <Icon name="star" color="yellow" /> Favorites
                </Header.Content>
              </Header>
              <Header as="h4" attached="bottom">
                <Header.Content as={Link} to="/hidden">
                  <Icon name="hide" color="red" /> Hidden
                </Header.Content>
              </Header>
            </div>
          )}
        </div>
      );
    }
  }

  TopMenu = connect((store) => {
    return {
      showSidebar: store.ui.showSidebar,
      gridType: store.ui.gridType,
  
      workerAvailability: store.util.workerAvailability,
      workerRunningJob: store.util.workerRunningJob,
  
      auth: store.auth,
      jwtToken: store.auth.jwtToken,
      exampleSearchTerms: store.util.exampleSearchTerms,
      fetchingExampleSearchTerms: store.util.fetchingExampleSearchTerms,
      fetchedExampleSearchTerms: store.util.fetchedExampleSearchTerms,
      searchError: store.search.error,
      searchingPhotos: store.search.searchingPhotos,
      searchedPhotos: store.search.searchedPhotos,
      people: store.people.people,
      fetchingPeople: store.people.fetchingPeople,
      fetchedPeople: store.people.fetchedPeople,
  
      albumsThingList: store.albums.albumsThingList,
      fetchingAlbumsThingList: store.albums.fetchingAlbumsThingList,
      fetchedAlbumsThingList: store.albums.fetchedAlbumsThingList,
  
      albumsUserList: store.albums.albumsUserList,
      fetchingAlbumsUserList: store.albums.fetchingAlbumsUserList,
      fetchedAlbumsUserList: store.albums.fetchedAlbumsUserList,
  
      albumsPlaceList: store.albums.albumsPlaceList,
      fetchingAlbumsPlaceList: store.albums.fetchingAlbumsPlaceList,
      fetchedAlbumsPlaceList: store.albums.fetchedAlbumsPlaceList,
    };
  })(TopMenu);
  
  export default TopMenu
