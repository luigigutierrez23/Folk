import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import { IPost } from "../../../app/models/post";
import { v4 as uuid } from "uuid";
import PostStore from "../../../app/stores/postStore";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const PostForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const postStore = useContext(PostStore);
  const {
    createPost,
    editPost,
    submitting,
    post: initialFormState,
    loadPost,
    clearPost,
  } = postStore;

  const [post, setPost] = useState<IPost>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && post.id.length === 0) {
      loadPost(match.params.id).then(
        () => initialFormState && setPost(initialFormState)
      );
    }

    return () => {
      clearPost();
    };
  }, [loadPost, match.params.id, clearPost, initialFormState, post.id.length]);

  const handleSubmit = () => {
    if (post.id.length === 0) {
      let newPost = {
        ...post,
        id: uuid(),
      };

      createPost(newPost).then(() => history.push(`/posts/${newPost.id}`));
    } else {
      editPost(post).then(() => history.push(`/posts/${post.id}`));
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setPost({ ...post, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange}
              name="title"
              placeholder="Title"
              value={post.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name="description"
              placeholder="Description"
              value={post.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name="category"
              placeholder="Category"
              value={post.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name="date"
              type="datetime-local"
              placeholder="Date"
              value={post.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name="city"
              placeholder="City"
              value={post.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name="venue"
              placeholder="Venue"
              value={post.venue}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => history.push("/posts")}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(PostForm);
