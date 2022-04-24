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
  switch(action.type) {
    case 'set':
      return [...state.filter(d => d.id != action.payload), action.payload];

    case 'create':
      return [...state, {...action.payload, id: new Date().getTime()}];

    case 'delete':
      return [...state.filter(d => d.id != action.payload)];

    default: return state;
  }
}

//Priority Search
export const prioritySearch = (search = '', include = true) => {
    const result = DOGS.map((d) => {
        if(!search || !search.length) return {id: d.id, score: 0};

        let score = 0;
        if(search.toLowerCase().includes(d.id.toString())) score += 10.0;
        if(search.toLowerCase().includes(d.name.toLowerCase())) score += 5.0;
        if(search.toLowerCase().includes(d.owner.toLowerCase())) score += 3.0;
        if(search.toLowerCase().includes(d.breed.toLowerCase())) score += 2.0;
        if(search.toLowerCase().includes(d.size.toLowerCase())) score += 2.0;
        else if(search.toLowerCase().includes('extra small') && d.size === 'XS') score += 2.0;
        else if(search.toLowerCase().includes('small') && d.size === 'SM') score += 2.0;
        else if(search.toLowerCase().includes('medium') && d.size === 'MD') score += 2.0;
        else if(search.toLowerCase().includes('large') && d.size === 'LG') score += 2.0;
        else if(search.toLowerCase().includes('extra large') && d.size === 'XL') score += 2.0;
        search.split(' ').forEach(w => {
        if(d.description.toLowerCase().includes(w)) score += 0.5;
        });

        return {id: d.id, score: score * (include ? 1 : -1)};
    }).sort((a,b) => b.score-a.score);

  console.log(`Sorted ${include ? 'Inclusive' : 'Exclusive'} List`, `Search: ${search}`, result);
  return result;
}

const initialSelection = DOGS.map(d => ({id: d.id, score: 0})); //All

const selectionReducer = (state = initialSelection, action) => {
  if(!action.payload || !action.payload.length)
    return initialSelection;

  switch(action.type) {
    case 'sort-include':
      return [...prioritySearch(action.payload, true)];
    case 'filter-include':
      return [...prioritySearch(action.payload, true).filter(d => d.score > 0)];
    case 'sort-exclude':
        return [...prioritySearch(action.payload, false)];
    case 'filter-exclude':
        return [...prioritySearch(action.payload, false).filter(d => d.score < 0)];

    default: return initialSelection; 
  }
}

//Setup Store
const allStateDomains = combineReducers({
  dogs: dogsReducer,
  selection: selectionReducer
});

const store = createStore(allStateDomains,{});;

export default  store;
