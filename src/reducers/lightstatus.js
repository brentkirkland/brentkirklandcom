var initial_state = {
  status: 'Loading...',
  message: '--',
  timestamp: '--',
  error: '',
  message_txt: ''
}

const lightstatus = (state = initial_state, action) => {
  switch (action.type) {
    case 'UPDATE_LIGHT_STATUS':
      if (action.status === false) {
        state.status = 'OFF'
      } else if (action.status === true) {
        state.status = 'ON'
      } else if (action.status === 'OFF') {
        state.status = 'ON'
      } else {
        state.status = 'OFF'
      }
      state.message = action.message
      state.timestamp = new Date(action.timestamp).toString()
      return Object.assign({}, state)
    case 'UPDATE_MESSAGE_TXT':
      state.message_txt = action.message_txt
      return Object.assign({}, state)
    case 'ERROR_MESSAGE':
      state.error = action.error
      return Object.assign({}, state)
    case 'RESET_MESSAGE':
      state.error = ''
      state.message_txt = ''
      return Object.assign({}, state)
    default:
      return state;
  }
}

export default lightstatus
