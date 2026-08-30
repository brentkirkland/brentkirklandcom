import { ShaderMount, simplexNoiseFragmentShader } from 'https://esm.sh/@paper-design/shaders@0.0.80';

const container = document.getElementById('shader-bg');
if (container) {
  new ShaderMount(
    container,
    simplexNoiseFragmentShader,
    {
      u_colors: [
        [0.05, 0.05, 0.15, 1.0],  // dark blue
        [0.15, 0.1, 0.2, 1.0],    // dark purple
        [0.1, 0.15, 0.25, 1.0],   // dark teal
        [0.08, 0.12, 0.18, 1.0],  // dark blue-grey
      ],
      u_colorsCount: 4,
      u_stepsPerColor: 1,
      u_softness: 1.0,
      u_fit: 2,
      u_scale: 0.8,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {},
    0.3
  );
}
