import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { AxisOptions, Chart } from "react-charts"; //Source: https://react-charts.tanstack.com/

import ProfileDetail from '../profile/profile-detail';
import '../../index.css';
import './graph.css'

import DOGE from '../../assets/dogeYTD';

import graphSample from '../../assets/sample-chart.png';
import dogeMoon from '../../assets/doge-moon.png';


const Graph = () => {
    const DOGS = useSelector(root => root.dogs);
    const SELECTED_ID = useSelector(root => root.selection);
    const [dataType, setDataType] = useState('value'); //Options: holding, value, market
    const [showMoonProfile, setShowMoonProfile] = useState(false);
    const [showToolTip, setShowToolTip] = useState(false);

    /*
        API DATA RESPONSE CACHED: 4-25-2022 with YTD data :: Unable to implement purely front-end because of CORS protection :: DOCUMENTATION FOR API: https://docs.cryptowat.ch/rest-api/markets/ohlc
        axios.get(`https://api.cryptowat.ch/markets/:exchange/:pair/ohlc/`,{headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'X-CW-API-Key': '0LPHZD14RDU1JCXCYO6T'}, params: {'before': END_TIME, 'after': START_TIME, 'periods': INTERVAL }})
            .then((response) => { console.log('DOGE API RESPONSE', response.data);});
        .catch((error) => {console.log('Failed to Fetch Schedule Information', error); return error.response ? error.response.status : false;});
    */

//Utility Method
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDate = (time) => `${MONTHS[new Date(time).getMonth()]}-${new Date(time).getDate()}`;
const getProfile = (id) => DOGS.find(d=>d.id==id);
//Accumulated Balance Value at time of transaction
const getBalance = (id, value = false) => DOGS.find(d=>d.id==id).transactions
                    .reduce((p,t)=>(p + (t.amount * (value ? DOGE.find((D)=>(D[0]*1000)>t.date)[4] : 1))), 0);  //Convert to USD Value
//Current Balance - Balance at Initial Investment
const getGrowth = (id, value = false) => getBalance(id, value) - (value ? DOGE.find((D)=>(D[0]*1000)>DOGS.find(d=>d.id==id).transactions[0].date)[4] : DOGS.find(d=>d.id==id).transactions[0].amount);

//Chart Data Formatting
  const data = (dataType === 'market') ? [
      {label: 'High', data: DOGE.map((D) => ({primary: D[0], secondary: D[2]}))}, 
      {label: 'Low', data: DOGE.map((D) => ({primary: D[0], secondary: D[3]}))},
    ]   
  : DOGS.filter(d=>SELECTED_ID.find(i=>i.id==d.id))
          .map(d => ({label: d.name, 
            data: DOGE.map((D) => ({primary: D[0], //Dates are in Seconds
                secondary: d.transactions.reduce((p,c)=> ((c.date/1000)<=(D[0])) ? p+=c.amount : p, 0)*(dataType === 'value' ? D[4] : 1) //Dates in Milliseconds
          }))}));
    
  const primaryAxis = React.useMemo(() => ({getValue: (datum) => getDate(datum.primary*1000)}),[]); //Convert Date to Milliseconds

  const secondaryAxes = React.useMemo(() => [{getValue: (datum) => datum.secondary, elementType: ((dataType === 'holding') ? 'area' : (dataType === 'market') ? 'bar' : 'line')}],[dataType]);


    return (<div id='graph'>
      <div id='graph-chart' >
        <div id='graph-chart-header' >
          <label className={`graph-chart-mode${(dataType === 'holding') ? ' graph-chart-mode-selected' : ''}`} style={{borderTopLeftRadius: '1.0rem'}} onClick={()=>setDataType('holding')}>YTD Holdings [&ETH;]</label>
          <label className={`graph-chart-mode${(dataType === 'value') ? ' graph-chart-mode-selected' : ''}`} onClick={()=>setDataType('value')}>YTD Value [$]</label>
          <label className={`graph-chart-mode${(dataType === 'market') ? ' graph-chart-mode-selected' : ''}`} style={{borderTopRightRadius: '1.0rem'}} onClick={()=>setDataType('market')}>YTD Market [$]</label>
        </div>

        <Chart options={{data, primaryAxis, secondaryAxes, }} />

        <img id='graph-moon' src={dogeMoon} alt='Doge Dog on the Moon' onClick={()=>setShowMoonProfile(true)}
          onMouseEnter={()=>setShowToolTip(true)} onMouseLeave={()=>setShowToolTip(false)}
        />        
        {showMoonProfile ? <ProfileDetail {...DOGS[Math.floor(Math.random() * DOGS.length)]} mode={'display'} onClose={()=>setShowMoonProfile(false)} /> 
        : showToolTip ?  <div id='doge-moon-tip'>Which Dog is going to the Moon?</div> : <span></span>}

      </div>
{/* //         <img id='graph-chart' src={graphSample} alt='Sample Graph Image' /> */}
      <div id='graph-analysis' >
          {/* <img id='graph-moon' src={dogeMoon} alt='Doge Dog on the Moon' /> */}
          <label id='graph-analysis-header' >DOGE COIN {dataType.toUpperCase()}</label>
          {(dataType === 'holding') ?  
              <div id='graph-analysis-content' > {/* Holdings Portfolio Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE[DOGE.length-1][4].toFixed(5)} / &ETH;</label>
                <label className='graph-label' >Average Holdings</label>
                    <label className='graph-detail' >{SELECTED_ID.reduce((p,s)=>getBalance(s.id)+p, 0)/DOGS.length} &ETH;</label>
                <label className='graph-label' >Top Holdings</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getBalance(b.id)-getBalance(a.id))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {getBalance(s.id)} &ETH;</section>)}
                  </label>
                <label className='graph-label' >Top Bull Profiles</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getGrowth(b.id)-getGrowth(a.id))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {(getGrowth(s.id) < 0) ? '' : '+'} {getGrowth(s.id)} &ETH;</section>)}
                  </label>
                <label className='graph-label' >Top Bear Profiles</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getGrowth(a.id)-getGrowth(b.id))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {(getGrowth(s.id) < 0) ? '' : '+'} {getGrowth(s.id)} &ETH;</section>)}
                  </label>
              </div>
          : (dataType === 'value') ?  
              <div id='graph-analysis-content' > {/* Value Portfolio Performance Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE[DOGE.length-1][4].toFixed(5)} / &ETH;</label>
                  <label className='graph-label' >Total Value</label>
                    <label className='graph-detail' >{'$'}{SELECTED_ID.reduce((p,s)=>getBalance(s.id, true)+p, 0).toFixed(2)}</label>
                <label className='graph-label' >Average Value</label>
                    <label className='graph-detail' >{'$'}{(SELECTED_ID.reduce((p,s)=>getBalance(s.id, true)+p, 0)/DOGS.length).toFixed(2)}</label>
                <label className='graph-label' >Top Performance</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getBalance(b.id)-getBalance(a.id))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {'$'}{getBalance(s.id, true).toFixed(2)}</section>)}
                  </label>
                <label className='graph-label' >Greatest Gains</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getGrowth(b.id, true)-getGrowth(a.id, true))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {(getGrowth(s.id, true) < 0) ? '' : '+'} {'$'}{getGrowth(s.id, true).toFixed(2)}</section>)}
                  </label>
                <label className='graph-label' >Least Performing</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...SELECTED_ID.sort((a,b)=>getGrowth(a.id, true)-getGrowth(b.id, true))].slice(0, 3).map(s=><section>{getProfile(s.id).name}: {(getGrowth(s.id, true) < 0) ? '' : '+'} {'$'}{getGrowth(s.id, true).toFixed(2)}</section>)}
                  </label>
              </div>
          : 
              <div id='graph-analysis-content' > {/* Market Doge Historical Analysis  */}
                <label className='graph-label' >Current</label>
                    <label className='graph-detail' >{'$'}{DOGE[DOGE.length-1][4].toFixed(5)} / &ETH;</label>
                <label className='graph-label' >Average Price</label>
                    <label className='graph-detail' >{'$'}{(DOGE.reduce((p,D)=>D[4]+p, 0)/DOGE.length).toFixed(3)}</label>
                <label className='graph-label' >Average Volatility</label>
                    <label className='graph-detail' >{'$'}{(DOGE.reduce((p,D)=>(D[2]-D[3])+p, 0)/DOGE.length).toFixed(3)}</label>
                <label className='graph-label' >Average Volume</label>
                    <label className='graph-detail' >{(DOGE.reduce((p,D)=>D[5]+p, 0)/DOGE.length).toFixed(0)} &ETH;</label>
                <label className='graph-label' >Average Volume Value</label>
                    <label className='graph-detail' >{'$'}{(DOGE.reduce((p,D)=>D[6]+p, 0)/DOGE.length).toFixed(2)}</label>
                <label className='graph-label' >Top Stability (W)</label>
                  <label className='graph-detail graph-detail-list' >
                    {[...DOGE.sort((a,b)=>(b[2]-b[3]-(a[2]-a[3])))].slice(0, 3).map(D=><section>{getDate(D[0]*1000)} {'$'}{(D[2]-D[3]).toFixed(3)}</section>)}
                  </label>
                <label className='graph-label' >Top Volatility (W)</label>
                  <label className='graph-detail graph-detail-list' >
                  {[...DOGE.sort((a,b)=>(a[2]-a[3]-(b[2]-b[3])))].slice(0, 3).map(D=><section>{getDate(D[0]*1000)} {'$'}{(D[2]-D[3]).toFixed(3)}</section>)}
                  </label>
              </div>
        } 
      </div>       
        </div>);

}
export default Graph;