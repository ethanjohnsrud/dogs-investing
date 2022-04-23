import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './index.css';
import './App.css';

//IMPORTING COMPONENTS
import ProfileDisplay from './components/profile/profile-display';
import ProfileIcon from './components/profile/profile-icon';
import ProfileDetail from './components/profile/profile-detail';
import ProfileEdit from './components/profile/profile-edit';
import Graph from './components/graph/graph';
import Fact from './components/fact/fact';

//Import Initial Data OR API Call

function App() {
  const DOGS = useSelector(root => root.dogs);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch({type: 'sort-include', payload: 'american brandon'});
},[]);


  return (
    <div className="App">
     
      <ProfileDisplay />
      {/* <ProfileIcon {...DOGS[0]} /> */}

      {/* <ProfileDetail />
      <ProfileEdit />

      <Fact />

      <Graph /> */}

    </div>
  );
}

export default App;
