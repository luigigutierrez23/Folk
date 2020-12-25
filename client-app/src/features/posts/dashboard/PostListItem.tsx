import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { IPost } from "../../../app/models/post";

const PostListItem: React.FC<{ post: IPost }> = ({ post }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={post.id}>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <Item.Content>
              <Item.Header as="a">{post.title}</Item.Header>
              <Item.Description>Hosted by Luigi</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {post.date}
        <Icon name="marker" /> {post.venue},{post.city}
      </Segment>
      <Segment secondary>Attendes will go here</Segment>
      <Segment clearing>
        <span>{post.description}</span>
        <Button
          as={Link}
          to={`/posts/${post.id}`}
          floated="right"
          content="View"
          color="blue"
        ></Button>
      </Segment>
    </Segment.Group>
  );
};

export default PostListItem;
