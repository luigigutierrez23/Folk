import { createContext, SyntheticEvent } from "react";
import { observable, action, computed, configure, runInAction } from "mobx";
import "mobx-react-lite/batchingForReactDom";

import agent from "../api/agent";
import { IPost } from "../models/post";

configure({ enforceActions: "always" });

class PostStore {
  @observable postRegistry = new Map();
  @observable post: IPost | null = null;
  @observable loadingInitial = false;
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

  @action loadPost = async (id: string) => {
    let post = this.getPost(id);

    if (post) {
      this.post = post;
    } else {
      this.loadingInitial = true;
      try {
        post = await agent.Posts.details(id);
        runInAction("Getting post", () => {
          this.post = post;
          this.loadingInitial = false;
        });
      } catch (err) {
        runInAction("Get post error", () => {
          this.loadingInitial = false;
        });
        console.error(err);
      }
    }
  };

  @action clearPost = () => {
    this.post = null;
  };

  getPost = (id: string) => {
    return this.postRegistry.get(id);
  };

  @action createPost = async (post: IPost) => {
    this.submitting = true;
    try {
      await agent.Posts.create(post);
      runInAction("Create new post", () => {
        this.postRegistry.set(post.id, post);
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
        this.post = post;
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
}

export default createContext(new PostStore());
