import React, { Component } from 'react';
import './body.css';
import VisibleDeskLight from '../../containers/VisibleDeskLight'

class Header extends Component {

  render() {
    return (
      <div className="body-div">
        <div className='tab'>
          <VisibleDeskLight/>
        </div>
        <div className='tab'>
          <h2>Education</h2>
          <span><b>University of California, Santa Barbara</b></span>
          <p>B.S. in Computer Science, 2017</p>
        </div>
        <div className='tab'>
          <h2>Work</h2>
          <span><b>Graphiq Inc.</b></span>
          <p>Mobile Product Intern, Summer 2016</p>
          <span><b>ECI, UCSB</b></span>
          <p>Student Network Technician, April 2014 - March 2015</p>
        </div>
        <div className='tab'>
          <h2>Projects</h2>
          <span><b>brentkirklandcom</b></span>
          <p>This website's <a href='https://github.com/brentkirkland/brentkirklandcom'>source code</a>.</p>
          <span><b>Soilwatch</b></span>
          <p>Work in Progress (!!!). A soil analytics website that uses BLE devices to report soil data. <a href='https://github.com/brentkirkland/slurp'>Front End</a>, <a href='https://github.com/brentkirkland/slurp-backend'>Back End</a>, <a href='https://github.com/brentkirkland/miflora'>Device</a>.</p>
          <span><b>Pixxiti</b></span>
          <p>A Reddit Place clone with extra features. <a href='https://github.com/brentkirkland/pixxiti'>Source Code</a>.</p>
          <span><b>GoBang Bot</b></span>
          <p>A GoBang Bot implemented using the Alpha-Beta Pruning Algorithm. <a href='https://github.com/brentkirkland/gobang-bot'>Source Code</a>.</p>
          <span><b>Paxos and Map Reduce</b></span>
          <p>Paxos concensus algorithm with Map Reduce. <a href='https://github.com/brentkirkland/paxos-map-reduce'>Source Code</a>.</p>
          <span><b>Naive Bayes Classifier</b></span>
          <p>A Naive Bayes implementation to find if a movie review was positive or negative. <a href='https://github.com/brentkirkland/naive-bayes-classifier'>Source Code</a>.</p>
          <br />
          <p>More projects on my <a href='https://github.com/brentkirkland'>Github</a>.</p>
        </div>
      </div>
    );
  }
}

export default Header;
