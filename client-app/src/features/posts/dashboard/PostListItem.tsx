import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { format } from "date-fns";

import { Post } from "../../../app/models/post";
import PostListItemAttendee from "./PostListItemAttendee";

interface Props {
  post: Post;
}

export default function ActivityListItem({ post }: Props) {
  return (
    <Segment.Group>
      <Segment>
        {post.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{ textAlign: "center" }}
          />
        )}
        <Item.Group>
          <Item key={post.id}>
            <Item.Image
              style={{ marginBottom: 3 }}
              size="tiny"
              circular
              src="/assets/user.png"
            />
            <Item.Content>
              <Item.Header as={Link} to={`/posts/${post.id}`}>
                {post.title}
              </Item.Header>
              <Item.Description>
                Hosted by {post.host?.displayName}
              </Item.Description>
              {post.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this post
                  </Label>
                </Item.Description>
              )}
              {post.isGoing && !post.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    You are goint to this post
                  </Label>
                </Item.Description>
              )}
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
      <Segment secondary>
        <PostListItemAttendee attendees={post.attendees!} />
      </Segment>
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
