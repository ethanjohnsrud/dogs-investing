import React from 'react';
import { useSelector} from 'react-redux';

import '../../index.css';
import './profile-icon.css'

import ProfileIcon from './profile-icon';

/*
    ProfileDisplay Component :: Renders list of selected profiles, identified through search field
*/
const ProfileDisplay = (props) => {
    const SELECTED = useSelector(root => root.dogs).selectedSearch;
    const DOGS = useSelector(root => root.dogs).profiles;

    return (<div id='profile-display'>
        {
            SELECTED.map((d,i) => 
                <ProfileIcon key={`Profile-${d.id}`} {...DOGS.find(k => k.id == d.id)} />        
            )
        }
        </div>);
}
export default ProfileDisplay;