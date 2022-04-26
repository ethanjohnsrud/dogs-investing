import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './index.css';
import './App.css';

//IMPORTING COMPONENTS
import ProfileDisplay from './components/profile/profile-display';
import ProfileIcon from './components/profile/profile-icon';
import ProfileDetail from './components/profile/profile-detail';
import Graph from './components/graph/graph';
import Fact from './components/fact/fact';
import Toolbar from './components/toolbar/toolbar';

//Import Initial Data OR API Call

function App() {
  const DOGS = useSelector(root => root.dogs).profiles;
  const dispatch = useDispatch();

  return (
    <div className="App">
      <Toolbar />
      <br/>
      <Graph />
      <ProfileDisplay />
      <Fact />

      {/* <ProfileDetail {...DOGS[7]} mode={'edit'} onClose={()=>{}} /> */}
    </div>
  );
}

export default App;
