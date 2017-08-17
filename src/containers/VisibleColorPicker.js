import { connect } from 'react-redux'
import { changeDrawable, pickColor } from '../actions'
import ColorPicker from '../components/ColorPicker'

const mapStateToProps = (state) => ({
  draw: state.draw
})

const mapDispatchToProps = {
  changeDrawable: changeDrawable,
  pickColor: pickColor
}

const VisibleColorPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorPicker)

export default VisibleColorPicker
