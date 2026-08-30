console.log('🎨 Shader script loading...');

import { ShaderMount, neuroNoiseFragmentShader } from 'https://esm.sh/@paper-design/shaders@0.0.80';

console.log('✅ Shader module imported successfully');

const container = document.getElementById('shader-bg');
console.log('📦 Canvas container:', container);

if (!container) {
  console.error('❌ Canvas container #shader-bg not found!');
} else {
  try {
    console.log('🚀 Creating shader mount...');
    const shader = new ShaderMount(
      container,
      neuroNoiseFragmentShader,
      {
        u_colorFront: [1.0, 1.0, 0.0, 1.0],
        u_colorMid: [1.0, 0.0, 1.0, 1.0],
        u_colorBack: [1.0, 1.0, 1.0, 1.0],
        u_brightness: 0.5,
        u_contrast: 0.8,
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
    console.log('✨ Shader created successfully!', shader);
    console.log('Canvas dimensions:', container.clientWidth, 'x', container.clientHeight);
  } catch (error) {
    console.error('❌ Shader creation failed:', error);
  }
}
