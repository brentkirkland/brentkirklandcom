import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './desklight.css';

class DeskLight extends Component {

  componentDidMount () {
    this.getLightStatus();
    this.keepingGrabbingLightStatus();
  }

  keepingGrabbingLightStatus () {
    setInterval(() => {
      this.getLightStatus()
    }, 5000)
  }

  getLightStatus () {
    setTimeout(() => {
      fetch('http://68.6.121.29:3000/light_status')
      .then(res => res.json())
      .then(json => this.props.updateLightStatus(json.status, json.message, json.timestamp))
    }, 200)
  }

  changeMessage (e) {
    this.props.updateMessageText(e.target.value)
  }

  onEnterKey (e) {
    if (e.keyCode === 13) {
      this.submitMessage()
    }
  }

  submitMessage () {
    console.log('submitting')
    if (this.props.desklight.message_txt.length < 3) {
      this.props.errorMessage("I need a cooler message.")
    } else {
      // needed if you want to clear error message
      this.props.updateLightStatus(!this.props.desklight.status,
        this.props.desklight.message_txt,
        new Date())
      var data = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'message=' + this.props.desklight.message_txt
      }
      fetch('http://68.6.121.29:3000/flick_light', data)
      this.props.resetMessage()
    }
  }

  flickTo () {
    // what you will flick the light to
    if (this.props.desklight.status === "OFF") {
      return 'ON'
    }
    return 'OFF'
  }

  render() {
    return (
      <div className="desklight-div">
        <h2>Desk Light: {this.props.desklight.status}</h2>
        <div className="switch-div">
          <p>Turn my desk light on or off with a message.</p>
          <input
            className='message_box'
            type='text'
            placeholder='Your message'
            onKeyDown={this.onEnterKey.bind(this)}
            value={this.props.desklight.message_txt}
            onChange={this.changeMessage.bind(this)}
          />
        <button className='btn btn-default' onClick={this.submitMessage.bind(this)}>
            {this.flickTo()}
          </button>
        <p className='error'>{this.props.desklight.error}</p>
        </div>
        <p><b>Last Message</b></p>
          <div>
            <p>{this.props.desklight.message}</p>
            <p>{this.props.desklight.timestamp}</p>
          </div>
      </div>
    );
  }
}

DeskLight.propTypes = {
  desklight: PropTypes.object.isRequired,
  updateLightStatus: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
  updateMessageText: PropTypes.func.isRequired,
  resetMessage: PropTypes.func.isRequired
}

export default DeskLight;
