import { useState } from "react";
import { createContainer } from "unstated-next";

const useStore = () => {
  const [user, setUser] = useState(Object.assign(window.store.user));
  const [store, setter] = useState(window.store);

  const setStore = newStore => {
    if (newStore.hasOwnProperty("user")) {
      setUser(Object.assign(user, newStore.user))
    }
    console.log("setStore")
    console.log(newStore)
    setter(Object.assign(store, newStore))
  }

  return {
    store,
    user,
    setStore
  };
};

export const StoreContainer = createContainer(useStore);
