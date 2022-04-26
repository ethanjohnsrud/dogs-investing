import React, {useRef, useState, useCallback, useEffect} from 'react';
import useInterval from './useInterval';
import { useSelector, useDispatch} from 'react-redux';

import '../../index.css';
import './fact.css'

const Fact = () => {
    const DOGS = useSelector(root => root.dogs);
    const dispatch = useDispatch();
    const [prompt, setPrompt] = useState('');
    const [search, setSearch] = useState('');
    const [showPawTip, setShowPawTip] = useState(false);


     //Utility Method
     const formatNames = (list, articles = ['','',''], cap = true) => { 
        switch (list.length){
            case 0: return `${cap ? 'N' : 'n'}obody${articles[0]}`;
            case 1: return `${list[0]}${articles[0]}`;
            case 2: return `${cap ? 'B' : 'b'}oth ${list[0]} and ${list[1]}${articles[1]}`;
            default: return `${list.map((n,i)=>(i==(list.length-1)) ? ` and ${n}` : ` ${n}`)} all${articles[1]}`;
        }
    }
    //Custom Hook
    useInterval(()=>{
            if(!DOGS || !DOGS.length) setPrompt('You can add a dog profile to begin!');
            else {
                const starterProfile = DOGS[Math.floor(Math.random() * DOGS.length)];
                switch (Math.floor(Math.random() *7)) {        
                    //Relation
                    case 0:
                        const sameOwner = DOGS.filter((d)=>d.owner == starterProfile.owner).map(d => d.name);
                        setPrompt(`${starterProfile.owner} has ${sameOwner.length} ${sameOwner.length > 1 ? 'dogs' : 'dog'}, ${formatNames(sameOwner, undefined, false)}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.name});
                    break;
                    case 1:
                        setPrompt(`${starterProfile.name}'s owner is ${starterProfile.owner}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.name});
                    break;
                    case 2:
                    //Description
                        setPrompt(`${starterProfile.name} is ${starterProfile.description.toLowerCase()}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.name});
                    break;
                    case 3:
                        setPrompt(`${starterProfile.owner}'s dog, ${starterProfile.name} is ${starterProfile.description.toLowerCase()}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.owner});
                    break;
                    case 4:
                    //Breed
                        setPrompt(`${formatNames(DOGS.filter(d => d.breed.includes(starterProfile.breed) || starterProfile.breed.includes(d.breed)).map(d => d.name), [' is a', ' are'])} ${starterProfile.breed}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.breed});
                    break;
                    case 5:
                        setPrompt(`${formatNames(DOGS.filter(d => d.breed.includes(starterProfile.breed) || starterProfile.breed.includes(d.owner)).map(d => d.owner), [' has a', ' have a'])} ${starterProfile.breed}.`);
                        setSearch({type: 'filter-include', payload: starterProfile.breed});
                    break;
                    case 6:
                    //Size
                        setPrompt(`${formatNames(DOGS.filter(d => d.size == starterProfile.size).map(d => d.name), [' is a', ' are'])} ${starterProfile.size} dog.`);
                        setSearch({type: 'filter-include', payload: starterProfile.size});
                    break;
                    case 7:
                        setPrompt(`${formatNames(DOGS.filter(d =>d.size == starterProfile.size).map(d => d.owner), [' has a', ' have a'])} ${starterProfile.size} dog.`); 
                        setSearch({type: 'filter-include', payload: starterProfile.size});
                    break;
                    default: 
                        setPrompt('Dogs are my best friend!');
                    }            
        setTimeout(()=>setPrompt(''), 10*1000)
    }}, 30*1000);

    return (<div id='fact' style={{display: prompt.length ? '' : 'none'}} onClick={()=>{dispatch(search); setPrompt('')}} onMouseEnter={()=>setShowPawTip(true)} onMouseLeave={()=>setShowPawTip(false)}>
            <div className="fact-paw-print">
                <div className="fact-pad fact-large" >
                    <label id="fact-text" >Did you Know? <br/><br/><label style={{fontSize: '0.85em'}}>{prompt}</label></label>
                </div>
                {showPawTip ? <div id='paw-tip'>View Profiles</div> : <span></span>}
                <div className="fact-pad fact-small-1"></div>
                <div className="fact-pad fact-small-2"></div>
                <div className="fact-pad fact-small-3"></div>
                <div className="fact-pad fact-small-4"></div>
            </div>
        </div>);
}
export default Fact;