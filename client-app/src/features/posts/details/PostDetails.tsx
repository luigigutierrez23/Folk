import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router-dom";

import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedSideBar from "./PostDetailedSideBar";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface DetailParams {
  id: string;
}

const PostDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { post, loadPost, loadingInitial } = rootStore.postStore;

  useEffect(() => {
    loadPost(match.params.id);
  }, [loadPost, match.params.id, history]);

  if (loadingInitial)
    return <LoadingComponent inverted={true} content="Loading post..." />;

  if (!post) return <h2>Post not found</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <PostDetailedHeader post={post} />
        <PostDetailedInfo post={post} />
        <PostDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <PostDetailedSideBar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(PostDetails);
