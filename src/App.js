import React from 'react';
import { useSelector, useDispatch} from 'react-redux';

import './index.css';
import './App.css';

import Toolbar from './components/toolbar/toolbar';
import Graph from './components/graph/graph';
import Fact from './components/fact/fact';
import ProfileDisplay from './components/profile/profile-display';


const App = () => {
  const DOGS = useSelector(root => root.dogs).profiles;
  const dispatch = useDispatch();

  return (
    <div className="App">
      <Toolbar />
      <br/>
      <Graph />
      <ProfileDisplay />
      <Fact />
    </div>
  );
}

export default App;
