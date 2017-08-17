import React, {Component} from 'react';
import './App.css';
import Header from './Header';
import Body from './Body';
import VisibleBoard from '../containers/VisibleBoard';
import mobile from 'is-mobile'
import PropTypes from 'prop-types'

class App extends Component {

  renderPixxiti() {
    if (!mobile()) {
      return (
        <VisibleBoard/>
      )
    }
  }

  pickWidth () {
    if (mobile()) {
      return {
        minWidth: 320,
      }
    } else {
      return {
        minWidth: 390,
      }
    }
  }

  pickHeight () {
    if (mobile()) {
      return {
        height: this.props.camera.height
      }
    } else {
      return {
        height: this.props.camera.height
      }
    }
  }

  render() {
    return (
      <div className="App" style={this.pickHeight()}>
        <div className='App-split'>
          <div className='App-left' style={this.pickWidth()}>
            <Header/>
            <Body/>
          </div>
          {this.renderPixxiti()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  camera: PropTypes.object.isRequired
}

export default App;
