import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { format } from "date-fns";

import { Post } from "../../../app/models/post";

interface Props {
  post: Post;
}

export default function ActivityListItem({ post }: Props) {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={post.id}>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <Item.Content>
              <Item.Header as={Link} to={`/posts/${post.id}`}>
                {post.title}
              </Item.Header>
              <Item.Description>Hosted by Luigi</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(post.date!, "dd MMM yyyy h:mm aa")}
          <Icon name="marker" /> {post.venue}
        </span>
      </Segment>
      <Segment secondary>Attendes will go here</Segment>
      <Segment clearing>
        <span>{post.description}</span>
        <Button
          as={Link}
          to={`/posts/${post.id}`}
          floated="right"
          content="View"
          color="teal"
        />
      </Segment>
    </Segment.Group>
  );
}
