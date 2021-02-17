import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../app/common/form/TextInput";
import CustomTextArea from "../../../app/common/form/TextArea";
import CustomSelectInput from "../../../app/common/form/SelectInput";
import CustomDateInput from "../../../app/common/form/DateInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { Post } from "../../../app/models/post";

export default observer(function PostForm() {
  const history = useHistory();
  const { postStore } = useStore();
  const {
    createPost,
    updatePost,
    loading,
    loadPost,
    loadingInitial,
  } = postStore;
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadPost(id).then((post) => setPost(post!));
  }, [id, loadPost]);

  function handleFormSubmit(post: Post) {
    if (post.id.length === 0) {
      let newPost = {
        ...post,
        id: uuid(),
      };
      createPost(newPost).then(() => history.push(`/posts/${newPost.id}`));
    } else {
      updatePost(post).then(() => history.push(`/posts/${post.id}`));
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Posts Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={post}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <CustomTextInput name="title" placeholder="Title" />
            <CustomTextArea
              rows={3}
              placeholder="Description"
              name="description"
            />
            <CustomSelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <CustomDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <CustomTextInput placeholder="City" name="city" />
            <CustomTextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/posts"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
