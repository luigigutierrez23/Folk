import { observer } from "mobx-react-lite";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
  const {
    userStore: { user, logout, isLoggedIn },
  } = useStore();

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} exact to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Folk
        </Menu.Item>
        {isLoggedIn && (
          <>
            <Menu.Item name="Posts" as={NavLink} to="/posts" />
            <Menu.Item name="Errors" as={NavLink} to="/errors" />
            <Menu.Item>
              <Button
                as={NavLink}
                to="/create-post"
                positive
                content="Create Post"
              />
            </Menu.Item>
            <Menu.Item position="right">
              <Image
                src={user?.image || "/assets/user.png"}
                avatar
                spaced="right"
              />
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user?.username}`}
                    text="My Profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
});
