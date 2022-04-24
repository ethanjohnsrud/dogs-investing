import React, {useRef, useState, useCallback, useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import '../../index.css';
import ProfileDetail from './profile-detail';
import './profile-icon.css'

const ProfileIcon = (props) => {
    const [showDetailMode, setShowDetailMode] = useState(undefined);

    return (<div className='profile-icon'
        onClick={()=>setShowDetailMode('display')}
        onMouseEnter={()=>setShowDetailMode('preview')} 
        onMouseLeave={()=>showDetailMode === 'preview' ? setShowDetailMode(undefined) : null}
         >
        {!props.viewOnly && showDetailMode ? <ProfileDetail {...props} mode={showDetailMode} onClose={()=>setShowDetailMode(false)} /> : <span></span>}
        <img className='profile-image' src={props.image} />
            <section className='profile-label-box' >
                <div className="profile-label-c profile-label-c1"></div>
                <div className="profile-label-c profile-label-c2"></div>
                <div className="profile-label-c profile-label-c3"></div>
                <div className="profile-label-c profile-label-c4"></div>
                <div className="profile-label-b1">
                    <div className={props.name.length > 12 ? 'profile-label-b2 scroll-overflow' : 'profile-label-b2'}>
                        <label className='profile-label-text' >{props.name}</label>
                    </div>
                </div>                
            </section>
        </div>);

}
export default ProfileIcon;