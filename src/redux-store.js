import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import{Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

//Initial Profiles
import DOGS from './assets/dogs.js';

const dogsReducer = (state = DOGS, action) => { 
  return DOGS;
}

//Priority Search
const prioritySearch = (search = '', include = true) => {
    
}

const initialSelection = DOGS.map(d => ({id: d.id, score: 0})); //All

const selectionReducer = (state = initialSelection, action) => {
  return initialSelection;
}

//Setup Store
const allStateDomains = combineReducers({
  dogs: dogsReducer,
  selection: selectionReducer
});

const store = createStore(allStateDomains,{});;

export default  store;
