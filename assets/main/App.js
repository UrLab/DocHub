"use strict";

import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import Nav from './Nav.js';
import Root from './Root.js';
import Syslogin from './Syslogin.js';
import UserSettings from './UserSettings.js';
import Categories from './Categories.js';
import Courses from './Courses.js';
import UploadFile from './UploadFile.js';
import Notification from './Notification.js';
import Documents from './Documents.js';
import DocumentEdit from './DocumentEdit.js';
import Footer from './Footer.js';

const App = () => {
  return (
      <Router>
        <Nav/>
        <div className="row">
          <Switch>
            <Route exact path="/" component={ Root } />
            <Route path={ Urls.syslogin() } component={ Syslogin } />
            <Route path={ Urls.settings() } component={ UserSettings } />
            <Route path="/categories/:id" component={ Categories } />
            <Route path="/courses/:slug" component={ Courses } />
            <Route path="/documents/upload/:slug" component={ UploadFile } />
            <Route path={ Urls.notifications() } component={ Notification } />
            <Route exact path="/documents/:id" component={ Documents } />
            <Route path="/documents/:id/edit" component={ DocumentEdit } />
          </Switch>
        </div>
        <Footer/>
      </Router>
  );
}

export default App;
