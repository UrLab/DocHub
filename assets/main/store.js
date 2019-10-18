import { useState, useCallback, useRef } from "react";
import createContainer from "./Container.js";
import axios from 'axios';

const useStore = () => {
  const [store, setter] = useState({
    user: {
      is_authenticated: false
    }
  });
  const ref = useRef(store);

  const setStore = newStore => {
    console.log("setStore")
    console.log(newStore)
    ref.current = Object.assign({}, ref.current, newStore);
    setter(ref.current)
  }

  return {
    store,
    setStore
  };
};

export const { Provider, useContainer } = createContainer(useStore);

export const useForceStoreUpdate = url => {
  const [signal, setSignal] = useState(true);

  const { setStore } = useContainer();

  const forceStoreUpdate = useCallback(() => {
    axios.get(url)
    .then(res => {
      setStore(res.data)
    })
  })
  return forceStoreUpdate;
}
