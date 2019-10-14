"use strict";

import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Nav from './Nav.js';
import Root from './Root.js';
import Syslogin from './Syslogin.js';
import Footer from './Footer.js';
import { StoreContainer } from "./store";

const BodyComp = (props) => {

  const {store, setStore} = StoreContainer.useContainer();

  useEffect(() => {
    window.$(document).foundation();
  })

  const signalRef = useRef(true);
  const fireSignal = () => { signalRef.current = !signalRef.current };

  useEffect(() => {
    props.history.listen((loc, act) => {
      // console.log("fireSignal")
      fireSignal()
    })
  }, [])

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("fetch")
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const res = await fetch("/spa"+props.location.pathname, {});
        const json = await res.json();
        setStore(json)
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [signalRef.current]);

  // console.log("body render")
  if (isLoading) {
    // console.log("loading")
    return <div>Loading...</div>
  }

  return (
    <div>
      <Nav/>
      <div className="row">
        <Switch>
          <Route exact path="/" component={Root} />
          <Route path="/syslogin" component={Syslogin} />
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

const Body = withRouter(BodyComp);

const App = () => {
  return (
    <StoreContainer.Provider>
      <Router>
        <Body />
      </Router>
    </StoreContainer.Provider>
  );
}

export default App;
