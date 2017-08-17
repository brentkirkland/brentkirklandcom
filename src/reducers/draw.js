var initial_state = {drawable: false, color: -1}

const draw = (state = initial_state, action) => {
  var new_state = state;
  switch (action.type) {
    case 'CHANGE_DRAWABLE':
      new_state.drawable = !new_state.drawable
      if (new_state.drawable === false) {
        new_state.color = -1;
      }
      return Object.assign({}, new_state)
    case 'PICK_COLOR':
      new_state.color = action.color
      return Object.assign({}, new_state)
    default:
      return state;
  }
}

export default draw
