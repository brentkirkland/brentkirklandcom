import { connect } from 'react-redux'
import { updateLightStatus,
         updateMessageText,
         errorMessage,
         resetMessage } from '../actions'
import DeskLight from '../components/DeskLight'

const mapStateToProps = (state) => ({
  desklight: state.lightstatus
})

const mapDispatchToProps = {
  updateLightStatus: updateLightStatus,
  updateMessageText: updateMessageText,
  errorMessage: errorMessage,
  resetMessage: resetMessage
}

const VisibleDeskLight = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeskLight)

export default VisibleDeskLight
