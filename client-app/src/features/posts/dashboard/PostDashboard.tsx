import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

import PostList from "./PostList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostFilters from "./PostFilters";

export default observer(function PostDashboard() {
  const { postStore } = useStore();
  const { loadPosts, postRegistry, loadingInitial } = postStore;

  useEffect(() => {
    if (postRegistry.size <= 1) loadPosts();
  }, [postRegistry.size, loadPosts]);

  if (loadingInitial)
    return <LoadingComponent inverted={true} content="Loading posts..." />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <PostList />
      </Grid.Column>
      <Grid.Column width={6}>
        <PostFilters />
      </Grid.Column>
    </Grid>
  );
});
