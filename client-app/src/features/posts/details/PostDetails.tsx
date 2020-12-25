import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router-dom";

import PostStore from "../../../app/stores/postStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedSideBar from "./PostDetailedSideBar";

interface DetailParams {
  id: string;
}

const PostDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
}) => {
  const postStore = useContext(PostStore);
  const { post, loadPost, loadingInitial } = postStore;

  useEffect(() => {
    loadPost(match.params.id);
  }, [loadPost, match.params.id]);

  if (loadingInitial || !post)
    return <LoadingComponent inverted={true} content="Loading post..." />;

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
