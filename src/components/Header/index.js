import React, { Component } from 'react';
import './header.css';

class Header extends Component {
  render() {
    return (
      <div className="header-div">
        <h1>Brent Kirkland</h1>
        <span>Leave a message below!</span>
      </div>
    );
  }
}

export default Header;
