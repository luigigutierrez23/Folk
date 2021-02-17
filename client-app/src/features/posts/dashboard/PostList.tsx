import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Header, Item, Label } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

import PostListItem from "./PostListItem";

export default observer(function PostList() {
  const { postStore } = useStore();
  const { groupedPosts } = postStore;
  return (
    <>
      {groupedPosts.map(([group, posts]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          <Item.Group divided>
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </>
  );
});
