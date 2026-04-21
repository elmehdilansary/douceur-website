# 3D Model Assets

Place your GLTF/GLB tissue box model here as:

  /public/models/tissue-box.glb

## How to source a model

1. **Commission**: Hire a 3D artist on Behance or Dribbble familiar with product visualization.
2. **Sketchfab**: Search "tissue box" under CC license — export as GLB.
3. **DIY in Blender**: Model a simple rectangular box, UV-unwrap, apply your packaging texture, export as GLB with Draco compression.

## Optimization

Run the model through gltf-transform before shipping:
  npx gltf-transform optimize tissue-box.glb tissue-box.glb --texture-compress webp

Target size: < 2MB compressed.

## Fallback

If no model is provided, HeroCanvas automatically renders a soft-ivory box mesh as a placeholder so the page never breaks.
