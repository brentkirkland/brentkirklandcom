import { connect } from 'react-redux'
import App from '../components/App.js'

const mapStateToProps = (state) => ({
  camera: state.camera
})

const VisibleApp = connect(
  mapStateToProps
)(App)

export default VisibleApp
