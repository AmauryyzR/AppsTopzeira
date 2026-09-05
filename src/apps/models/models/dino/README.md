# Dino Chibi

Procedural character based on the supplied dinosaur-costume reference.

- Studio: `/models?model=dino-chibi`
- Final budget: 87,712 triangles, 52,157 indexed vertices, 15 material meshes.
- Rig: 30 joints, normalized weights, blended elbows, knees, torso and tail.
- Coordinates: Y up, +Z forward. Root scale 0.35 converts the construction coordinates to a roughly 1.34 m character. Keep the imported root transform.
- Rest pose: relaxed A-pose. Costume mittens use hand bones; there are no individual finger joints.
- Preview/export clips: `Idle`, `Walk` (in place), `Wave`. These are starter animation clips; no IK, physics or collision controller is included.
- Attachment bones: `GripSocket.L`, `GripSocket.R`, `HeadSocket`.
- `userData.humanoid` / GLB root extras contain the humanoid bone mapping. The four tail joints remain an additional chain.
- Eye and clothing components are weighted to the same skeleton. The closed smile follows `Jaw`; no facial blend shapes are included.

## Files

- `DinoChibi.ts`: character geometry, materials, costume details and assembly.
- `DinoRig.ts`: bind pose, hierarchy, weights and animation clips.
- `DinoGeometry.ts`: smooth geometry builders and material-batched skinned meshes.

## Validation and export

Run from the project root:

```powershell
node scripts/verify-dino-character.mjs
npm run build
```

The validator checks the triangle budget, finite attributes, normalized skin weights, required bones and animated vertex deformation. It exports `output/dino/dino-chibi.glb`, reloads it through GLTFLoader, and verifies the skeleton, triangle count and animated hand motion. A report is saved in `output/dino/validation.json`.

The studio's GLB button also exports joints, weights and all three clips. Skeleton preview lines are excluded from the exported model. Importers may sanitize dots in bone names (for example, Three.js GLTFLoader converts `Hand.R` to `HandR`).
