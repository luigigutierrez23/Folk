import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedSideBar from "./PostDetailedSideBar";

export default observer(function PostDetails() {
  const { postStore } = useStore();
  const { selectedPost: post, loadPost, loadingInitial } = postStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadPost(id);
  }, [id, loadPost]);

  if (loadingInitial || !post) return <LoadingComponent />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <PostDetailedHeader post={post} />
        <PostDetailedInfo post={post} />
        <PostDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <PostDetailedSideBar post={post} />
      </Grid.Column>
    </Grid>
  );
});
