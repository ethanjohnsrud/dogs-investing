import React, {useState, useMemo, useEffect} from 'react';
import { useSelector} from 'react-redux';
import { AxisOptions, Chart } from "react-charts"; //Source: https://react-charts.tanstack.com/

import '../../index.css';
import './graph.css'

import DOGE from '../../assets/dogeYTD'; //Tested for Undefined & Empty
import dogeMoon from '../../assets/doge-moon.png';

import ProfileDetail from '../profile/profile-detail';


const Graph = () => {
    const DOGS = useSelector(root => root.dogs).profiles;
    const SELECTED_ID = useSelector(root => root.dogs).selectedSearch; //Tested for Empty
    const [dataType, setDataType] = useState('value'); //Options: holding, value, market
    const [showMoonProfile, setShowMoonProfile] = useState(false);
    const [showToolTip, setShowToolTip] = useState(false);
    const [data, setData] = useState();

    /*
        API DATA RESPONSE CACHED: 4-25-2022 with YTD data :: Unable to implement purely front-end because of CORS protection :: DOCUMENTATION FOR API: https://docs.cryptowat.ch/rest-api/markets/ohlc
        axios.get(`https://api.cryptowat.ch/markets/:exchange/:pair/ohlc/`,{headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'X-CW-API-Key': '0LPHZD14RDU1JCXCYO6T'}, params: {'before': END_TIME, 'after': START_TIME, 'periods': INTERVAL }})
            .then((response) => { console.log('DOGE && DOGE.lengthAPI RESPONSE', response.data);});
        .catch((error) => {console.log('Failed to Fetch Schedule Information', error); return error.response ? error.response.status : false;});
    */

//Utility Method
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDate = (time) => `${MONTHS[new Date(time).getMonth()]}-${new Date(time).getDate()}`;
const getProfile = (id) => DOGS.find(d=>d.id==id);
//Accumulated Balance Value at time of transaction
const getBalance = (id, value = false) => DOGS.find(d=>d.id==id).transactions
                    .reduce((p,t)=>(p + t.amount), 0) * ((value && DOGE && DOGE.length) ? DOGE[DOGE.length-1][4] : 1); //Convert to Todays USD Value
//Current Balance - Balance at Initial Investment
const getGrowth = (id, value = false) => getBalance(id, value) - ((value && DOGE && DOGE.length)  
                    ? DOGS.find(d=>d.id==id).transactions
                        .reduce((p,t)=>(p + (t.amount * (DOGE.find((D,i)=>(D[0]*1000)>t.date || (i==DOGE.length-1))[4]))), 0) //Convert to Historical Transaction USD Value
                      : (DOGS.find(d=>d.id==id).transactions.length) ? DOGS.find(d=>d.id==id).transactions[0].amount : 0); 

//Chart Data Formatting
  useEffect(()=>{if(DOGE && DOGE.length) setData((dataType === 'market' || !SELECTED_ID.length) ? [
      {label: 'High', data: DOGE.map((D) => ({primary: D[0], secondary: D[2]}))}, 
      {label: 'Low', data: DOGE.map((D) => ({primary: D[0], secondary: D[3]}))},
    ]   
  : DOGS.filter(d=>SELECTED_ID.find(i=>i.id==d.id))
          .map(d => ({label: d.name, 
            data: DOGE.map((D) => ({primary: D[0], //Dates are in Seconds
                secondary: d.transactions.reduce((p,c)=> ((c.date/1000)<=(D[0])) ? p+=c.amount : p, 0)*(dataType === 'value' ? D[4] : 1) //Dates in Milliseconds
          }))})));
  else setData()
        }, [dataType, SELECTED_ID, DOGS]);
    
  const primaryAxis = useMemo(() => ({getValue: (datum) => getDate(datum.primary*1000)}),[]); //Convert Date to Milliseconds

  const secondaryAxes = useMemo(() => [{getValue: (datum) => datum.secondary, elementType: ((dataType === 'holding') ? 'area' : (dataType === 'market') ? 'bar' : 'line')}],[dataType]);


    return (<div id='graph'>
      <div id='graph-chart' >
        <div id='graph-chart-header' >
          <label className={`graph-chart-mode${(dataType === 'holding') ? ' graph-chart-mode-selected' : ''}`} style={{borderTopLeftRadius: '1.0rem'}} onClick={()=>setDataType('holding')}>YTD Holdings [&ETH;]</label>
          <label className={`graph-chart-mode${(dataType === 'value') ? ' graph-chart-mode-selected' : ''}`} onClick={()=>setDataType('value')}>YTD Value [$]</label>
          <label className={`graph-chart-mode${(dataType === 'market') ? ' graph-chart-mode-selected' : ''}`} style={{borderTopRightRadius: '1.0rem'}} onClick={()=>setDataType('market')}>YTD Market [$]</label>
        </div>

        {data ? <Chart options={{ data, primaryAxis, secondaryAxes, }} /> : <span></span>}

        <img id='graph-moon' src={dogeMoon} alt='Doge Dog on the Moon' onClick={()=>setShowMoonProfile(true)}
          onMouseEnter={()=>setShowToolTip(true)} onMouseLeave={()=>setShowToolTip(false)}
        />        
        {showMoonProfile ? <ProfileDetail {...DOGS[Math.floor(Math.random() * DOGS.length)]} mode={'display'} onClose={()=>setShowMoonProfile(false)} /> 
        : showToolTip ?  <div id='doge-moon-tip'>Which Dog is going to the Moon?</div> : <span></span>}

      </div>
{/* //         <img id='graph-chart' src={graphSample} alt='Sample Graph Image' /> */}
<div id='graph-analysis' >
          {/* <img id='graph-moon' src={dogeMoon} alt='Doge Dog on the Moon' /> */}
          <label id='graph-analysis-header' >DOGE  COIN {dataType.toUpperCase()}</label>
          {(dataType === 'holding') ?  
              <div id='graph-analysis-content' > {/* Holdings Portfolio Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? DOGE[DOGE.length-1][4].toFixed(5) : 0} / &ETH;</label>
                <label className='graph-label' >Total Holdings</label>
                    <label className='graph-detail' >{(SELECTED_ID.length && DOGS.length) ? SELECTED_ID.reduce((p,s)=>getBalance(s.id)+p, 0) : 0} &ETH;</label>
                  <label className='graph-label' >Average Holdings</label>
                    <label className='graph-detail' >{(SELECTED_ID.length && DOGS.length) ? SELECTED_ID.reduce((p,s)=>getBalance(s.id)+p, 0)/DOGS.length : 0} &ETH;</label>
                <label className='graph-label' >Top Holdings</label>
                  <label className='graph-detail graph-detail-list' >
                    {(SELECTED_ID.length && DOGS.length) ? [...SELECTED_ID.concat().sort((a,b)=>getBalance(b.id)-getBalance(a.id))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {getBalance(s.id)} &ETH;</section>) : 0}
                  </label>
                <label className='graph-label' >Top Bull Profiles</label>
                  <label className='graph-detail graph-detail-list' >
                    {(SELECTED_ID.length && DOGS.length) ? [...SELECTED_ID.concat().sort((a,b)=>getGrowth(b.id)-getGrowth(a.id))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {(getGrowth(s.id) < 0) ? '' : '+'} {getGrowth(s.id)} &ETH;</section>) : 0}
                  </label>
                <label className='graph-label' >Top Bear Profiles</label>
                  <label className='graph-detail graph-detail-list' >
                    {(SELECTED_ID.length && DOGS.length) ? [...SELECTED_ID.concat().sort((a,b)=>getGrowth(a.id)-getGrowth(b.id))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {(getGrowth(s.id) < 0) ? '' : '+'} {getGrowth(s.id)} &ETH;</section>) : 0}
                  </label>
              </div>
          : (dataType === 'value') ?  
              <div id='graph-analysis-content' > {/* Value Portfolio Performance Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? DOGE[DOGE.length-1][4].toFixed(5) : 0} / &ETH;</label>
                  <label className='graph-label' >Total Value</label>
                    <label className='graph-detail' >{'$'}{(SELECTED_ID.length) ? SELECTED_ID.reduce((p,s)=>getBalance(s.id, true)+p, 0).toFixed(2) : 0}</label>
                <label className='graph-label' >Average Value</label>
                    <label className='graph-detail' >{'$'}{(SELECTED_ID.length) ? (SELECTED_ID.reduce((p,s)=>getBalance(s.id, true)+p, 0)/DOGS.length).toFixed(2) : 0}</label>
                <label className='graph-label' >Top Performance</label>
                  <label className='graph-detail graph-detail-list' >
                    {SELECTED_ID.length  ? [...SELECTED_ID.concat().sort((a,b)=>getBalance(b.id)-getBalance(a.id))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {'$'}{getBalance(s.id, true).toFixed(2)}</section>) : 0}
                  </label>
                <label className='graph-label' >Greatest Gains</label>
                  <label className='graph-detail graph-detail-list' >
                    {SELECTED_ID.length  ? [...SELECTED_ID.concat().sort((a,b)=>getGrowth(b.id, true)-getGrowth(a.id, true))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {(getGrowth(s.id, true) < 0) ? '' : '+'} {'$'}{getGrowth(s.id, true).toFixed(2)}</section>) : 0}
                  </label>
                <label className='graph-label' >Greatest Loses</label>
                  <label className='graph-detail graph-detail-list' >
                    {SELECTED_ID.length  ? [...SELECTED_ID.concat().sort((a,b)=>getGrowth(a.id, true)-getGrowth(b.id, true))].slice(0, 3).map((s,i)=><section key={i}>{getProfile(s.id).name}: {(getGrowth(s.id, true) < 0) ? '' : '+'} {'$'}{getGrowth(s.id, true).toFixed(2)}</section>) : 0}
                  </label>
              </div>
          : 
              <div id='graph-analysis-content' > {/* Market Doge Historical Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? DOGE[DOGE.length-1][4].toFixed(5) : 0} / &ETH;</label>
                <label className='graph-label' >Average Price</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? (DOGE.reduce((p,D)=>D[4]+p, 0)/DOGE.length).toFixed(3) : 0}</label>
                <label className='graph-label' >Average Volatility</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? (DOGE.reduce((p,D)=>(D[2]-D[3])+p, 0)/DOGE.length).toFixed(3) : 0}</label>
                <label className='graph-label' >Average Volume</label>
                    <label className='graph-detail' >{DOGE && DOGE.length? (DOGE.reduce((p,D)=>D[5]+p, 0)/DOGE.length).toFixed(0) : 0} &ETH;</label>
                <label className='graph-label' >Average Volume Value</label>
                    <label className='graph-detail' >{'$'}{DOGE && DOGE.length? (DOGE.reduce((p,D)=>D[6]+p, 0)/DOGE.length).toFixed(2) : 0}</label>
                <label className='graph-label' >Top Stability (W)</label>
                  <label className='graph-detail graph-detail-list' >
                    {DOGE && DOGE.length? [...DOGE.concat().sort((a,b)=>(b[2]-b[3]-(a[2]-a[3])))].slice(0, 3).map((D,i)=><section key={i}>{getDate(D[0]*1000)} {'$'}{(D[2]-D[3]).toFixed(3)}</section>) : 0}
                  </label>
                <label className='graph-label' >Top Volatility (W)</label>
                  <label className='graph-detail graph-detail-list' >
                  {DOGE && DOGE.length? [...DOGE.concat().sort((a,b)=>(a[2]-a[3]-(b[2]-b[3])))].slice(0, 3).map((D,i)=><section key={i}>{getDate(D[0]*1000)} {'$'}{(D[2]-D[3]).toFixed(3)}</section>) : 0}
                  </label>
              </div>
        } 
      </div>
        </div>);

}
export default Graph;