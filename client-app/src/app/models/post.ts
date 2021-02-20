import { Profile } from "./profile";

export interface Post {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[];
}

export class Post implements Post {
  constructor(init?: PostFormValues) {
    Object.assign(this, init);
  }
}

export class PostFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date: Date | null = null;
  city: string = "";
  venue: string = "";

  constructor(post?: PostFormValues) {
    if (post) {
      this.id = post.id;
      this.title = post.title;
      this.category = post.category;
      this.description = post.description;
      this.date = post.date;
      this.city = post.city;
      this.venue = post.venue;
    }
  }
}
