# GemniDINO (Rigged Character Model)

Procedural 3D character based on the supplied dinosaur-costume reference.

- **Studio URLs**: `/models`, `/models?model=gemni-dino`, `/models?model=GemniDINO` (or legacy `/models?model=dino-chibi`)
- **Triangle Budget**: **92,832 triangles** (strictly below 100,000 budget), 55,345 indexed vertices, 18 material meshes.
- **Armature / Rig**: **30 game-ready joints**, normalized skin weights, blended elbows, knees, torso and articulated 4-segment dinosaur tail.
- **Coordinates**: Y up, +Z forward. Root scale 0.35 converts the construction coordinates into game-ready scale (~1.34 m).
- **Rest pose**: Relaxed A-pose.
- **Humanoid Mapping**: `userData.humanoid` / GLB root extras contain standard humanoid bone mapping for Unity, Unreal Engine, Godot and Mixamo.
- **Attachment Sockets**: `GripSocket.L`, `GripSocket.R` (for weapons / props), `HeadSocket` (for hats / accessories).
- **Animation Clips**: `Idle` (breathing, subtle head tilt, tail wag), `Walk` (locomotion cycle with arm counter-swing and foot roll), `Wave` (cheerful greeting raising right paw).
- **Aesthetic Details**:
  - Joyful open smile (`:D`) with dark oral cavity and pink tongue.
  - Soft pink chibi cheek blush under each anime eye.
  - Layered hazel-green eyes with dark eyeliner and dual specular highlights.
  - Voluminous chocolate brown anime bangs framing forehead.
  - Prominent golden-amber hood crest spikes sweeping forward and down spine.
  - 3 chunky duffle coat wooden toggles with rope loops and leather reinforcement patches.
  - Dinosaur mitten paws with orange paw print pads on palms and white claws.
  - Chunky platform sneakers with sole treads, orange straps and ribbed green socks.

## Files

- `DinoChibi.ts`: `createGemniDino` (and `createDinoChibi` alias) character geometry, materials and assembly.
- `DinoRig.ts`: 30-bone hierarchy, bind pose, distance-based chain skin weights and animation clips.
- `DinoGeometry.ts`: Smooth geometry generators, extruded panels, spikes and material-batched skinned mesh builder.

## Validation and Export

Run from the project root:

```powershell
node scripts/verify-dino-character.mjs
npm run build
```

The validator checks:
1. Triangle budget `< 100.000` (actual: 92,832).
2. Finite attributes and normalized weights (`sum == 1`).
3. 30 bones and humanoid sockets.
4. Animated vertex displacement for `Idle`, `Walk`, and `Wave`.
5. GLB export and GLTFLoader round-trip integrity.
