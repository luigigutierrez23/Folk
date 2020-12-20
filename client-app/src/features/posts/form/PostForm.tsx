import React, { FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";

import { IPost } from "../../../app/models/post";
import { v4 as uuid } from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  post: IPost | null;
  createPost: (post: IPost) => void;
  editPost: (post: IPost) => void;
}

const PostForm: React.FC<IProps> = ({
  setEditMode,
  post: initialFormState,
  createPost,
  editPost,
}) => {
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [post, setPost] = useState<IPost>(initializeForm);

  const handleSubmit = () => {
    if (post.id.length === 0) {
      let newPost = {
        ...post,
        id: uuid(),
      };

      createPost(newPost);
    } else {
      editPost(post);
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setPost({ ...post, [name]: value });
  };

  return (
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
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={() => setEditMode(false)}
          floated="right"
          type="submit"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default PostForm;
