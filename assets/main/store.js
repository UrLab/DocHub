import { useState, useCallback } from "react";
import { createContainer } from "unstated-next";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

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

export const useForceStoreUpdate = url => {
  const [signal, setSignal] = useState(true);
  const fireSignal = () => { setSignal(!signal) }
  
  const { setStore } = StoreContainer.useContainer()

  const forceStoreUpdate = useCallback(() => {
    axios.get(url)
    .then(res => {
      setStore(res.data)
      fireSignal();
    })
  })
  return forceStoreUpdate;
}
