import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useContainer } from "./store";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const zipf = (a1, a2, f) => {
  return a1.reduce((acc, e, i) => {
    return { ...acc, ...f(e, a2[i]) }
  }, {})
}

const Fetch = ({children, props}) => {
  const { store, setStore } = useContainer();
  const location = useLocation();
  const ref = useRef(true);

  const get_url = (endp, pref) => {
    return ( !endp ?
      ( !pref ?
        location.pathname
      :
        pref+location.pathname
      )
    :
      endp
    )
  }
  useEffect(() => {
    if (!Array.isArray(props)) {
        props = [ props ]
    }
    axios.all(
      props.map(({ endpoint, prefix }) => {
        const url = get_url(endpoint, prefix);
        return axios.get(url)
      })
    ).then(axios.spread((...all_res) => {
      const newStore = zipf(all_res, props, ( { data }, { store_as } ) => {
        return ( !store_as ? data : { [store_as] : data } )
      })
      ref.current = false;
      setStore(newStore)
    }))
  }, [])

  if (ref.current) {
    return <div>Loading...</div>
  }

  return (
    <div>
      { ...children }
    </div>
  )
}

export const with_fetch = (Component, fetch_props) => props => (
  <Fetch props={ fetch_props }>
    <Component/>
  </Fetch>
)

export default Fetch;
