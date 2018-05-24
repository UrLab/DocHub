import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  browserHistory,
} from 'react-router-dom';

import configureStore from './store';
import Home from './components/Home';
import Profile from './components/Profile';
import Skeleton from './components/Skeleton';

const Main = () => (
  <Provider store={configureStore({})} history={browserHistory}>
    <Router>
      <Skeleton>
        <Route path="/" component={Home}/>
        <Route path="/users/settings/" component={Profile}/>
      </Skeleton>
    </Router>
  </Provider>
);

ReactDOM.render(<Main/>,
  document.getElementById('react-profile')
);
