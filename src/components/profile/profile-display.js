import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useSelector} from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import '../../index.css';
import ProfileDetail from './profile-detail';
import ProfileIcon from './profile-icon';
import './profile-icon.css'

const ProfileDisplay = (props) => {
    const SELECTED = useSelector(root => root.dogs).selectedSearch;
    const DOGS = useSelector(root => root.dogs).profiles;

    return (<div id='profile-display'>
        {/* <ProfileDetail {...DOGS[3]} /> */}
        {
            SELECTED.map((d,i) => 
                <ProfileIcon key={`Profile-${d.id}`} {...DOGS.find(k => k.id == d.id)} />        
            )
        }
        </div>);

}
export default ProfileDisplay;