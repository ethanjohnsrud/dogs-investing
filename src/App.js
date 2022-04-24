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
  const DOGS = useSelector(root => root.dogs);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch({type: 'sort-include', payload: 'american brandon'});
},[]);


  return (
    <div className="App">

     <Toolbar />
     <br/>
      <Graph />
        <ProfileDisplay />
        {/* <ProfileIcon {...DOGS[0]} /> */}

        {/* <ProfileDetail /> */}

        <Fact />

        {/* <Graph /> */}
    </div>
  );
}

export default App;
