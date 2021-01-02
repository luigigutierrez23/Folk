export interface IPost {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
}

export interface IPostFormValues extends Partial<IPost> {
  time?: Date;
}

export class PostFormValues implements IPostFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city: string = "";
  venue: string = "";

  constructor(init?: IPostFormValues) {
    if (init && init.date) {
      init.time = init.date;
    }

    Object.assign(this, init);
  }
}
