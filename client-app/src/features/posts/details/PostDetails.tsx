import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Image } from "semantic-ui-react";
import { Link, RouteComponentProps } from "react-router-dom";

import PostStore from "../../../app/stores/postStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";

interface DetailParams {
  id: string;
}

const PostDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const postStore = useContext(PostStore);
  const { post, loadPost, loadingInitial } = postStore;

  useEffect(() => {
    loadPost(match.params.id);
  }, [loadPost, match.params.id]);

  if (loadingInitial || !post)
    return <LoadingComponent inverted={true} content="Loading post..." />;

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
            as={Link}
            to={`/manage/${post.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => history.push("/posts")}
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
