import React, { Fragment, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Item, Label } from "semantic-ui-react";

import PostListItem from "./PostListItem";
import { RootStoreContext } from "../../../app/stores/rootStore";

const PostList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { postsByDate } = rootStore.postStore;
  return (
    <Fragment>
      {postsByDate.map(([group, posts]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(PostList);
