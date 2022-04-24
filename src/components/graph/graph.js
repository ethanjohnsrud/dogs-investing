import React, {useRef, useState, useCallback, useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import '../../index.css';
import './graph.css'

import graphSample from '../../assets/sample-chart.png';
import dogeMoon from '../../assets/doge-moon.png';

const Graph = () => {

    return (<div id='graph'>
        <img id='graph-chart' src={graphSample} alt='Sample Graph Image' />
        <div id='graph-analysis' >
            <img id='graph-moon' src={dogeMoon} alt='Doge Dog on the Moon' />
            <label className='graph-detail' >Current: $0.13/&ETH;</label>
            <label className='graph-detail' >Average Holdings: 3500 &ETH;</label>
            <label className='graph-detail' >USD Value Equivalence: $462.13</label>
            <label className='graph-detail' >30-day Loss: $16.01</label>
        </div>        
        </div>);

}
export default Graph;