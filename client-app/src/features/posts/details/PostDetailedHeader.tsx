import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Image, Item, Segment } from "semantic-ui-react";
import { format } from "date-fns";

import { IPost } from "../../../app/models/post";

const postImageStyle = {
  filter: "brightness(30%)",
};

const postImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const PostDetailedHeader: React.FC<{ post: IPost }> = ({ post }) => {
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${post.category}.jpg`}
          fluid
          style={postImageStyle}
        />
        <Segment basic style={postImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={post.title}
                  style={{ color: "white" }}
                />
                <p>{format(post.date, "eeee do MMMM")}</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        <Button color="teal">Join Activity</Button>
        <Button>Cancel attendance</Button>
        <Button
          as={Link}
          to={`/manage/${post.id}`}
          color="orange"
          floated="right"
        >
          Manage Event
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default observer(PostDetailedHeader);
