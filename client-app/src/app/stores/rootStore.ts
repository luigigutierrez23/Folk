import { configure } from "mobx";
import { createContext } from "react";

import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import PostStore from "./postStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {
  postStore: PostStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;

  constructor() {
    this.postStore = new PostStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
