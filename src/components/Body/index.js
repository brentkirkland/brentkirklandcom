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
          <p><b>University of California, Santa Barbara</b></p>
          <p>B.E. in Computer Science, 2017</p>
        </div>
        <div className='tab'>
          <h2>Work</h2>
          <p><b>Graphiq Inc.</b></p>
          <p>Mobile Product Intern, Summer 2016</p>
          <p><b>ECI, UCSB</b></p>
          <p>Student Network Technician, April 2014 - March 2015</p>
        </div>
        <div className='tab'>
          <h2>Projects</h2>
          <p><b>FantasyPollster</b></p>
          <p>Fantasy Sports meets the 2016 election. <a href='http://www.forbes.com/sites/johngreathouse/2016/03/11/trump-clinton-look-out-this-student-founded-startup-may-pick-the-next-president/#34f1d41e6171'>Forbes</a>.</p>
          <p><b>Livv, Inc.</b></p>
          <p>Open sourced live feed of whats going on around UCSB. <a href='https://github.com/brentkirkland/Livv'>iOS</a> / <a href='https://github.com/livvapp/Server'>Server</a>.</p>
          <br />
          <p>More projects on my <a href='https://github.com/brentkirkland'>Github</a>.</p>
        </div>
      </div>
    );
  }
}

export default Header;
