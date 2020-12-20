import React from "react";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import { IPost } from "../../../app/models/post";

interface IProps {
  post: IPost;
  setEditMode: (editMode: boolean) => void;
  setSelectedPost: (post: IPost | null) => void;
}

const PostDetails: React.FC<IProps> = ({
  post,
  setEditMode,
  setSelectedPost,
}) => {
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${post.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{post.title}</Card.Header>
        <Card.Meta>
          <span>{post.date}</span>
        </Card.Meta>
        <Card.Description>{post.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() => setEditMode(true)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => setSelectedPost(null)}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default PostDetails;
