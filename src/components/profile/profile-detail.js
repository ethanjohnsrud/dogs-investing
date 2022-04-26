import React, { useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import '../../index.css';
import './profile-icon.css'
import './profile-detail.css'

import DOGE from '../../assets/dogeYTD';
import dogXS from '../../assets/dog-extra-small.png';
import dogSM from '../../assets/dog-small.png';
import dogMD from '../../assets/dog-medium.png';
import dogLG from '../../assets/dog-large.png';
import dogXL from '../../assets/dog-extra-large.png';

import ProfileIcon from './profile-icon';

/* THREE MODES OF DISPLAY
//Preview  : onHover
-Owner
-Breed
-Size
-Balance

//Display Detail : onSelection
-Profile Icon (Image & Name)
-ID
-Owner
-Breed
-Balance
-Description
-Size Icon

//Edit Attributes : onEdit
-Image
-ID
-Name
-Owner
-Image URL
-Breed
-Transactions
-Balance
-Description
-Size Options & Selection
*/

/*
    ProfileDetail Component :: Displays Profile Information and Edit Fields as popup window
    Three Modes and Displays: preview, display, edit
*/
const ProfileDetail = (props) => {
//Mode Getters
    const [mode, setMode] = useState(props.mode || 'display');
    const isPreview = () => mode === 'preview';
    const isEdit = () => mode === 'edit';
    const isDisplay = () => !isPreview() && !isEdit();

//State Management for Editing Attributes
    const [errorText, setErrorText] = useState('');
    const [name, setName] = useState(props.name || '');
    const [owner, setOwner] = useState(props.owner || '');
    const [imageURL, setImageURL] = useState(props.image || '');
    const [breed, setBreed] = useState(props.breed || '');
    const [description, setDescription] = useState(props.description || '');
    const [size, setSize] = useState(props.size || 'MD');
    const [transactions, setTransactions] = useState(props.transactions || [{date: new Date().getTime(), amount: 0}]);
    const [transactionsUpdated, setTransactionsUpdated] = useState(false);

/* isChanged() :: Returns: 
false : no change to data
true : valid data ready to submit
string : invalid data explanation
*/
    const isChanged = () => { let change = false; 
        if(!name || !name.length) return 'Invalid Name';
        else if(props.name != name) change = true;
        if(owner == undefined) return 'Invalid Owner';
        else if(props.owner != owner) change = true;
        if(imageURL == undefined) return 'Invalid Image URL';
        else if(props.image != imageURL) change = true;
        if(breed == undefined) return 'Invalid Breed';
        else if(props.breed != breed) change = true;
        if(description == undefined) return 'Invalid Description';
        else if(props.description != description) change = true;
        if(!size || !size.length) return 'Invalid Size';
        else if(props.size != size) change = true;
        if(transactionsUpdated) change = true;

        return change;
    }
    
    useEffect(()=>{  const result = isChanged(); 
        setErrorText(typeof result === "string" ? result : '');
    }, [name, owner, imageURL, breed, description, size, transactions]);

    //OnSubmit Handlers
    const dispatch = useDispatch();
    const onSave = (event) => {
        event.stopPropagation();
        if(isChanged() !== true) return;
        dispatch({type: (props.id != undefined) ? 'set' : 'create', payload: {
            // id: props.id,
            name: name,
            breed: breed,
            owner: owner,
            size: size,
            description: description,
            image: imageURL,
            transactions: transactions.sort((a,b)=>a.date-b.date)
        }});
        props.onClose();
    }

    const onDelete = (event) => {
        event.stopPropagation();
        dispatch({type: 'delete', payload: {id: props.id}});
        props.onClose();
    }
       

    return (<div style={{position: isPreview() ? 'relative' : 'static'}}>
        {!isPreview() ? <div className='shade-background' onClick={(e)=>{e.stopPropagation(); props.onClose(e);}}></div> : <div></div>}
        <div className={`profile-detail`} style={{position: isPreview() ? 'absolute' : 'fixed'}} onClick={(e)=>{e.stopPropagation(); if(isPreview())  setMode('display');}}>
            

            {isPreview() ? <span></span>
            : <section style={{gridColumn: '1 / span 2'}} >
                {isEdit() ? <img className='profile-image'  src={imageURL} />
                    : <ProfileIcon {...props} viewOnly={true} /> }
            </section>}
            
            {isEdit() ? <label className='profile-attribute' >Id:</label>:<span></span>}
            {isEdit() ? <label className='profile-text' >{props.id || 'New Profile'}</label>:<span></span>}

            {isEdit() ? <label className='profile-attribute' >Name:</label>:<span></span>}
            {isEdit() ? <input type='text' className='profile-text' value={name} onChange={(event)=>setName(event.target.value)}/>:<span></span>}

            <label className='profile-attribute' >Owner:</label>
            {isEdit() ? <input type='text' className='profile-text' value={owner} onChange={(event)=>setOwner(event.target.value)}/>
                : <label className='profile-text' >{props.owner}</label>}

            {isEdit() ? <label className='profile-attribute' >Image URL:</label>:<span></span>}
            {isEdit() ? <input type='url' className='profile-text' value={imageURL} onChange={(event)=>setImageURL(event.target.value)}/>: <span></span>}

            <label className='profile-attribute' >Breed:</label>
            {isEdit() ? <input type='text' className='profile-text' value={breed} onChange={(event)=>setBreed(event.target.value)}/>
                : <label className='profile-text' >{props.breed}</label>}

            {isEdit() ? <label className='profile-attribute' >Transactions:</label>: <span></span>}
            {isEdit() ? <section className='profile-transactions' >
                {transactions.map((t,i)=>
                    <section key={`transaction-${i}`} className='profile-transactions-entry'>
                        <input type='date' className='profile-transactions-date' value={new Date(t.date).toISOString().slice(0,10)} onChange={(event)=>{setTransactions(T => {T[i].date= new Date(event.target.value).getTime(); return [...T];}); setTransactionsUpdated(true);} }/>
                        <input type='number' className='profile-transactions-amount' value={t.amount} step={1} min={0} onChange={(event)=>{if(!isNaN(parseFloat(event.target.value))) {setTransactions(T => {T[i].amount= parseFloat(event.target.value); return [...T];}); setTransactionsUpdated(true);}}} />
                        <button className='profile-transactions-delete' onClick={()=>{setTransactions(T =>{ T.splice(i,1); return [...T];}); setTransactionsUpdated(true);}} >X</button>
                    </section>)}
                    <section key={'New Transaction'} className='profile-transactions-entry'>
                        <label className='profile-transactions-date' style={{textAlign: 'right'}}>New Entry:</label>
                        <input type='number' className='profile-transactions-amount'  step={1} min={0} onKeyUp={(event)=>{if(event.keyCode == 13 && !isNaN(parseFloat(event.target.value))) {setTransactions(T => {T.push({date: new Date().getTime(), amount: parseFloat(event.target.value)}); return [...T];}); setTransactionsUpdated(true);}}} placeholder={'New Amount'}/>
                    </section>
                </section>:<span></span>}

            <label className='profile-attribute' >Dogecoin:</label>
            <label className='profile-text' >{transactions.reduce((p,t)=>p+t.amount, 0)} &ETH;</label>

            <label className='profile-attribute' >Portfolio:</label>
            <label className='profile-text' >{'$'}{(transactions.reduce((p,t)=>p+t.amount, 0) * ((DOGE && DOGE.length) ? DOGE[DOGE.length-1][4] : 1)).toFixed(2)}</label>
                
            {!isPreview() ? <label className='profile-attribute' >Description:</label>:<span></span>}
            {isEdit() ? <textarea className='profile-text' style={{gridColumn: '1 / span 2'}} rows='5' value={description} onChange={(event)=>setDescription(event.target.value)}/>
            : !isPreview() ? <label className='profile-text' style={{gridColumn: '1 / span 2'}} >{props.description}</label>:<span></span>}

            {isPreview() ? <span></span>
                : isEdit() ? <section className='profile-size-box' >
                    <SizeIcon icon={dogXS} size={'XS'} selected={size} onSelect={(v)=> setSize('XS')}/>
                    <SizeIcon icon={dogSM} size={'SM'} selected={size} onSelect={(v)=> setSize('SM')}/>
                    <SizeIcon icon={dogMD} size={'MD'} selected={size} onSelect={(v)=> setSize('MD')}/>
                    <SizeIcon icon={dogLG} size={'LG'} selected={size} onSelect={(v)=> setSize('LG')}/>
                    <SizeIcon icon={dogXL} size={'XL'} selected={size} onSelect={(v)=> setSize('XL')}/>
                </section> : <section style={{gridColumn: '1 / span 2'}} >
                        <SizeIcon size={size} icon={
                            size == 'XS' ? dogXS 
                            : size == 'SM' ? dogSM 
                            : size == 'MD' ? dogMD 
                            : size == 'LG' ? dogLG 
                            : dogXL }/> 
                    </section>}

            <label className='profile-error-text' style={{gridColumn: '1 / span 2'}} >{errorText}</label>
            <section style={{display:'flex', flexDirection: 'row', gridColumn: '1 / span 2'}} >
                {!isPreview() ? <button className='profile-button' onClick={(e)=>{e.stopPropagation(); props.onClose(e);}}>{isEdit() ? 'Cancel' : 'Close'}</button>: <span></span>}
                {!isPreview() && !isEdit() ? <button className='profile-button profile-button-submit' onClick={(e)=>setMode('edit')}>Edit</button>
                    : isEdit() && props.id ? <button className='profile-button profile-button-delete' onClick={onDelete}>Delete</button>: <span></span>}
                {isChanged() === true ? <button className='profile-button profile-button-submit' onClick={onSave} >Save</button>: <span></span>}
            </section>
        </div>
    </div>);

}
export default ProfileDetail;


//Support Stateless Component Rendering
const SizeIcon = (props) => {
    return (<div className='profile-size-icon'>
        <img className='profile-size-icon-image'  style={{border: (props.selected == props.size) ? '2px solid black' : 'none'}} src={props.icon} onClick={(e)=>props.onSelect(props.size)}/>
    </div>);
}


