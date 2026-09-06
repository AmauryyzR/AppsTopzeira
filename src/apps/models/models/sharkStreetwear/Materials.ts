import * as THREE from 'three';

/** Small woven normal tile. The map is embedded by GLTFExporter along with the color graphics. */
function textileNormal() {
  const size=128,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const nx=.20*Math.sin(x*Math.PI*.5)*(.7+.3*Math.cos(y*Math.PI*.5));
    const ny=.20*Math.sin(y*Math.PI*.5)*(.7+.3*Math.cos(x*Math.PI*.5));
    const i=(y*size+x)*4;data[i]=Math.round((nx*.5+.5)*255);data[i+1]=Math.round((ny*.5+.5)*255);data[i+2]=Math.round(Math.sqrt(1-nx*nx-ny*ny)*255);data[i+3]=255;
  }
  const texture=new THREE.DataTexture(data,size,size);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(8,8);texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}
function textileColor() {
  const size=128,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const hash=((Math.imul(x+17,73856093)^Math.imul(y+31,19349663))>>>0)/4294967296;
    const weave=2*Math.sin(x*Math.PI/2)*Math.sin(y*Math.PI/2);
    const value=Math.round(247+weave+hash*7);
    const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
  }
  const tex=new THREE.DataTexture(data,size,size);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(5,5);tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.needsUpdate=true;return tex;
}
export function createMaterials() {
  const normal=textileNormal(),grain=textileColor();
  const cloth=(name:string,color:number)=>new THREE.MeshStandardMaterial({name,color,map:grain,roughness:.92,metalness:0,normalMap:normal,normalScale:new THREE.Vector2(.10,.10)});
  const plain=(name:string,color:number,roughness=.7)=>new THREE.MeshStandardMaterial({name,color,roughness,metalness:0});
  const result = {
    blue:cloth('Slate_blue_fleece',0x6d85a4),black:cloth('Charcoal_jersey',0x34333a),lining:cloth('Pearl_lining',0xd9d7db),rib:cloth('Ribbed_cuffs',0x27262d),
    skin:plain('Porcelain_skin',0xe9bda9,.78),ear:plain('Ear_inner',0xc99a88,.82),silver:plain('Silver_hair',0xc6c1c9,.63),hairShade:plain('Silver_shadow',0x95919d,.72),
    hairLight:plain('Silver_sheen',0xd5d0d5,.67),ivory:plain('Soft_ivory_teeth',0xefebed,.68),eye:plain('Black_shark_eye',0x16171d,.24),white:plain('Offwhite_rubber',0xe5e2e7,.82),
    sole:plain('Graphite_outsole',0x24252d,.92),seam:plain('Cloth_seams',0x465c77,.95),lip:plain('Closed_lips',0x996d65,.92),
  };
  result.skin.emissive.copy(result.skin.color);result.skin.emissiveIntensity=.10;
  for(const hair of [result.silver,result.hairLight]) {hair.color.set(0xffffff);hair.vertexColors=true;hair.emissive.set(0x423b4a);hair.emissiveIntensity=.13;hair.roughness=.55;}
  result.black.emissive.copy(result.black.color);result.black.emissiveIntensity=.07;
  for(const fabric of [result.blue,result.lining]) {fabric.emissive.copy(fabric.color);fabric.emissiveIntensity=.12;}
  return result;
}

/** The artwork is a single conformal patch; no layered intersecting solid logos. */
export function sharkGraphic(): THREE.Texture | null {
  if(typeof document==='undefined') return null;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const c=canvas.getContext('2d')!;
  c.fillStyle='#34333a';c.fillRect(0,0,512,512);
  c.fillStyle='#7185a0';c.beginPath();c.moveTo(22,445);c.bezierCurveTo(134,352,116,218,266,173);c.lineTo(394,86);c.quadraticCurveTo(361,148,335,177);c.bezierCurveTo(440,179,472,254,503,305);c.bezierCurveTo(387,318,337,369,431,464);c.closePath();c.fill();
  c.fillStyle='#dedce3';c.beginPath();c.moveTo(0,336);c.bezierCurveTo(85,292,117,227,234,235);c.bezierCurveTo(184,249,159,293,178,322);c.bezierCurveTo(206,357,254,294,319,329);c.bezierCurveTo(248,333,257,382,366,408);c.lineTo(512,490);c.lineTo(0,490);c.closePath();c.fill();
  c.fillStyle='#26252b';c.beginPath();c.ellipse(275,267,17,22,.6,0,Math.PI*2);c.fill();
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;
}
