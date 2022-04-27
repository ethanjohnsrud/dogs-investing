import React from 'react';
import {createStore, combineReducers} from 'redux';

//Initial Profiles
import INITIAL_DOG_PROFILES from './assets/dogs.js';

/*
    prioritySearch Method :: Sorts profiles on a point system for matching attributes
*/
export const prioritySearch = (profiles, search = '', include = true) => {
    const result = profiles.map((d) => {
        if(!search || !search.length) return {id: d.id, score: d.transactions.reduce((p,t)=>p+t.amount, 0)};

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
        search.toLowerCase().split(' ').forEach(w => {
        if(d.description.toLowerCase().includes(w)) score += 0.5;
        });

        return {id: d.id, score: score * (include ? 1 : -1)};
    }).sort((a,b) => b.score-a.score);

    if(search != '') console.log(`Sorted ${include ? 'Inclusive' : 'Exclusive'} List`, `Search: ${search}`, result);
  return result;
}

/*
    Redux :: dogsReducer Reducer :: Handles App State Management and Updating the UI
    Manages Searches and changes to profiles via update, add, remove
*/
const initialState = {profiles: INITIAL_DOG_PROFILES, selectedSearch: INITIAL_DOG_PROFILES.map(d => ({id: d.id, score: 0}))}; 

const dogsReducer = (state = initialState, action) => { 
  switch(action.type) {
// Searching Combonations  
    case 'sort-include':
      return {profiles: state.profiles, 
                selectedSearch: [...prioritySearch(state.profiles, action.payload, true)]};

    case 'filter-include':
      return {profiles: state.profiles, 
                selectedSearch: [...prioritySearch(state.profiles, action.payload, true).filter(d => d.score > 0)]};

    case 'sort-exclude':
        return {profiles: state.profiles, 
                  selectedSearch: [...prioritySearch(state.profiles, action.payload, false)]};

    case 'filter-exclude':
        return {profiles: state.profiles, 
                  selectedSearch: [...prioritySearch(state.profiles, action.payload, false).filter(d => d.score >= 0)]};
// Profile:: Updating, Adding, Removing
    case 'set':
      return {profiles: [...state.profiles.filter(d => d.id != action.payload.id), {...action.payload}], 
                selectedSearch: state.selectedSearch};

    case 'create':
      const newId = new Date().getTime();       
      return {profiles: [...state.profiles, {...action.payload, id: newId}], 
                selectedSearch: [{id: newId, score: 0}, ...state.selectedSearch]};

    case 'delete':
      return {profiles: [...state.profiles.filter(d => d.id != action.payload.id)], 
                selectedSearch: [...state.selectedSearch.filter(s => s.id != action.payload.id)]};

    default: return state; 
  }
}

//Redux Store
const allStateDomains = combineReducers({
  dogs: dogsReducer,
});

const store = createStore(allStateDomains,{});;

export default  store;
