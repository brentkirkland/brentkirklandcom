import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './colorpicker.css';

class ColorPicker extends Component {

  pick_color_00 () {
    this.props.pickColor(0)
  }

  pick_color_01 () {
    this.props.pickColor(1)
  }

  pick_color_02 () {
    this.props.pickColor(2)
  }

  pick_color_03 () {
    this.props.pickColor(3)
  }

  pick_color_04 () {
    this.props.pickColor(4)
  }

  pick_color_05 () {
    this.props.pickColor(5)
  }

  pick_color_06 () {
    this.props.pickColor(6)
  }

  pick_color_07 () {
    this.props.pickColor(7)
  }

  pick_color_08 () {
    this.props.pickColor(8)
  }

  pick_color_09 () {
    this.props.pickColor(9)
  }

  pick_color_10 () {
    this.props.pickColor(10)
  }

  pick_color_11 () {
    this.props.pickColor(11)
  }

  pick_color_12 () {
    this.props.pickColor(12)
  }

  pick_color_13 () {
    this.props.pickColor(13)
  }

  pick_color_14 () {
    this.props.pickColor(14)
  }

  pick_color_15 () {
    this.props.pickColor(15)
  }

  renderColors () {
    if (!this.props.draw.drawable) {
      return (
        <div className="colorBox_gray">
          <div className="color_00_g"/>
          <div className="color_01_g"/>
          <div className="color_02_g"/>
          <div className="color_03_g"/>
          <div className="color_04_g"/>
          <div className="color_05_g"/>
          <div className="color_06_g"/>
          <div className="color_07_g"/>
          <div className="color_08_g"/>
          <div className="color_09_g"/>
          <div className="color_10_g"/>
          <div className="color_11_g"/>
          <div className="color_12_g"/>
          <div className="color_13_g"/>
          <div className="color_14_g"/>
          <div className="color_15_g"/>
        </div>
      )
    } else {
      return (
        <div className="colorBox">
          <div className="color_00_g" onMouseDown={this.pick_color_00.bind(this)}/>
          <div className="color_01_g" onMouseDown={this.pick_color_01.bind(this)}/>
          <div className="color_02_g" onMouseDown={this.pick_color_02.bind(this)}/>
          <div className="color_03_g" onMouseDown={this.pick_color_03.bind(this)}/>
          <div className="color_04_g" onMouseDown={this.pick_color_04.bind(this)}/>
          <div className="color_05_g" onMouseDown={this.pick_color_05.bind(this)}/>
          <div className="color_06_g" onMouseDown={this.pick_color_06.bind(this)}/>
          <div className="color_07_g" onMouseDown={this.pick_color_07.bind(this)}/>
          <div className="color_08_g" onMouseDown={this.pick_color_08.bind(this)}/>
          <div className="color_09_g" onMouseDown={this.pick_color_09.bind(this)}/>
          <div className="color_10_g" onMouseDown={this.pick_color_10.bind(this)}/>
          <div className="color_11_g" onMouseDown={this.pick_color_11.bind(this)}/>
          <div className="color_12_g" onMouseDown={this.pick_color_12.bind(this)}/>
          <div className="color_13_g" onMouseDown={this.pick_color_13.bind(this)}/>
          <div className="color_14_g" onMouseDown={this.pick_color_14.bind(this)}/>
          <div className="color_15_g" onMouseDown={this.pick_color_15.bind(this)}/>
        </div>
      )
    }
  }

  render () {
    return (
      <div className="draw">
        {this.renderColors()}
      </div>
    )
  }
}

ColorPicker.propTypes = {
  draw: PropTypes.object.isRequired,
  pickColor: PropTypes.func.isRequired
}

export default ColorPicker;
