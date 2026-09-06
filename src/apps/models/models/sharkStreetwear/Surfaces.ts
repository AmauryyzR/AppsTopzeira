import * as THREE from 'three';
import {v} from './Geometry';

// One physical pattern defines the shell opening, lining, welt and every tooth root.
export const hoodOpening = new THREE.CatmullRomCurve3([
  v(0,1.053,.147),v(.130,1.086,.121),v(.224,1.153,.137),v(.240,1.257,.161),
  v(.200,1.389,.217),v(.113,1.472,.275),v(0,1.503,.296),
  v(-.113,1.472,.275),v(-.200,1.389,.217),v(-.240,1.257,.161),
  v(-.224,1.153,.137),v(-.130,1.086,.121),
], true, 'catmullrom', .35);

export function hoodSurface(u: number, t: number): THREE.Vector3 {
  const b = hoodOpening.getPoint(((u % 1) + 1) % 1);
  const f = Math.cos(t*Math.PI/2) + .28*Math.sin(t*Math.PI);
  const drape=Math.max(0,(1.29-b.y)/.237);
  return v(b.x*f, 1.29+(b.y-1.29)*f+(.025-.13*drape)*Math.sin(t*Math.PI), -.260+(b.z+.260)*Math.cos(t*Math.PI/2)**2);
}
export function hoodNormal(u: number, t: number) {
  const du = hoodSurface(u+.0001,t).sub(hoodSurface(u-.0001,t));
  const dt = hoodSurface(u,Math.min(.9999,t+.0001)).sub(hoodSurface(u,Math.max(0,t-.0001)));
  return dt.cross(du).normalize();
}
export function hoodShell(inner = false) {
  const positions: number[] = [], normals: number[] = [], uv: number[] = [], indices: number[] = [];
  const cols = 96, rows = 42;
  for (let j=0;j<=rows;j++) for(let i=0;i<=cols;i++) {
    const u=i/cols,t=Math.min(.99999,j/rows);
    const n=hoodNormal(u,t), p=hoodSurface(u,t);
    if(inner) p.addScaledVector(n,-.011);
    positions.push(...p.toArray()); normals.push(...n.multiplyScalar(inner?-1:1).toArray()); uv.push(u,t);
    if(i<cols && j<rows) {
      const k=j*(cols+1)+i;
      if(!inner) indices.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);
      else indices.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);
  return geo;
}
export const faceSurface = (x: number,y:number) => .067+.139*Math.sqrt(Math.max(.012,1-(x/.163)**2-((y-1.263)/.187)**2));

/** Surface patch with coherent normals and UVs, used for cloth panels and blindfold. */
export function patch(fn: (u:number,t:number)=>THREE.Vector3,cols=36,rows=18) {
  const p:number[]=[],uv:number[]=[],ix:number[]=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++) {
    p.push(...fn(i/cols,j/rows).toArray());uv.push(i/cols,j/rows);
    if(i<cols&&j<rows){const k=j*(cols+1)+i;ix.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;
}

export const torsoRadius=(t:number)=>.165+.023*Math.sin(t*Math.PI)-.025*t-.067*THREE.MathUtils.smoothstep(t,.85,1);
export function torsoPoint(a:number,t:number,offset=0) {
  const fold=.004*Math.sin(7*a+t*11)*Math.sin(t*Math.PI)+.005*Math.sin(13*a+t*17)*Math.exp(-(((t-.12)/.17)**2));
  const r=torsoRadius(t)+fold+offset;
  return v(Math.sin(a)*r,.635+t*.415,Math.cos(a)*r*.69);
}

