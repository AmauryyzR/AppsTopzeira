import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {SkinBuilder,ellipsoid,sweep,softSpike,v} from './Geometry';
import {createStreetwearRig,chain,streetwearAnimations} from './Rig';
import {hoodOpening,hoodSurface,hoodNormal,hoodShell,faceSurface,patch,torsoPoint} from './Surfaces';
import {createMaterials,sharkGraphic} from './Materials';

/** Independent model: no geometry or materials are shared with the existing SharkAnimestyle. */
export function createSharkStreetwear() {
  const root=new THREE.Group();root.name='Shark_Streetwear_Atelier';root.userData.previewDirection=[.42,.07,1];
  root.userData.studioShadowExtent=2;
  const rig=createStreetwearRig(),b=new SkinBuilder(rig),m=createMaterials();
  const add=b.add.bind(b);
  const ball=(p:number[],s:number[],mat:THREE.Material,bone='Head',seg=28,rings=20)=>add(ellipsoid(p,s,seg,rings),mat,bone);
  const line=(p:THREE.Vector3[],r:number,mat:THREE.Material,bone='Head',steps=28)=>add(sweep(p,[r,r,r],8,steps),mat,bone);
  const bodyWeights=(p:THREE.Vector3)=>chain(rig,['Hips','Spine','Chest'],p);
  const seams: {name:string;offset:number}[]=[];
  const outward=(g:THREE.BufferGeometry)=>{
    const ix=g.getIndex()!;
    for(let i=0;i<ix.count;i+=3){const a=ix.getX(i);ix.setX(i,ix.getX(i+1));ix.setX(i+1,a);}
    g.computeVertexNormals();return g;
  };

  // Hood, lining and rolled edge use exactly the same sewing pattern.
  add(hoodShell(),m.blue,'Head');add(hoodShell(true),m.lining,'Head');
  const edgePoints=Array.from({length:97},(_,i)=>hoodOpening.getPoint(i/96));
  line(edgePoints,.0105,m.lining,'Head',112);
  add(patch((u,t)=>hoodSurface(u,t*.047).addScaledVector(hoodNormal(u,t*.047),.001),96,6),m.lining,'Head');
  const stitch=Array.from({length:81},(_,i)=>{
    const u=i/80;return hoodSurface(u,.042).addScaledVector(hoodNormal(u,.042),.0015);
  });
  line(stitch,.0007,m.seam,'Head',96);
  const backSeam=[...Array.from({length:37},(_,i)=>hoodSurface(.5,.12+i/36*.88).addScaledVector(hoodNormal(.5,.12+i/36*.88),.0008)),
    ...Array.from({length:37},(_,i)=>hoodSurface(0,1-i/36*.86).addScaledVector(hoodNormal(0,1-i/36*.86),.0008))];
  line(backSeam,.00065,m.seam,'Head',88);

  // Fixed tooth bases live inside the rolled edge. Their frame points into the opening.
  const toothRoots: number[][]=[];
  for(let i=0;i<11;i++) {
    const u=.245+i*.051;
    const base=hoodOpening.getPoint(u),tangent=hoodOpening.getTangent(u).normalize();
    const inward=v(-base.x,(1.25-base.y)*.60,0).normalize();
    const normal=tangent.clone().cross(inward).normalize();
    if(normal.z<0)normal.negate();
    const xAxis=inward.clone().cross(normal).normalize();
    const frame=new THREE.Matrix4().makeBasis(xAxis,inward,normal);
    const tooth=patch((u,t)=>{
      const a=u*Math.PI*2,r=Math.pow(1-t,.72);
      return v(Math.cos(a)*.018*r,t*.047,Math.sin(a)*.010*r);
    },24,12);outward(tooth);
    tooth.applyMatrix4(frame);
    tooth.translate(base.x,base.y,base.z-.003);
    add(tooth,m.ivory,'Head');toothRoots.push(base.toArray());
  }
  root.userData.toothRoots=toothRoots;

  // Embedded appliqué eyes and embroidered gill slits are offset along shell normals.
  for(const side of [-1,1]) {
    const u=side===1?.387:.613,t=.11;
    const anchor=hoodSurface(u,t),normal=hoodNormal(u,t);
    const q=new THREE.Quaternion().setFromUnitVectors(v(0,0,1),normal);
    for(const [r,depth,offset,mat] of [[.028,.0028,.001,m.lining],[.0255,.005,.003,m.eye]] as const) {
      const g=ellipsoid([0,0,0],[r,r*.91,depth],32,20);g.applyQuaternion(q);g.translate(...anchor.clone().addScaledVector(normal,offset).toArray());add(g,mat,'Head');
    }
    for(let slit=0;slit<3;slit++) {
      const gu=side===1?.322:.678,gt=.16+slit*.04;
      const points=Array.from({length:6},(_,j)=>{
        const hu=gu+side*(j/5-.5)*.022;
        return hoodSurface(hu,gt+(j/5-.5)*.02).addScaledVector(hoodNormal(hu,gt),.0016);
      });line(points,.0019,m.sole,'Head',10);
    }
  }
  // A padded swept fin: broad base and smoothly tapering thickness, not an extruded slab.
  const fin=(base:THREE.Vector3,height:number,length:number,width:number,rotation=0,bone='Head')=>{
    const g=patch((u,t)=>{
      const a=u*Math.PI*2;
      const thick=width*Math.sin(Math.PI*(.06+t*.94))*(1-t*.82);
      return v(Math.cos(a)*thick,Math.sin(t*Math.PI/2)*height,(Math.sin(a)*length*.5)*(1-t)-length*.25*t);
    },28,22);
    // Parametric fin is closed at its narrow tip and its buried root.
    outward(g);g.rotateX(rotation);g.translate(base.x,base.y,base.z);add(g,m.blue,bone);
  };
  fin(hoodSurface(.5,.44).add(v(0,-.010,0)),.174,.154,.021);
  fin(hoodSurface(.5,.89).add(v(0,-.008,.008)),.095,.120,.016,-1.03);
  // Rear bifurcated tail appliqué lies against the sweatshirt with a buried top root.
  const fluke=new THREE.Shape();
  fluke.moveTo(0,.790);fluke.bezierCurveTo(-.015,.782,-.015,.739,-.040,.710);
  fluke.bezierCurveTo(-.063,.682,-.087,.660,-.090,.634);
  fluke.quadraticCurveTo(-.088,.625,-.076,.636);fluke.quadraticCurveTo(-.030,.674,0,.681);
  fluke.quadraticCurveTo(.030,.674,.076,.636);fluke.quadraticCurveTo(.088,.625,.090,.634);
  fluke.bezierCurveTo(.087,.660,.063,.682,.040,.710);fluke.bezierCurveTo(.015,.739,.015,.782,0,.790);
  const fg=new THREE.ExtrudeGeometry(fluke,{depth:.014,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:4,curveSegments:10,steps:1});
  fg.translate(0,0,-.145);fg.deleteAttribute('normal');const smoothFin=mergeVertices(fg);smoothFin.computeVertexNormals();fg.dispose();add(smoothFin,m.blue,'BackFin');

  // Scalp and face occupy a measured envelope inside the hood opening.
  ball([0,1.284,.035],[.174,.202,.151],m.hairShade,'Head',40,28);
  const face=ellipsoid([0,1.263,.067],[.163,.187,.139],64,48);
  // Subtle jaw taper, avoiding a perfect sphere.
  const fp=face.getAttribute('position');
  for(let i=0;i<fp.count;i++) {
    const y=fp.getY(i),jaw=THREE.MathUtils.smoothstep(1.24-y,0,.14);
    const x=fp.getX(i),z=fp.getZ(i);
    fp.setX(i,x*(1-.23*jaw));
    if(z>.067) fp.setZ(i,z+.017*Math.exp(-((x/.014)**2)-(((y-1.223)/.025)**2)));
  }face.computeVertexNormals();add(face,m.skin,'Head');
  ball([0,1.086,.025],[.047,.071,.046],m.skin,'Neck',24,16);
  for(const side of [-1,1]) {
    ball([side*.159,1.244,.071],[.031,.045,.022],m.skin,'Head',24,18);
    ball([side*.170,1.244,.088],[.014,.026,.006],m.ear,'Head',20,14);
  }
  line([v(-.025,1.177,faceSurface(-.025,1.177)+.001),v(0,1.180,faceSurface(0,1.180)+.0015),v(.023,1.176,faceSurface(.023,1.176)+.001)],.0016,m.lip,'Head',16);
  // Black cloth band wraps the head instead of floating flat ahead of the face.
  const blindfold=patch((u,t)=>{
    const a=(u-.5)*Math.PI*2;
    const y=1.285+(t-.5)*.074+.007*Math.cos(a);
    const x=Math.sin(a)*.164;
    const z=a>-Math.PI/2&&a<Math.PI/2?faceSurface(x,y)+.004:.046+Math.cos(a)*.150;
    return v(x,y,z);
  },80,12);add(blindfold,m.black,'Head');

  // Sculpted ribbon locks have a convex cross-section, clear tips and finer engraved strands.
  const hairLock=(points:THREE.Vector3[],width:number,shade:THREE.Material,index:number)=>{
    const curve=new THREE.CatmullRomCurve3(points);
    const g=patch((u,t)=>{
      const p=curve.getPoint(t),tan=curve.getTangent(t).normalize();
      const side=v(tan.y,-tan.x,0).normalize();
      const w=width*Math.sin(Math.PI*(.19+.81*t))**.70;
      const angle=u*Math.PI*2;
      return p.addScaledVector(side,Math.cos(angle)*w).add(v(0,0,Math.sin(angle)*w*.36));
    },18,28);outward(g);
    const colors=new Float32Array(g.getAttribute('position').count*3);
    for(let row=0;row<=28;row++) for(let col=0;col<=18;col++) {
      const t=row/28,a=col/18*Math.PI*2;
      const light=.28+.48*Math.max(0,Math.sin(a))+.15*Math.sin(t*Math.PI)-.11*t;
      const c=new THREE.Color(0x625c70).lerp(new THREE.Color(0xe0dde4),Math.max(0,light));
      colors.set(c.toArray(),(row*19+col)*3);
    }
    g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));add(g,shade,'Head');
  };
  const fringe=[
    [v(-.072,1.450,.146),v(-.127,1.403,.180),v(-.146,1.333,.185),v(-.200,1.305,.151)],
    [v(-.030,1.459,.159),v(-.075,1.401,.193),v(-.066,1.352,.213),v(-.024,1.337,.218)],
    [v(.007,1.465,.153),v(-.020,1.418,.194),v(.015,1.372,.208),v(.080,1.352,.194)],
    [v(.042,1.450,.153),v(.067,1.415,.178),v(.107,1.393,.181),v(.147,1.395,.158)],
    [v(.093,1.441,.137),v(.143,1.389,.153),v(.145,1.340,.168),v(.126,1.301,.184)],
    [v(-.129,1.413,.129),v(-.167,1.346,.140),v(-.169,1.286,.133),v(-.189,1.261,.117)],
    [v(.140,1.399,.119),v(.180,1.338,.115),v(.172,1.281,.118),v(.152,1.258,.139)],
  ];
  fringe.forEach((p,i)=>hairLock(p,i<5?.032:.023,i%3===1?m.hairLight:m.silver,i));
  fringe.slice(0,5).forEach((points,i)=>hairLock(points.map((p,j)=>p.clone().add(v((i%2?1:-1)*.012,-j*.006,.012-j*.002))),.013,m.silver,20+i));
  for(let i=0;i<10;i++) {
    const a=(i/9)*Math.PI+Math.PI/2;
    const x=Math.sin(a)*.153,z=.025+Math.cos(a)*.128;
    hairLock([v(x*.75,1.432,z),v(x*1.06,1.34,z),v(x*1.04,1.22,z),v(x*1.12,1.196,z+.006)],.019,i%2?m.hairShade:m.silver,7+i);
  }

  // Sweatshirt surface; the pocket and its stitches are sampled from the same draped torso.
  add(patch((u,t)=>torsoPoint(u*Math.PI*2,t),64,38),m.black,bodyWeights);
  add(patch((u,t)=>{
    const a=u*Math.PI*2,r=THREE.MathUtils.lerp(.075,.122,t);
    return v(Math.sin(a)*r,1.033+t*.036, .018+Math.cos(a)*r*(.69+.37*t));
  },64,10),m.blue,'Neck');
  const graphic=sharkGraphic();
  const pocketMat=new THREE.MeshStandardMaterial({name:'Shark_print',color:graphic?0xffffff:0x647f9f,map:graphic,roughness:.94});
  add(patch((u,t)=>torsoPoint((u-.5)*1.85,.095+t*.355,.0024),40,22),pocketMat,bodyWeights);
  for(const a of [-.925,.925]) {
    const path=Array.from({length:17},(_,i)=>torsoPoint(a,.12+i/16*.29,.0032));line(path,.001,m.sole,'Spine',22);
  }
  const hem=patch((u,t)=>{
    const a=u*Math.PI*2,r=.161+.0007*Math.cos(a*48);
    return v(Math.sin(a)*r,.615+t*.040,Math.cos(a)*r*.72);
  },144,6);add(hem,m.rib,'Hips');
  seams.push({name:'pocket surface',offset:.0024});
  // Cords emerge from the lower opening; the tip is attached to the last point of each cord.
  for(const side of [-1,1]) {
    const origin=hoodOpening.getPoint(side===1?.026:.974);
    const end=v(side*.052,.935,.126);
    line([origin,v(side*.042,1.015,.145),end],.0027,m.blue,'Chest',24);
    const aglet=softSpike(.011,.029,.009);aglet.rotateZ(Math.PI);aglet.translate(end.x,end.y+.006,end.z);add(aglet,m.blue,'Chest');
  }

  // Baggy sleeves, ribbed cuffs and separated anatomical fingers.
  for(const [side,sign] of [['L',1],['R',-1]] as const) {
    const points=[v(sign*.110,.974,0),v(sign*.208,.926,0),v(sign*.248,.799,.012),v(sign*.281,.694,.022)];
    const sleeve=sweep(points,[.074,.083,.070,.053],36,44,.88);
    const p=sleeve.getAttribute('position');
    for(let i=0;i<p.count;i++) {
      const y=p.getY(i),fold=.0018*Math.sin(y*155+p.getZ(i)*27)*Math.exp(-(((y-.75)/.09)**2));
      p.setX(i,p.getX(i)+sign*fold);
    }sleeve.computeVertexNormals();
    // Color the fabric by longitudinal position; there is no second overlapping sleeve mesh.
    const cols=new Float32Array(p.count*3);const blue=new THREE.Color(0x6d85a4),dark=new THREE.Color(0x34333a),white=new THREE.Color(0xd9d7db);
    for(let i=0;i<p.count;i++) {
      const y=p.getY(i),a=Math.atan2(p.getZ(i),p.getX(i)-sign*.245);
      const boundary=.827+.014*Math.sin(a*2.0)+.015*Math.sin(a*3.0);
      const color=y<.714?dark:y<.720?dark.clone().lerp(blue,(y-.714)/.006):y<boundary-.002?blue:y<boundary+.002?blue.clone().lerp(white,(y-boundary+.002)/.004):y<boundary+.023?white:y<boundary+.027?white.clone().lerp(dark,(y-boundary-.023)/.004):dark;
      cols.set(color.toArray(),i*3);
    }sleeve.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
    const sleeveMat=m.black.clone();sleeveMat.name=`Wave_sleeve_${side}`;sleeveMat.color.set(0xffffff);sleeveMat.vertexColors=true;
    add(sleeve,sleeveMat,point=>chain(rig,[`UpperArm_${side}`,`Forearm_${side}`,`Hand_${side}`],point));
    add(sweep([v(sign*.281,.707,.022),v(sign*.285,.659,.023)],[.050,.043],36,8),m.rib,`Hand_${side}`);
    ball([sign*.285,.630,.025],[.033,.040,.020],m.skin,`Hand_${side}`,28,20);
    for(let finger=0;finger<4;finger++) {
      const x=sign*(.26+finger*.018),length=.045+Math.sin(finger/3*Math.PI)*.012;
      const path=[v(x,.610,.032),v(x,.595,.032),v(x-sign*.002,.610-length,.048),v(x-sign*.004,.612-length,.061)];
      add(sweep(path,[.0081,.0078,.0069,.0038],14,16),m.skin,point=>chain(rig,[`Finger${finger+1}_${side}`,`Finger${finger+1}Tip_${side}`],point));
    }
    add(sweep([v(sign*.258,.640,.032),v(sign*.242,.622,.045),v(sign*.239,.601,.060)],[.012,.010,.005],16,18),m.skin,point=>chain(rig,[`Thumb_${side}`,`ThumbTip_${side}`],point));

    // Pants terminate inside cuffs, while the ankle continues inside the shoe collar.
    const leg=sweep([v(sign*.090,.663,0),v(sign*.098,.530,0),v(sign*.106,.380,.006),v(sign*.114,.220,.004)],[.084,.081,.078,.056],40,48,.92);
    const lp=leg.getAttribute('position');
    for(let i=0;i<lp.count;i++) {
      const y=lp.getY(i),angle=Math.atan2(lp.getZ(i),lp.getX(i)-sign*.108);
      const fold=.0038*Math.sin(y*108+angle*2)*Math.exp(-(((y-.28)/.10)**2))+.0020*Math.sin(y*43-angle*3);
      lp.setX(i,lp.getX(i)+Math.cos(angle)*fold);lp.setZ(i,lp.getZ(i)+Math.sin(angle)*fold);
    }leg.computeVertexNormals();add(leg,m.black,point=>chain(rig,[`Thigh_${side}`,`Shin_${side}`,`Foot_${side}`],point));
    add(sweep([v(sign*.114,.239,.004),v(sign*.118,.198,.006)],[.053,.048],36,8),m.rib,`Shin_${side}`);
    add(sweep([v(sign*.118,.215,.007),v(sign*.118,.110,.007)],[.034,.029],24,12),m.skin,`Foot_${side}`);
    // Flat-bottomed shaped sole, curved upper and surface-projected laces.
    const shoeX=sign*.118;
    const sole=patch((u,t)=>{
      const a=u*Math.PI*2,r=.96+.04*Math.sin(Math.PI*t);
      return v(shoeX+Math.sin(a)*.077*r,.018+t*.037+.005*Math.cos(a*2),.044+Math.cos(a)*.124*r);
    },64,8);add(sole,m.white,`Foot_${side}`);
    const tread=ellipsoid([shoeX,.017,.044],[.075,.009,.121],40,16);
    const tp=tread.getAttribute('position');for(let k=0;k<tp.count;k++)tp.setY(k,Math.max(.011,tp.getY(k)));tread.computeVertexNormals();add(tread,m.sole,`Foot_${side}`);
    ball([shoeX,.074,.037],[.070,.055,.113],m.white,`Foot_${side}`,40,24);
    // Blue mudguard follows the exact upper ellipsoid as a shallow conformal shell.
    const guard=patch((u,t)=>{
      const a=(u-.5)*Math.PI*2,phi=1.09+t*.33;
      return v(shoeX+Math.sin(a)*Math.sin(phi)*.071,.074+Math.cos(phi)*.055,.037+Math.cos(a)*Math.sin(phi)*.114);
    },56,8);outward(guard);add(guard,m.blue,`Foot_${side}`);
    const tongue=ellipsoid([shoeX,.130,.027],[.035,.008,.054],28,16);add(tongue,m.black,`Foot_${side}`);
    for(const s of [-1,1]) {
      const quarter=patch((u,t)=>{
        const x=s*(.020+u*.044),z=-.040+t*.115;
        const y=.074+.055*Math.sqrt(Math.max(.025,1-(x/.070)**2-((z-.037)/.113)**2));
        return v(shoeX+x,y+.0025,z);
      },14,16);if(s>0)outward(quarter);add(quarter,m.black,`Foot_${side}`);
    }
    for(let i=0;i<4;i++) {
      const z=.015+i*.016;
      const lace=Array.from({length:9},(_,j)=>{
        const x=-.032+j/8*.064,lz=z+j/8*.014;
        const upper=.074+.055*Math.sqrt(Math.max(.001,1-(x/.070)**2-((lz-.037)/.113)**2))+.0025;
        const d=1-(x/.035)**2-((lz-.027)/.054)**2;
        const tongueTop=d>0?.130+.008*Math.sqrt(d):0;
        return v(shoeX+x,Math.max(upper,tongueTop)+.001,lz);
      });line(lace,.0022,m.lining,`Foot_${side}`,16);
    }
    const heel=softSpike(.030,.049,.018);heel.rotateX(-.35);heel.translate(shoeX,.087,-.061);add(heel,m.blue,`Foot_${side}`);
  }
  ball([0,.632,0],[.148,.049,.094],m.black,'Hips',36,24);

  b.finish(root);root.animations=streetwearAnimations();root.userData.units='meters';root.userData.surfaceOffsets=seams;
  root.userData.attachments=['GripSocket_L','GripSocket_R','HeadSocket'];
  return root;
}

