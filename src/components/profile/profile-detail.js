import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';

// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import ProfileIcon from './profile-icon';
import '../../index.css';
import './profile-icon.css'
import './profile-detail.css'

//Import Assets
import dogXS from '../../assets/dog-extra-small.png';
import dogSM from '../../assets/dog-small.png';
import dogMD from '../../assets/dog-medium.png';
import dogLG from '../../assets/dog-large.png';
import dogXL from '../../assets/dog-extra-large.png';

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
-Balance
-Description
-Size Options & Selection
*/

//CREATE CUSTOM HOOK FOR USEsTATE, TO STERALIZE INPUT

const ProfileDetail = (props) => {
//Mode Getters
    const [mode, setMode] = useState(props.mode || 'display');
    const isPreview = () => mode === 'preview';
    const isEdit = () => mode === 'edit';

//State Management for Editing Attributes
    const [errorText, setErrorText] = useState('');
    const [name, setName] = useState(props.name || '');
    const [owner, setOwner] = useState(props.owner || '');
    const [imageURL, setImageURL] = useState(props.image || '');
    const [breed, setBreed] = useState(props.breed || '');
    const [balance, setBalance] = useState(props.balance || 0);
    const [description, setDescription] = useState(props.description || '');
    const [size, setSize] = useState(props.size || 'MD');
    const [transactions, setTransactions] = useState(props.transactions || [{date: new Date().getTime(), amount: 0}]);

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
        if(isNaN(balance) || balance < 0.0) return 'Invalid Doge Coin Balance';
        else if(props.balance != balance) change = true;
        if(description == undefined) return 'Invalid Description';
        else if(props.description != description) change = true;
        if(!size || !size.length) return 'Invalid Size';
        else if(props.size != size) change = true;
    //Deep Search Transaction Properties Comparison
        transactions.forEach((t) => { let found = false;
            if(props.transactions && props.transactions.length){ 
                if(isNaN(t.date) || t.date < 0.0 || t.date > new Date().getTime() || isNaN(t.amount) || t.amount < 0.0) return 'Invalid Transactions';
                props.transactions.forEach((p)=>{
                    if(t.date == p.date && t.amount == p.amount) found = true;
                });
            } else change = true;
            //if(!found) change = true;        
        });
        return change;
    }
    
    useEffect(()=>{  const result = isChanged(); 
        setErrorText(typeof result === "string" ? result : '');
    }, [name, owner, imageURL, breed, balance, description, size, transactions]);

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
            balance: balance,
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
            
            {!isPreview() ? <label className='profile-attribute' >Id:</label>:<span></span>}
            {!isPreview() ? <label className='profile-text' >{props.id || 'New Profile'}</label>:<span></span>}

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

            <label className='profile-attribute' >Dogecoin:</label>
            {isEdit() ? <input type='number' className='profile-text' value={balance} onChange={(event)=>setBalance(event.target.value)}/>
                : <label className='profile-text' >{props.balance} &ETH;</label>}
                
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
        {/* <label className='profile-size-icon-label'>{props.size}</label> */}
    </div>);
}


