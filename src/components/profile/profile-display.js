import React from 'react';
import '../../index.css';
import './profile-icon.css'

import ProfileIcon from './profile-icon';


const ProfileDisplay = (props) => {


    return (<div id='profile-display'>
        {
            SELECTED.map((d,i) => 
                <ProfileIcon key={`Profile-${d.id}`} {...DOGS.find(k => k.id == d.id)} />        
            )
        }
        </div>);

}
export default ProfileDisplay;