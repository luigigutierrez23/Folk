import React from "react";
import { Grid } from "semantic-ui-react";
import { IPost } from "../../../app/models/post";

import PostDetails from "../details/PostDetails";
import PostForm from "../form/PostForm";
import PostList from "./PostList";

interface IProps {
  posts: IPost[];
  selectPost: (id: string) => void;
  selectedPost: IPost | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedPost: (post: IPost | null) => void;
  createPost: (post: IPost) => void;
  editPost: (post: IPost) => void;
  deletePost: (id: string) => void;
}

const PostDashboard: React.FC<IProps> = ({
  posts,
  selectPost,
  selectedPost,
  editMode,
  setEditMode,
  setSelectedPost,
  createPost,
  editPost,
  deletePost,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <PostList
          posts={posts}
          selectPost={selectPost}
          deletePost={deletePost}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedPost && !editMode && (
          <PostDetails
            post={selectedPost}
            setEditMode={setEditMode}
            setSelectedPost={setSelectedPost}
          />
        )}
        {editMode && (
          <PostForm
            key={(selectedPost && selectedPost.id) || 0}
            setEditMode={setEditMode}
            post={selectedPost}
            createPost={createPost}
            editPost={editPost}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PostDashboard;
