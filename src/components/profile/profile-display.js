import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useSelector} from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import '../../index.css';
import ProfileIcon from './profile-icon';
import './profile.css'

const ProfileDisplay = (props) => {
    const SELECTED = useSelector(root => root.selection);
    const DOGS = useSelector(root => root.dogs);

    return (<div id='profile-display'>
        {
            SELECTED.map((d,i) => 
                <ProfileIcon key={`Profile-${d.id}`} {...DOGS.find(k => k.id == d.id)} />        
            )
        }
        </div>);

}
export default ProfileDisplay;