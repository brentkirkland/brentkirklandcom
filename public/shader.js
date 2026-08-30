import { ShaderMount, grainGradientFragmentShader } from 'https://esm.sh/@paper-design/shaders@0.0.80';

const container = document.getElementById('shader-bg');
if (container) {
  new ShaderMount(
    container,
    grainGradientFragmentShader,
    {
      u_colorBack: [0.0, 0.0, 0.0, 1.0],
      u_colors: [
        [0.12, 0.12, 0.12, 1.0],   // dark grey
        [0.22, 0.22, 0.22, 1.0],   // grey
        [0.18, 0.18, 0.18, 1.0],   // medium grey
      ],
      u_colorsCount: 3,
      u_shape: 0,        // wave shape
      u_softness: 0.8,
      u_intensity: 0.3,
      u_noise: 0.6,      // grainy texture!
      u_fit: 2,
      u_scale: 1.0,
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
