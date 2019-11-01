import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useContainer } from "./store";
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const zipf = (a1, a2, f) => {
  return a1.reduce((acc, e, i) => {
    return { ...acc, ...f(e, a2[i]) }
  }, {})
}

const fetch_all = ({props, ref, setStore, get_url, is_reload}) => {
  const filtered_props = props.filter(({refetch_on_params_change}) => (
    !is_reload || !!refetch_on_params_change
  ));

  axios.all(
    filtered_props.map(({ endpoint, prefix }) => {
      const url = get_url(endpoint, prefix);
      return axios.get(url)
    })
  ).then(axios.spread((...all_res) => {
    const newStore = zipf(all_res, filtered_props, ( { data }, { store_as } ) => {
      return ( !store_as ? data : { [store_as] : data } )
    })
    ref.current = false;
    setStore(newStore)
  }))
  .catch(err => {
    console.log(err)
    for (var {ignore_failure} of filtered_props) {
      if (ignore_failure) {
        ref.current = false;
        setStore({})
        break;
      }
    }
  })
}

const Fetch = ({children, props}) => {
  if (!Array.isArray(props)) {
      props = [ props ]
  }
  const { setStore } = useContainer();
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
    fetch_all({props, ref, setStore, get_url, is_reload: false})
  }, [])


  // FETCH ON PARAM CHANGE
  const params = useParams();
  const oldLocRef = useRef(null);

  useEffect(() => {
    if (!!oldLocRef.current) {
      fetch_all({props, ref, setStore, get_url, is_reload: true})
    }
    oldLocRef.current = location;
  }, [params])


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
