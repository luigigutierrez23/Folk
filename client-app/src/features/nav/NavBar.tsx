import React from "react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

const NavBar: React.FC = () => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          Folk
        </Menu.Item>
        <Menu.Item name="Posts" as={NavLink} to="/posts" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/create-post"
            positive
            content="Create Post"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
