import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Profile from './components/Profile';
import Skeleton from './components/Skeleton';
import {
  BrowserRouter as Router,
  Route,
  Link,
  browserHistory,
} from 'react-router-dom';

const Main = () => (
  <Provider store={configureStore({})} history={browserHistory}>
    <Router>
      <Skeleton>
        <Route path="/" component={Profile}/>
      </Skeleton>
    </Router>
  </Provider>
);

ReactDOM.render(<Main/>,
  document.getElementById('react-profile')
);
