import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Image } from "semantic-ui-react";

import PostStore from "../../../app/stores/postStore";

const PostDetails: React.FC = () => {
  const postStore = useContext(PostStore);
  const { selectedPost: post, openEditForm, cancelSelectedPost } = postStore;
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${post!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{post!.title}</Card.Header>
        <Card.Meta>
          <span>{post!.date}</span>
        </Card.Meta>
        <Card.Description>{post!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() => openEditForm(post!.id)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={cancelSelectedPost}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(PostDetails);
