var initial_state = {
  width: window.innerWidth,
  height: window.innerHeight,
  transX: 0,
  transY: 0,
  prevX: 0,
  prevY: 0,
  movable: false,
  zoom: 8,
  drawable: false,
  loading: true
}

const camera = (state = initial_state, action) => {
    var new_state = state;
  switch (action.type) {
    case 'MOUSE_DOWN':
      new_state.moveable = action.moveable;
      new_state.startX = action.startX;
      new_state.startY = action.startY;
      return Object.assign({}, new_state);
    case 'MOUSE_MOVE':
      new_state.transX = action.transX;
      new_state.transY = action.transY;
      return Object.assign({}, new_state);
    case 'MOUSE_UP_ONE':
      new_state.zoom = action.zoom;
      new_state.moveable = action.moveable;
      new_state.prevX = action.prevX;
      new_state.prevY = action.prevY;
      new_state.transX = action.transX;
      new_state.transY = action.transY;
      return Object.assign({}, new_state);
    case 'MOUSE_UP_TWO':
      new_state.zoom = action.zoom;
      new_state.moveable = action.moveable;
      new_state.prevX = action.prevX;
      new_state.prevY = action.prevY;
      return Object.assign({}, new_state);
    case 'MOUSE_UP_THREE':
      new_state.moveable = action.moveable;
      new_state.prevX = action.prevX;
      new_state.prevY = action.prevY;
      return Object.assign({}, new_state);
    case 'HANDLE_RESIZE':
      new_state.width = action.width;
      new_state.height = action.height;
      return Object.assign({}, new_state);
    case 'FINISH_LOAD':
      new_state.loading = false;
      return Object.assign({}, new_state);
    default:
      return new_state;
  }
}

export default camera
