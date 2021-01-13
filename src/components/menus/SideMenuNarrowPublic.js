import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  Dropdown,
  Icon,
  Menu,
} from "semantic-ui-react";

class SideMenuNarrowPublic extends Component {
    render() {
      return (
        <Menu
          borderless
          icon="labeled"
          vertical
          fixed="left"
          floated
          pointing
          width="thin"
        >
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
  
          <Dropdown
            pointing="left"
            item
            icon={
              <Icon.Group size="big">
                <Icon name="globe" />
              </Icon.Group>
            }
          >
            <Dropdown.Menu>
              <Dropdown.Header>Public</Dropdown.Header>
              <Dropdown.Item as={Link} to="/users/">
                <Icon name="users" />
                {"  Users"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div style={{ marginTop: -17 }}>
            <small>Public</small>
          </div>
        </Menu>
      );
    }
  }
  
 export default SideMenuNarrowPublic
