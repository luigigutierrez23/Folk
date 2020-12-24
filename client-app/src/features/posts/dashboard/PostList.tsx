import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Button, Item, Label, Segment } from "semantic-ui-react";

import PostStore from "../../../app/stores/postStore";

const PostList: React.FC = () => {
  const postStore = useContext(PostStore);
  const { postsByDate, selectPost, deletePost, submitting, target } = postStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {postsByDate.map((post) => (
          <Item key={post.id}>
            <Item.Content>
              <Item.Header as="a">{post.title}</Item.Header>
              <Item.Meta>{post.date}</Item.Meta>
              <Item.Description>
                <div>{post.description}</div>
                <div>
                  {post.city},{post.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectPost(post.id)}
                  floated="right"
                  content="View"
                  color="blue"
                ></Button>
                <Button
                  name={post.id}
                  loading={target === post.id && submitting}
                  onClick={(e) => deletePost(e, post.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                ></Button>
                <Label basic content={post.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(PostList);
