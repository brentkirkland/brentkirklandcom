import { ShaderMount, neuroNoiseFragmentShader } from 'https://esm.sh/@paper-design/shaders@0.0.80';

const container = document.getElementById('shader-bg');
if (container) {
  new ShaderMount(
    container,
    neuroNoiseFragmentShader,
    {
      u_colorFront: [0.0, 0.9, 1.0, 1.0],
      u_colorMid: [0.2, 0.5, 0.9, 1.0],
      u_colorBack: [0.0, 0.0, 0.0, 1.0],
      u_brightness: 0.15,
      u_contrast: 0.45,
      u_fit: 2,
      u_scale: 1.2,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {},
    0.4
  );
}
