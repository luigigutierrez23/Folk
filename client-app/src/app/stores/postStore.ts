import { createContext, SyntheticEvent } from "react";
import { observable, action, computed, configure, runInAction } from "mobx";
import "mobx-react-lite/batchingForReactDom";

import agent from "../api/agent";
import { IPost } from "../models/post";

configure({ enforceActions: "always" });

class PostStore {
  @observable postRegistry = new Map();
  @observable posts: IPost[] = [];
  @observable selectedPost: IPost | undefined = undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = "";

  @computed get postsByDate() {
    return Array.from(this.postRegistry.values())
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadPosts = async () => {
    this.loadingInitial = true;
    try {
      const posts = await agent.Posts.list();
      runInAction("loading posts", () => {
        posts.forEach((post) => {
          post.date = post.date.split(".")[0];
          this.postRegistry.set(post.id, post);
        });
        this.loadingInitial = false;
      });
    } catch (err) {
      runInAction("load posts error", () => {
        this.loadingInitial = false;
      });
      console.error(err);
    }
  };

  @action createPost = async (post: IPost) => {
    this.submitting = true;
    try {
      await agent.Posts.create(post);
      runInAction("Create new post", () => {
        this.postRegistry.set(post.id, post);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (err) {
      runInAction("Create new post error", () => {
        this.submitting = false;
      });
      console.error(err);
    }
  };

  @action editPost = async (post: IPost) => {
    this.submitting = true;
    try {
      await agent.Posts.update(post);
      runInAction("Edit post", () => {
        this.postRegistry.set(post.id, post);
        this.selectedPost = post;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (err) {
      runInAction("Edit post error", () => {
        this.submitting = false;
      });
      console.error(err);
    }
  };

  @action deletePost = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Posts.delete(id);
      runInAction("Delete post", () => {
        this.postRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (err) {
      runInAction("Delete post error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.error(err);
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedPost = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedPost = this.postRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedPost = () => {
    this.selectedPost = undefined;
  };

  @action cancelOpenForm = () => {
    this.editMode = false;
  };

  @action selectPost = (id: string) => {
    this.selectedPost = this.postRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new PostStore());
