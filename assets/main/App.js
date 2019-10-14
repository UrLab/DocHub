"use strict";

import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Nav from './Nav.js';
import Root from './Root.js';
import Syslogin from './Syslogin.js';
import UserSettings from './UserSettings.js';
import Footer from './Footer.js';
import { StoreContainer } from "./store";

const ContentComp = props => {

  const {store, setStore} = StoreContainer.useContainer();

  useEffect(() => {
    window.$(document).foundation();
  })

  const signalRef = useRef(true);
  const fireSignal = () => { signalRef.current = !signalRef.current };

  useEffect(() => {
    props.history.listen((loc, act) => {
      setIsLoading(true)
      // console.log("fireSignal")
      fireSignal()
    })
  }, [])

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("fetch")
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
          <Route exact path="/" component={ Root } />
          <Route path={ Urls['syslogin']() } component={ Syslogin } />
          <Route path={ Urls['settings']() } component={ UserSettings } />
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

const Content = withRouter(ContentComp);

const App = () => {
  return (
    <StoreContainer.Provider>
      <Router>
        <Content />
      </Router>
    </StoreContainer.Provider>
  );
}

export default App;
