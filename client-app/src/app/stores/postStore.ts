import { makeAutoObservable, reaction, runInAction } from "mobx";
import { format } from "date-fns";
import { Post, PostFormValues } from "../models/post";

import agent from "../api/agent";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class PostStore {
  postRegistry = new Map<string, Post>();
  selectedPost: Post | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.postRegistry.clear();
        this.loadPosts();
      }
    );
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
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
      const result = await agent.Posts.list(this.axiosParams);
      result.data.forEach((post) => {
        this.setPost(post);
      });
      this.setPagination(result.pagination);
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

  createPost = async (post: PostFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Posts.create(post);
      const newPost = new Post(post);
      newPost.hostUsername = user!.username;
      newPost.attendees = [attendee];
      this.setPost(newPost);
      runInAction(() => {
        this.selectedPost = newPost;
      });
    } catch (err) {
      console.log(err);
    }
  };

  updatePost = async (post: PostFormValues) => {
    try {
      await agent.Posts.update(post);
      runInAction(() => {
        if (post.id) {
          let updatedPost = { ...this.getPost(post.id), ...post };
          this.postRegistry.set(post.id, updatedPost as Post);
          this.selectedPost = updatedPost as Post;
        }
      });
    } catch (err) {
      console.error(err);
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

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Posts.attend(this.selectedPost!.id);
      runInAction(() => {
        if (this.selectedPost?.isGoing) {
          this.selectedPost.attendees = this.selectedPost.attendees?.filter(
            (a) => a.username !== user?.username
          );
          this.selectedPost.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedPost?.attendees?.push(attendee);
          this.selectedPost!.isGoing = true;
        }
        this.postRegistry.set(this.selectedPost!.id, this.selectedPost!);
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelPostToggle = async () => {
    this.loading = true;
    try {
      await agent.Posts.attend(this.selectedPost!.id);
      runInAction(() => {
        this.selectedPost!.isCancelled = !this.selectedPost?.isCancelled;
        this.postRegistry.set(this.selectedPost!.id, this.selectedPost!);
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendeeFollowing = (username: string) => {
    this.postRegistry.forEach((post) => {
      post.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== "startDate") {
          this.predicate.delete(key);
        }
      });
    };
    switch (predicate) {
      case "all":
        resetPredicate();
        this.predicate.set("all", true);
        break;
      case "isGoing":
        resetPredicate();
        this.predicate.set("isGoing", true);
        break;
      case "isHost":
        resetPredicate();
        this.predicate.set("isHost", true);
        break;
      case "startDate":
        this.predicate.delete("startDate");
        this.predicate.set("startDate", value);
        break;
    }
  };

  private setPost = (post: Post) => {
    const user = store.userStore.user;
    if (user) {
      post.isGoing = post.attendees!.some((a) => a.username === user.username);
      post.isHost = post.hostUsername === user.username;
      post.host = post.attendees?.find((x) => x.username === post.hostUsername);
    }

    post.date = new Date(post.date!);
    this.postRegistry.set(post.id, post);
  };

  private getPost = (id: string) => {
    return this.postRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  clearSelectedPost = () => {
    this.selectedPost = undefined;
  };
}
