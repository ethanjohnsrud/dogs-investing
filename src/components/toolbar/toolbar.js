import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import '../../index.css';
import './toolbar.css'

import voyantLogo from '../../assets/voyant-logo.png';
import addLogo from '../../assets/logo-add.png';

import ProfileDetail from '../profile/profile-detail';

/*
    Toolbar Component :: Title, Add Profile Button, and Search Controls
    Search Options: sort-inclusive, sort-exclusive, filter-inclusive, filter-exclusive
*/
const Toolbar = () => {
    const dispatch = useDispatch();

    const [addNew, setAddNew] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState(false);
    const [include, setInclude] = useState(true);
    const [showToolTip, setShowToolTip] = useState(false);


    const onSearch = (search = searchText) => { 
        dispatch({type: `${sort ? 'sort' : 'filter'}-${include ? 'include' : 'exclude'}`, payload: search});
    }
    useEffect(()=>onSearch(),[searchText, sort, include]);

    return (<div id='toolbar'>
        <section className='toolbar-option-box' style={{width: '90vw'}} onClick={()=>setSearchText('')} onMouseEnter={()=>setShowToolTip(true)} onMouseLeave={()=>setShowToolTip(false)}>
            <img className='logo' src={voyantLogo} alt='Voyant Logo' />
            <label id='title'>Voyant Dogs Investments</label>
            <img className='logo' src={addLogo} alt='Dog Logo Add New'  onClick={()=>setAddNew(true)} />
            {showToolTip ?  <div id='add-tip'>Add New Dog</div> : <span style={{display: 'none'}}></span>}
        </section> 
        <div id='toolbar-search-criteria' >
            <section className='toolbar-option-box' style={{width: '100%'}}>
                <input className='toolbar-search-field' type='text' value={searchText} onChange={(e)=>setSearchText(e.target.value)} onKeyPress={(e)=>{if(e.charCode == 13) onSearch();}} placeholder='Search: Names, Owners, Breed, Size, ect...'/>
                <button className={`toolbar-option`} onClick={()=>searchText.length ? setSearchText('') : onSearch()}>{searchText.length ? 'Clear' : 'Search'}</button>
            </section> 
            <section className='toolbar-option-box' style={{gap: '3.0rem'}}>
                <section className='toolbar-option-box'>
                    <button className={`toolbar-option toolbar-option-left${sort ? ' toolbar-option-selected' : ''}`} onClick={()=>setSort(true)}>Sort</button>
                    <button className={`toolbar-option toolbar-option-right${!sort ? ' toolbar-option-selected' : ''}`} onClick={()=>setSort(false)}>Filter</button>
                </section>     
                <section className='toolbar-option-box'>
                    <button className={`toolbar-option toolbar-option-left${include ? ' toolbar-option-selected' : ''}`} onClick={()=>setInclude(true)}>Inclusive</button>
                    <button className={`toolbar-option toolbar-option-right${!include ? ' toolbar-option-selected' : ''}`} onClick={()=>setInclude(false)}>Exclusive</button>
                </section> 
            </section>   
        </div>
        {addNew ? <ProfileDetail mode={'edit'} onClose={()=>setAddNew(false)} /> : <span></span>}
    </div>);

}
export default Toolbar;