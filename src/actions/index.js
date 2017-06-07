export const updateLightStatus = (status, message, timestamp) => ({
  type: 'UPDATE_LIGHT_STATUS',
  status: status,
  message: message,
  timestamp: timestamp,
})

export const updateMessageText = (message_txt) => ({
  type: 'UPDATE_MESSAGE_TXT',
  message_txt: message_txt
})

export const errorMessage = (error) => ({
  type: 'ERROR_MESSAGE',
  error: error
})

export const resetMessage = () => ({
  type: 'RESET_MESSAGE',
})
