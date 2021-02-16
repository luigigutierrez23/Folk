import { SyntheticEvent } from "react";
import { observable, action, computed, runInAction } from "mobx";
import "mobx-react-lite/batchingForReactDom";

import agent from "../api/agent";
import { IPost } from "../models/post";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

export default class PostStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable postRegistry = new Map();
  @observable post: IPost | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get postsByDate() {
    return this.groupPostsByDate(Array.from(this.postRegistry.values()));
  }

  groupPostsByDate(posts: IPost[]) {
    const sortedPosts = posts.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedPosts.reduce((posts, post) => {
        const date = post.date.toISOString().split("T")[0];
        posts[date] = posts[date] ? [...posts[date], post] : [post];
        return posts;
      }, {} as { [key: string]: IPost[] })
    );
  }

  @action loadPosts = async () => {
    this.loadingInitial = true;
    try {
      const posts = await agent.Posts.list();
      runInAction("loading posts", () => {
        posts.forEach((post) => {
          post.date = new Date(post.date);
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
      return post;
    } else {
      this.loadingInitial = true;
      try {
        post = await agent.Posts.details(id);
        runInAction("Getting post", () => {
          post.date = new Date(post.date);
          this.post = post;
          this.postRegistry.set(post.id, post);
          this.loadingInitial = false;
        });
        return post;
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
      history.push(`/posts/${post.id}`);
    } catch (err) {
      runInAction("Create new post error", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.error(err.response);
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
      history.push(`/posts/${post.id}`);
    } catch (err) {
      runInAction("Edit post error", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.error(err.response);
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
