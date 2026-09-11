import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import * as THREE from 'three';
import {PNG} from 'pngjs';

const folder=path.resolve('output/playwright/whitesharkboy');
await fs.mkdir(folder,{recursive:true});
await build({entryPoints:['src/apps/models/models/whitesharkBoy/WhitesharkBoy.ts'],outfile:path.join(folder,'validated-model.mjs'),bundle:true,platform:'node',format:'esm',external:['three','three/*']});
const {createWhitesharkBoy}=await import(`${new URL(`file:///${folder.replaceAll('\\','/')}/validated-model.mjs`)}?t=${Date.now()}`);
const model=createWhitesharkBoy(),meshes=[],bones=[];
model.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);if(o.isBone)bones.push(o);});
assert.equal(model.name,'WhitesharkBoy');assert.equal(new Set(bones.map(b=>b.name)).size,55);
assert.deepEqual(model.animations.map(c=>c.name),['Idle','Walk','Jump']);
let triangles=0,vertices=0,maxWeightError=0;
for(const mesh of meshes){
  const g=mesh.geometry,p=g.attributes.position,si=g.attributes.skinIndex,sw=g.attributes.skinWeight;
  vertices+=p.count;triangles+=g.index.count/3;
  for(const attribute of Object.values(g.attributes))assert.ok(Array.from(attribute.array).every(Number.isFinite),`${mesh.name} finite attributes`);
  for(let i=0;i<p.count;i++){
    const sum=sw.getX(i)+sw.getY(i)+sw.getZ(i)+sw.getW(i);maxWeightError=Math.max(maxWeightError,Math.abs(1-sum));
    for(let j=0;j<4;j++){assert.ok(si.array[i*4+j]<55);assert.ok(sw.array[i*4+j]>=0);}
  }
  for(const i of g.index.array)assert.ok(i<p.count);
}
assert.ok(triangles<100000);assert.equal(triangles,model.userData.triangles);assert.ok(maxWeightError<1e-6);
// Validate animated foot contacts and all posed vertices independently of the renderer.
const mixer=new THREE.AnimationMixer(model),sampleReports=[];
for(const clip of model.animations){
  mixer.stopAllAction();meshes[0].skeleton.pose();
  const action=mixer.clipAction(clip).reset().setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();
  let minSoleY=Infinity,maxSoleY=-Infinity,maxSupportError=0,maxJumpRoot=0;
  const endpoint=[];
  for(let sample=0;sample<=48;sample++){
    const t=sample/48*clip.duration;mixer.setTime(t);model.updateMatrixWorld(true);meshes[0].skeleton.update();
    const root=model.getObjectByName('Root').getWorldPosition(new THREE.Vector3());maxJumpRoot=Math.max(maxJumpRoot,root.y);
    for(const [side,phaseOffset] of [['L',0],['R',.5]]){
      const foot=model.getObjectByName(`Foot_${side}`).getWorldPosition(new THREE.Vector3());
      const phase=(t/clip.duration+phaseOffset)%1;
      if(clip.name==='Idle'||clip.name==='Walk'&&phase<.60)maxSupportError=Math.max(maxSupportError,Math.abs(foot.y-.125));
    }
    for(const mesh of meshes){
      const p=mesh.geometry.attributes.position,si=mesh.geometry.attributes.skinIndex;
      for(let i=0;i<p.count;i+=7){
        const q=mesh.getVertexPosition(i,new THREE.Vector3()).applyMatrix4(mesh.matrixWorld);assert.ok(q.toArray().every(Number.isFinite));
        if(mesh.material.name==='Graphite_outsole'&&p.getY(i)<.07){minSoleY=Math.min(minSoleY,q.y);maxSoleY=Math.max(maxSoleY,q.y);}
        assert.ok(si.getX(i)<55);
      }
    }
    if(sample===0||sample===48)endpoint.push(bones.map(b=>[...b.position.toArray(),...b.quaternion.toArray()]));
  }
  assert.ok(minSoleY>-.004,`${clip.name} penetrates floor by ${-minSoleY}`);
  assert.ok(maxSupportError<.0015,`${clip.name} foot support error ${maxSupportError}`);
  if(clip.name!=='Jump')for(let i=0;i<55;i++)for(let k=0;k<7;k++)assert.ok(Math.abs(endpoint[0][i][k]-endpoint[1][i][k])<1e-5,`${clip.name} loop continuity`);
  if(clip.name==='Jump')assert.ok(maxJumpRoot>.24&&maxJumpRoot<.25);
  sampleReports.push({clip:clip.name,duration:clip.duration,minSoleY,maxSoleY,maxSupportError,maxJumpRoot});
}
const report={asset:model.name,triangles,vertices,bones:bones.length,meshes:meshes.length,maxWeightError,animations:sampleReports};

const glbFile=path.join(folder,'WhitesharkBoy.glb');
if(process.argv.includes('--glb')) {
  const data=await fs.readFile(glbFile);assert.equal(data.toString('ascii',0,4),'glTF');assert.equal(data.readUInt32LE(4),2);assert.equal(data.readUInt32LE(8),data.length);
  const jsonLength=data.readUInt32LE(12),gltf=JSON.parse(data.toString('utf8',20,20+jsonLength));const binStart=20+jsonLength+8;
  let exportedTriangles=0;
  for(const mesh of gltf.meshes)for(const p of mesh.primitives){exportedTriangles+=gltf.accessors[p.indices].count/3;assert.notEqual(p.attributes.JOINTS_0,undefined);assert.notEqual(p.attributes.WEIGHTS_0,undefined);}
  assert.equal(exportedTriangles,triangles,'Export must match current source triangle count');
  assert.deepEqual(gltf.animations.map(c=>c.name),['Idle','Walk','Jump']);
  assert.ok(gltf.skins.every(s=>s.joints.length===55));
  const images=gltf.images.map(img=>{const view=gltf.bufferViews[img.bufferView];assert.equal(img.mimeType,'image/png');const png=PNG.sync.read(data.subarray(binStart+(view.byteOffset??0),binStart+(view.byteOffset??0)+view.byteLength));return {width:png.width,height:png.height};});
  assert.ok(images.some(i=>i.width===1024),'Real browser graphic texture is required');assert.ok(images.length>=3);
  report.glb={bytes:data.length,triangles:exportedTriangles,skins:gltf.skins.length,images,animations:gltf.animations.length};
}
await fs.writeFile(path.join(folder,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
