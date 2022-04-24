import React, {useRef, useState, useCallback, useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
import Tip from 'react-tooltip';
import '../../index.css';
import './fact.css'

const Fact = () => {

    return (<div id='fact'>
        <div class="fact-paw-print">
            <div class="fact-pad fact-large">
                <label id="fact-text">Did you Know? <br/><label style={{fontSize: '0.85em'}}>Dan has two Dogs.</label></label>
            </div>
            <div class="fact-pad fact-small-1"></div>
            <div class="fact-pad fact-small-2"></div>
            <div class="fact-pad fact-small-3"></div>
            <div class="fact-pad fact-small-4"></div>
        </div>
        </div>);

}
export default Fact;