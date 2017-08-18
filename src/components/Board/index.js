import React, {Component} from 'react';
import PropTypes from 'prop-types'
import './board.css';
import * as firebase from 'firebase';
import VisibleColorPicker from '../../containers/VisibleColorPicker'
import Loader from 'halogen/GridLoader';
import { config } from './hidden.js'

class Board extends Component {

  componentDidMount() {
    firebase.initializeApp(config);
    this.getBoard()
    var state = firebase.database().ref('pixel');
    state.on('value', function(snapshot) {
      this.props.onBoardClick(snapshot.val().c, snapshot.val().y, snapshot.val().x)
      return snapshot.val()
    }, this)
    this.renderASquare()
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentDidUpdate() {
    this.renderASquare()
  }

  handleResize() {
    this.props.handleResize(window.innerWidth, window.innerHeight)
  }

  getBoard() {
    fetch('https://us-central1-pixxiti.cloudfunctions.net/getData').then(res => res.json()).then(json => {
      var str = json.str;
      this.props.getBoard(str);
      setTimeout(this.finishLoadingStuff.bind(this), 15000)
    })
  }

  finishLoadingStuff () {
    this.props.finishLoad()
  }

  renderASquare() {
    var ctx = this.refs.canvas.getContext("2d");
    var x;
    if (this.props.board.length === 640000) {
      x = new ImageData(this.props.board, 400, 400)
    } else {
      x = new ImageData(400, 400)
    }
    ctx.putImageData(x, 0, 0)
  }

  mouseDown(e) {
    this.props.mouseDown(true, e.clientX, e.clientY)
    return true
  }

  mouseMove(e) {
    if (this.props.camera.moveable) {
      var transX = this.props.camera.prevX + (e.clientX - this.props.camera.startX) / this.props.camera.zoom
      var transY = this.props.camera.prevY + (e.clientY - this.props.camera.startY) / this.props.camera.zoom
      this.props.mouseMove(transX, transY)
    }
  }

  mouseUp(e) {
    var bld = this.props.camera.transX*this.props.camera.zoom + (this.props.camera.width - 390)/2 - 800*this.props.camera.zoom/4
    var btd = this.props.camera.transY*this.props.camera.zoom + (this.props.camera.height)/2 - 800*this.props.camera.zoom/4
    if (this.props.camera.transX === this.props.camera.prevX && this.props.camera.transY === this.props.camera.prevY && e.button === 0 && this.props.camera.moveable && this.props.camera.zoom === 8) {
      var prevX = -1*(e.clientX - bld - 200 * 8 - 390)/8
      var prevY = -1*(e.clientY - btd - 200 * 8 + 40)/8
      var transX = -1*(e.clientX - bld - 200 * 8 - 390)/8
      var transY = -1*(e.clientY - btd - 200 * 8 + 40)/8
      this.props.mouseUpOne(40, false, prevX, prevY, transX, transY)
      this.props.changeDrawable()
    } else if (e.button === 2 && this.props.camera.zoom === 40) {
      this.props.mouseUpTwo(8, false, this.props.camera.transX, this.props.camera.transY)
      this.props.changeDrawable()
    } else {
      if (this.props.camera.transX === this.props.camera.prevX && this.props.camera.transY === this.props.camera.prevY && this.props.draw.color !== -1) {
        var i = Math.floor((e.clientX - 390 - bld)/this.props.camera.zoom)
        var j = Math.floor((e.clientY - btd + 20)/this.props.camera.zoom)
        if (this.props.draw.drawable && this.props.camera.moveable) {
          this.props.onBoardClick(this.props.draw.color, j, i)
          firebase.database().ref('pixel').set({x: i, y: j, c: this.props.draw.color});
          this.updateBoard(i + 1, j + 1, this.props.draw.color + 1)

        }
      }
      this.props.mouseUpThree(false, this.props.camera.transX, this.props.camera.transY)
    }
  }

  handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  updateBoard(j, i, c) {
    var url = 'https://us-central1-pixxiti.cloudfunctions.net/putData?i=' + i + '&j=' + j + '&c=' + c
    fetch(url).then(this.handleErrors).then(response => response).catch(error => console.log(error));
  }

  onContextMenu(e) {
    e.preventDefault();
  }

  activate_draw() {
    this.props.changeDrawable()
  }

  get_camera_css() {
    if (this.props.draw.color === -1) {
      return "pixxiti-camera-no-cursor"
    } else {
      return "pixxiti-camera"
    }
  }

  renderPopUp() {
    if (this.props.camera.loading) {
      return (
        <div className="BackgroundPop" style={{
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          height: this.props.camera.height - 40,
          width: this.props.camera.width - 390}}>
          <Loader color="#fff" size="16px" margin="4px"/>
          <br/>
          <p>Drag to move</p>
          <p>Left click to zoom in</p>
          <p>Select a color below & left click to color tiles (only zoomed in)</p>
          <p>Right click to zoom out</p>
          <p></p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="pixxiti">
        {this.renderPopUp()}
        <div className="pixxiti-container" style={{
          height: this.props.camera.height - 40,
          width: this.props.camera.width - 390 }}>
          <div className="pixxiti-viewer" style={{
            flex: '0 0 400px',
            transform: 'scale(' + this.props.camera.zoom + ',' + this.props.camera.zoom + ')'
          }}>
            <div className={this.get_camera_css()} style={{
              transform: 'translate(' + this.props.camera.transX + 'px,' + this.props.camera.transY + 'px)'
            }} onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseLeave={this.mouseUp.bind(this)} onContextMenu={this.onContextMenu.bind(this)} onMouseMove={this.mouseMove.bind(this)}>
              <canvas ref="canvas" height={400} width={400}/>
            </div>
          </div>
        </div>
        <VisibleColorPicker/>
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
  camera: PropTypes.object.isRequired,
  draw: PropTypes.object.isRequired,
  handleResize: PropTypes.func.isRequired,
  onBoardClick: PropTypes.func.isRequired,
  getBoard: PropTypes.func.isRequired,
  mouseDown: PropTypes.func.isRequired,
  mouseMove: PropTypes.func.isRequired,
  mouseUpOne: PropTypes.func.isRequired,
  mouseUpTwo: PropTypes.func.isRequired,
  mouseUpThree: PropTypes.func.isRequired,
  changeDrawable: PropTypes.func.isRequired,
  updatePlaceIJ: PropTypes.func.isRequired,
  finishLoad: PropTypes.func.isRequired
}

export default Board;
