import React, { SyntheticEvent } from "react";
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
  deletePost: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
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
  submitting,
  target,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <PostList
          posts={posts}
          selectPost={selectPost}
          deletePost={deletePost}
          submitting={submitting}
          target={target}
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
            submitting={submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PostDashboard;
