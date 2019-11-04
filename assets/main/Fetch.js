import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useContainer } from "./store";
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const zipf = (a1, a2, f) => {
  return a1.reduce((acc, e, i) => {
    return { ...acc, ...f(e, a2[i]) }
  }, {})
}

const filtered = (params, keys) => {
  var res = [];
  for (var key of keys) {
    res.push(params[key])
  }
  return res
}

const get_url = (format, endp, pref, location, params) => {
  return ( !endp ?
    ( !pref ?
      ( !format ?
        location.pathname
      :
        format[0](filtered(params, format[1]))
      )
    :
      pref+location.pathname
    )
  :
    endp
  )
}

const fetch_all = ({props, ref, setStore, location, params, is_reload}) => {
  const filtered_props = props.filter(({refetch_on_params_change}) => (
    !is_reload || !!refetch_on_params_change
  ));

  axios.all(
    filtered_props.map(({ format, endpoint, prefix }) => {
      const url = get_url(format, endpoint, prefix, location, params);
      return axios.get(url)
    })
  ).then(axios.spread((...all_res) => {
    const newStore = zipf(all_res, filtered_props, ( { data }, { store_as, flatten } ) => {
      if (!!flatten) data = data.results;
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

export const useFetch = () => {
  const { setStore } = useContainer();
  const location = useLocation();
  const params = useParams();

  return props => {
    if (!Array.isArray(props)) {
        props = [ props ]
    }
    axios.all(
      props.map(({ format, endpoint, prefix }) => {
        const url = get_url(format, endpoint, prefix, location, params);
        return axios.get(url)
      })
    ).then(axios.spread((...all_res) => {
      const newStore = zipf(all_res, props, ( { data }, { store_as } ) => {
        return ( !store_as ? data : { [store_as] : data } )
      })
      setStore(newStore)
    }))
    .catch(err => {
      console.log(err)
      for (var {ignore_failure} of props) {
        if (ignore_failure) {
          setStore({})
          break;
        }
      }
    })
  }
}

const Fetch = ({children, props}) => {
  if (!Array.isArray(props)) {
      props = [ props ]
  }
  const { setStore } = useContainer();
  const location = useLocation();
  const ref = useRef(true);

  useEffect(() => {
    fetch_all({props, ref, setStore, location, params, is_reload: false})
  }, [])


  // FETCH ON PARAM CHANGE
  const params = useParams();
  const oldLocRef = useRef(null);

  useEffect(() => {
    if (!!oldLocRef.current) {
      fetch_all({props, ref, setStore, location, params, is_reload: true})
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
