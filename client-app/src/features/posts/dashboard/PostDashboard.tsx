import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import PostList from "./PostList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";

const PostDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadPosts, loadingInitial } = rootStore.postStore;

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (loadingInitial)
    return <LoadingComponent inverted={true} content="Loading posts..." />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <PostList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Post Filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(PostDashboard);
