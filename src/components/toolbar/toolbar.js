import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import '../../index.css';
import './toolbar.css'

const Toolbar = () => {
    const DOGS = useSelector(root => root.dogs);
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState(true);
    const [include, setInclude] = useState(true);

    const onSearch = (search = searchText) => { console.log(`${sort ? 'sort' : 'filter'}-${include ? 'include' : 'exclude'}`, 'Searching: ', searchText)
        dispatch({type: `${sort ? 'sort' : 'filter'}-${include ? 'include' : 'exclude'}`, payload: search});
    }
    useEffect(()=>onSearch(),[searchText, sort, include]);

    return (<div id='toolbar'>
        <section className='toolbar-option-box' style={{width: '100%'}}>
            <input className='toolbar-search-field' type='text' value={searchText} onChange={(e)=>setSearchText(e.target.value)} onKeyPress={(e)=>{if(e.charCode == 13) onSearch();}} placeholder='Search'/>
            <button className={`toolbar-option`} onClick={()=>searchText.length ? setSearchText('') : onSearch()}>{searchText.length ? 'Clear' : 'Search'}</button>
        </section> 
        <section className='toolbar-option-box'>
            <button className={`toolbar-option toolbar-option-left${sort ? ' toolbar-option-selected' : ''}`} onClick={()=>setSort(true)}>Sort</button>
            <button className={`toolbar-option toolbar-option-right${!sort ? ' toolbar-option-selected' : ''}`} onClick={()=>setSort(false)}>Filter</button>
        </section>     
        <section className='toolbar-option-box'>
            <button className={`toolbar-option toolbar-option-left${include ? ' toolbar-option-selected' : ''}`} onClick={()=>setInclude(true)}>Inclusive</button>
            <button className={`toolbar-option toolbar-option-right${!include ? ' toolbar-option-selected' : ''}`} onClick={()=>setInclude(false)}>Exclusive</button>
        </section>    
    </div>);

}
export default Toolbar;