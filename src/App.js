import React from 'react';

import './index.css';
import './App.css';

import Toolbar from './components/toolbar/toolbar';
import Graph from './components/graph/graph';
import Fact from './components/fact/fact';
import ProfileDisplay from './components/profile/profile-display';

/*
    Main App Component :: Renders Components Top to Bottom
*/
const App = () => {

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
