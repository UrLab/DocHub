import { useState } from "react";
import { createContainer } from "unstated-next";

const useStore = () => {
  const [store, setter] = useState(window.store);

  const setStore = newStore => {
    console.log("setStore")
    console.log(newStore)
    setter(Object.assign(store, newStore))
  }

  return {
    store,
    setStore
  };
};

export const StoreContainer = createContainer(useStore);
