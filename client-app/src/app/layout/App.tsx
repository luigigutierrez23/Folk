import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { IPost } from "../models/post";

import NavBar from "../../features/nav/NavBar";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";

const App = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectPost = (id: string) => {
    setSelectedPost(posts.filter((x) => x.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedPost(null);
    setEditMode(true);
  };

  const handleCreatePost = (post: IPost) => {
    setPosts([...posts, post]);
    setSelectedPost(post);
    setEditMode(false);
  };

  const handleEditPost = (post: IPost) => {
    setPosts([...posts.filter((x) => x.id !== post.id), post]);
    setSelectedPost(post);
    setEditMode(true);
  };

  const handleDeletePost = (id: string) => {
    setPosts([...posts.filter((x) => x.id !== id)]);
  };

  useEffect(() => {
    axios.get<IPost[]>("http://localhost:5000/api/posts").then((response) => {
      let posts: IPost[] = [];
      response.data.forEach((post) => {
        post.date = post.date.split(".")[0];
        posts.push(post);
      });
      setPosts(posts);
    });
  }, []);

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
        />
      </Container>
    </Fragment>
  );
};

export default App;
