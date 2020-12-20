import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IPost } from "../models/post";

import NavBar from "../../features/nav/NavBar";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

const App = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");

  const handleSelectPost = (id: string) => {
    setSelectedPost(posts.filter((x) => x.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedPost(null);
    setEditMode(true);
  };

  const handleCreatePost = (post: IPost) => {
    setSubmitting(true);
    agent.Posts.create(post)
      .then(() => {
        setPosts([...posts, post]);
        setSelectedPost(post);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleEditPost = (post: IPost) => {
    setSubmitting(true);
    agent.Posts.update(post)
      .then(() => {
        setPosts([...posts.filter((x) => x.id !== post.id), post]);
        setSelectedPost(post);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleDeletePost = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Posts.delete(id)
      .then(() => {
        setPosts([...posts.filter((x) => x.id !== id)]);
      })
      .then(() => setSubmitting(false));
  };

  useEffect(() => {
    agent.Posts.list()
      .then((response) => {
        let posts: IPost[] = [];
        response.forEach((post) => {
          post.date = post.date.split(".")[0];
          posts.push(post);
        });
        setPosts(posts);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading)
    return <LoadingComponent inverted={true} content="Loading posts..." />;

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <PostDashboard
          posts={posts}
          selectPost={handleSelectPost}
          selectedPost={selectedPost}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedPost={setSelectedPost}
          createPost={handleCreatePost}
          editPost={handleEditPost}
          deletePost={handleDeletePost}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
