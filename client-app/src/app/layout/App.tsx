import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import NavBar from "../../features/nav/NavBar";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import LoadingComponent from "./LoadingComponent";
import PostStore from "../stores/postStore";

const App = () => {
  const postStore = useContext(PostStore);
  const { loadPosts, loadingInitial } = postStore;
  useEffect(() => {
    loadPosts();
  }, [postStore]);

  if (loadingInitial)
    return <LoadingComponent inverted={true} content="Loading posts..." />;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <PostDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
