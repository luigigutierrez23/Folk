import { makeAutoObservable, runInAction } from "mobx";
import { format } from "date-fns";
import { Post } from "../models/post";

import agent from "../api/agent";

export default class PostStore {
  postRegistry = new Map<string, Post>();
  selectedPost: Post | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get postsByDate() {
    return Array.from(this.postRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedPosts() {
    return Object.entries(
      this.postsByDate.reduce((posts, post) => {
        const date = format(post.date!, "dd MMM yyyy");
        posts[date] = posts[date] ? [...posts[date], post] : [post];
        return posts;
      }, {} as { [key: string]: Post[] })
    );
  }

  // Methods
  loadPosts = async () => {
    this.loadingInitial = true;
    try {
      const posts = await agent.Posts.list();
      posts.forEach((post) => {
        this.setPost(post);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.error(err);
      this.setLoadingInitial(false);
    }
  };

  loadPost = async (id: string) => {
    let post = this.getPost(id);

    if (post) {
      this.selectedPost = post;
      return post;
    } else {
      this.loadingInitial = true;
      try {
        post = await agent.Posts.details(id);
        this.setPost(post);
        runInAction(() => {
          this.selectedPost = post;
        });
        this.setLoadingInitial(false);
        return post;
      } catch (err) {
        this.setLoadingInitial(false);
        console.error(err);
      }
    }
  };

  createPost = async (post: Post) => {
    this.loading = true;
    try {
      await agent.Posts.create(post);
      runInAction(() => {
        this.postRegistry.set(post.id, post);
        this.selectedPost = post;
        this.editMode = false;
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updatePost = async (post: Post) => {
    this.loading = true;
    try {
      await agent.Posts.update(post);
      runInAction(() => {
        this.postRegistry.set(post.id, post);
        this.selectedPost = post;
        this.editMode = false;
        this.loading = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePost = async (id: string) => {
    this.loading = true;
    try {
      await agent.Posts.delete(id);
      runInAction(() => {
        this.postRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  private setPost = (post: Post) => {
    post.date = new Date(post.date!);
    this.postRegistry.set(post.id, post);
  };

  private getPost = (id: string) => {
    return this.postRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
}
