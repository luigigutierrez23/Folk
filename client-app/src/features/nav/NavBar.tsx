import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Button, Container, Menu } from "semantic-ui-react";

import PostStore from "../../app/stores/postStore";

const NavBar: React.FC = () => {
  const postStore = useContext(PostStore);
  const { openCreateForm } = postStore;
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          Folk
        </Menu.Item>
        <Menu.Item name="messages" />
        <Menu.Item>
          <Button onClick={openCreateForm} positive content="Create Post" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
