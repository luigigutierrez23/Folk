import React from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { IPost } from "../../../app/models/post";

interface IProps {
  posts: IPost[];
  selectPost: (id: string) => void;
  deletePost: (id: string) => void;
}

const PostList: React.FC<IProps> = ({ posts, selectPost, deletePost }) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {posts.map((post) => (
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
                  onClick={() => deletePost(post.id)}
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

export default PostList;
