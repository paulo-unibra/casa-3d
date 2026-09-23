import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import './style.css';

const app=document.querySelector('#app');
app.innerHTML=`<main class="viewer"><div class="loading">Preparando a visita...</div><div class="topbar"><div class="brand"><div class="brand-icon">C8</div><div><strong>Casa C8</strong><small>Igarassu · Pernambuco</small></div></div><div class="top-actions"><button id="rooms-toggle" aria-expanded="false" aria-controls="panel">Ambientes</button><button id="roof">Mostrar teto</button><button id="reset">Recentrar</button></div></div><aside class="panel" id="panel"><img class="photo" src="${import.meta.env.BASE_URL}fachada.jpg" alt="Fotografia real da fachada"><h1>Explore a casa.</h1><p>Um passeio pela fachada, pelos ambientes internos e pela área externa, reconstruído a partir das imagens da casa.</p><div class="meta"><span>Área privativa <strong>54,07 m²</strong></span><span>Um pavimento</span></div><div class="rooms" id="rooms"></div><button class="plan-btn" id="plan-open">Ver planta enviada</button><p class="panel-note">Proporções aproximadas; planta sem cotas lineares.</p></aside><dialog class="plan-dialog" id="plan-dialog"><button id="plan-close" aria-label="Fechar planta">Fechar</button><img src="${import.meta.env.BASE_URL}planta-original.png" alt="Planta enviada pelo proprietário mostrando a disposição dos cômodos"></dialog><div class="scene-label" id="scene-label">Vista superior</div><div class="door-tip" id="door-tip" role="status" aria-live="polite">Toque nas portas e grades para abrir ou fechar</div><div class="reticle" aria-hidden="true"></div><div class="help" id="help">Arraste para girar · role para aproximar<br>Selecione um ambiente para entrar</div><div class="joy" id="joy"><button data-dir="forward" aria-label="Avançar">↑</button><button data-dir="left" aria-label="Ir à esquerda">←</button><button data-dir="back" aria-label="Voltar">↓</button><button data-dir="right" aria-label="Ir à direita">→</button></div><nav class="bottom" aria-label="Modo de navegação"><button id="outside">Fachada</button><button id="aerial" class="active">Vista superior</button><span class="separator"></span><button id="walk">Caminhar</button></nav></main>`;
const viewer=document.querySelector('.viewer');
const scene=new THREE.Scene();scene.background=new THREE.Color('#bed6e4');scene.fog=new THREE.Fog('#bed6e4',28,65);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.035,100);
try {
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.9;viewer.prepend(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.dampingFactor=.07;orbit.minDistance=5;orbit.maxDistance=28;orbit.minPolarAngle=.05;orbit.maxPolarAngle=1.25;orbit.target.set(0,1,0);
scene.add(new THREE.HemisphereLight('#ffffff','#adaba0',3.2));scene.add(new THREE.AmbientLight('#ffffff',.7));const sun=new THREE.DirectionalLight('#fff4d5',3.4);sun.position.set(-7,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-19;sun.shadow.camera.right=19;sun.shadow.camera.top=19;sun.shadow.camera.bottom=-19;sun.shadow.bias=-.0001;scene.add(sun);
const mat=(color,roughness=1,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const plaster=mat('#e6d5a8'), interior=mat('#efeee7'), concrete=mat('#b6b3a8'), darkMetal=mat('#333f3c',.45,.65), whiteMetal=mat('#e4e8e5',.32,.38), green=mat('#1d5945',.75), glass=new THREE.MeshPhysicalMaterial({color:'#cadbd5',transparent:true,opacity:.28,metalness:.05,roughness:.12,side:THREE.DoubleSide,depthWrite:false}),grass=mat('#7e9159'),soil=mat('#8b7654'),brick=mat('#a45c46');
function gridTexture(base,line,step=80,size=512){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,size,size);x.strokeStyle=line;x.lineWidth=3;for(let i=0;i<=size;i+=step){x.beginPath();x.moveTo(i,0);x.lineTo(i,size);x.moveTo(0,i);x.lineTo(size,i);x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
const floorTex=gridTexture('#d7d5ce','#a9a9a1',64);floorTex.repeat.set(6,8);const tileMat=new THREE.MeshStandardMaterial({map:floorTex,roughness:.55});const greenTex=gridTexture('#245d49','#d8d9cb',40);greenTex.repeat.set(1,2);const greenTiles=new THREE.MeshStandardMaterial({map:greenTex,roughness:.72});
function box(w,h,d,x,y,z,m,shadow=true){let mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=true;scene.add(mesh);return mesh}
function plane(w,d,x,y,z,m){const o=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.receiveShadow=true;scene.add(o);return o}
// Approximate scale follows the supplied floor plan's proportions. Front is +Z.
// The document confirms 54.07 m² but provides no room-by-room measurements.
const W=6.4,D=8.45,front=4.225,back=-4.225,H=2.8,T=.15;
const splitX=-.05,room2X=1.31,serviceZ=-2.47,rearZ=-.85,room1Z=1.68,terraceZ=2.98;
plane(24,23,0,-.18,0,grass);plane(12,3,0,-.157,7.4,concrete);plane(13,4,0,-.155,-7.1,grass);plane(W,D,0,.01,0,tileMat);
// Street approach, terrace, side access and rear service path.
box(1.4,.07,3.8,-2.25,-.09,5.6,concrete);box(1.1,.065,11.5,4.12,-.08,-.7,concrete);box(6,.065,1.0,0,-.08,-5.5,concrete);box(6,.06,.56,0,-.11,4.62,concrete);
plane(3.05,1.22,-1.625,.046,3.59,tileMat);
for(let i=0;i<65;i++){const x=(i*17%53)/53*10-5,z=(i*29%71)/71*15-7;if(Math.abs(x)>3.7&&z<4.8&&z>-5.8){const tuft=box(.05,.08,.08,x,-.11,z,mat(i%3?'#718d4c':'#879c55'),false);tuft.rotation.y=i}}
box(.14,2.1,13.8,5.0,.9,-.2,concrete);box(10,1.8,.16,.1,.72,-6.7,concrete);
const obstacles=[];
function wallX(x1,x2,z,m=plaster,h=H,y=h/2,collide=true){const o=box(Math.abs(x2-x1),h,T,(x1+x2)/2,y,z,m);if(collide)obstacles.push({x1:Math.min(x1,x2)-.07,x2:Math.max(x1,x2)+.07,z1:z-T,z2:z+T});return o}
function wallZ(z1,z2,x,m=plaster,h=H,y=h/2,collide=true){const o=box(T,h,Math.abs(z2-z1),x,y,(z1+z2)/2,m);if(collide)obstacles.push({x1:x-T,x2:x+T,z1:Math.min(z1,z2)-.07,z2:Math.max(z1,z2)+.07});return o}
// External shell: metal entry into the terrace at left; bedroom window at right.
wallX(-3.2,-2.65,front);wallX(-.75,1.05,front);wallX(2.25,3.2,front);
wallX(-2.65,-.75,front,plaster,.5,2.55,false);
wallX(1.05,2.25,front,plaster,1.04,.52);wallX(1.05,2.25,front,greenTiles,.4,2.6,false);
wallX(-3.2,-2.7,back);wallX(-1.6,3.2,back);wallX(-2.7,-1.6,back,plaster,.55,2.525,false);
wallZ(back,front,-3.2);
// One side window only, at Quarto 2 as marked on the supplied plan.
wallZ(back,-.05,3.2);wallZ(.95,front,3.2);
wallZ(-.05,.95,3.2,plaster,.9,.45);wallZ(-.05,.95,3.2,plaster,.62,2.49,false);
// Green ceramic tile on the front facade and around the side window of Quarto 2.
box(1.2,1.04,.015,1.65,.52,front+.083,greenTiles,false);
box(1.2,.4,.015,1.65,2.6,front+.083,greenTiles,false);
box(.016,.9,1.04,3.285,.45,.45,greenTiles,false);
box(.016,.54,1.04,3.285,2.53,.45,greenTiles,false);
// Terrace -> Sala; the wide opening reproduces the photo of the entrance.
wallX(-3.2,-2.65,terraceZ,interior);wallX(-.65,splitX,terraceZ,interior);
// Sala -> Quarto 1, door on the top edge of the bedroom in the supplied plan.
wallX(splitX,.65,room1Z,interior);wallX(1.36,3.2,room1Z,interior);
wallZ(room1Z,front,splitX,interior);
// Sala -> Quarto 2, door in the left wall.
wallZ(rearZ,-.02,room2X,interior);wallZ(.78,room1Z,room2X,interior);
wallX(room2X,3.2,rearZ,interior);
// Bathroom and service are to the left, kitchen to the right. The kitchen
// connects to the sala; both wet areas are reached from its left-hand side.
wallX(-3.2,splitX,rearZ,interior);
wallX(-3.2,splitX,serviceZ,interior);
wallZ(back,-3.55,splitX,interior);wallZ(-2.75,-1.95,splitX,interior);wallZ(-1.18,rearZ,splitX,interior);
function openingX(x,z,w=.8,frame=whiteMetal){box(.045,2.12,.06,x-w/2,1.06,z,frame,false);box(.045,2.12,.06,x+w/2,1.06,z,frame,false);box(w+.1,.06,.08,x,2.11,z,frame,false)}
function openingZ(x,z,w=.8,frame=whiteMetal){box(.06,2.12,.045,x,1.06,z-w/2,frame,false);box(.06,2.12,.045,x,1.06,z+w/2,frame,false);box(.08,.06,w+.1,x,2.11,z,frame,false)}
openingX(-1.70,front,1.9,darkMetal);openingX(-1.65,terraceZ,2,whiteMetal);
openingX(1.005,room1Z,.71,mat('#8b5940'));openingZ(room2X,.38,.8,mat('#8b5940'));
openingZ(splitX,-1.565,.77,mat('#8b5940'));openingZ(splitX,-3.15,.8,whiteMetal);
openingX(-2.15,back,1.1,whiteMetal);
function windowX(x,z,w,h,y){box(w+.1,.055,.08,x,y+h/2,z,whiteMetal,false);box(w+.1,.055,.08,x,y-h/2,z,whiteMetal,false);box(.05,h,.08,x-w/2,y,z,whiteMetal,false);box(.05,h,.08,x+w/2,y,z,whiteMetal,false);box(w,h,.015,x,y,z,glass,false);for(let v=-w/2+.17;v<w/2;v+=.2)box(.013,h,.018,x+v,y,z+.055,darkMetal,false);for(let v=-h/2+.17;v<h/2;v+=.2)box(w,.013,.018,x,y+v,z+.055,darkMetal,false)}
function windowZ(x,z,w,h,y){box(.08,.055,w+.1,x,y+h/2,z,whiteMetal,false);box(.08,.055,w+.1,x,y-h/2,z,whiteMetal,false);box(.08,h,.05,x,y,z-w/2,whiteMetal,false);box(.08,h,.05,x,y,z+w/2,whiteMetal,false);box(.015,h,w,x,y,z,glass,false);for(let v=-w/2+.16;v<w/2;v+=.2)box(.02,h,.013,x+.08,y,z+v,darkMetal,false);for(let v=-h/2+.17;v<h/2;v+=.2)box(.02,.013,w,x+.08,y+v,z,darkMetal,false)}
windowX(1.65,front+.089,1.2,1.12,1.63);
windowZ(3.29,.45,1,.9,1.47);
// Doors share a click target and a closed-state collision zone.
const interactive=[],doorMeshes=[];
function registerDoor(name,meshes,movingParts,closedZone){
 const item={name,meshes,movingParts,closedZone,open:true,target:1};
 closedZone.active=false;obstacles.push(closedZone);
 for(const mesh of meshes){mesh.userData.door=item;doorMeshes.push(mesh)}
 interactive.push(item);return item;
}
// Open double-leaf metal grilles, proportional to the supplied plan.
function gate(x1,x2,z,name,outward=1){
 const width=(x2-x1)/2-.025,height=2.25;
 for(const hinge of [x1,x2])box(.045,height,.045,hinge,height/2,z+.12,darkMetal,false);
 const leaves=[],meshes=[];
 for(const [hinge,dir,angle] of [[x1,1,-1.13],[x2,-1,1.13]]){
  const leaf=new THREE.Group();leaf.position.set(hinge,0,z+.12);leaf.rotation.y=angle*outward;scene.add(leaf);
  leaves.push({object:leaf,openAngle:angle*outward});
  const part=(w,h,d,x,y,pz,material=darkMetal)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,pz);leaf.add(mesh);meshes.push(mesh)};
  for(const y of [.13,height-.08])part(width,.035,.035,dir*width/2,y,0);
  for(const x of [0,dir*width/2,dir*width])part(.035,height,.035,x,height/2,0);
  for(let y=.31;y<height-.14;y+=.19)part(width-.05,.02,.025,dir*width/2,y,0);
  // Broad invisible hit area makes the bars easy to touch on small screens.
  part(width-.04,height-.07,.006,dir*width/2,height/2,0,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
 }
 return registerDoor(name,meshes,leaves,{x1:x1-.06,x2:x2+.06,z1:z-.14,z2:z+.2});
}
gate(-2.65,-.75,front,'Grade da fachada');
gate(-2.7,-1.6,back-.18,'Grade dos fundos',-1);
// Aluminium sliding door between the terrace and living room; one side is open.
const sliderFixed=[];
sliderFixed.push(box(.94,1.98,.022,-2.18,1.0,terraceZ+.035,glass,false));
for(const x of [-2.65,-1.7])sliderFixed.push(box(.035,2.04,.035,x,1.02,terraceZ+.05,whiteMetal,false));
for(const y of [.03,2.04])sliderFixed.push(box(.98,.035,.035,-2.17,y,terraceZ+.05,whiteMetal,false));
const slider=new THREE.Group();slider.position.set(-2.18,0,terraceZ-.03);scene.add(slider);
const slidingMeshes=[];
function slidingPart(w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);slider.add(mesh);slidingMeshes.push(mesh)}
slidingPart(.94,1.98,.025,0,1,0,glass);
for(const x of [-.47,.47])slidingPart(.035,2.04,.035,x,1.02,0,whiteMetal);
for(const y of [.03,2.04])slidingPart(.98,.035,.035,0,y,0,whiteMetal);
slidingPart(.025,.22,.055,.39,1.05,.05,darkMetal);
obstacles.push({x1:-2.7,x2:-1.68,z1:terraceZ-.09,z2:terraceZ+.1});
const slidingDoor=registerDoor('Porta de correr da sala',[...sliderFixed,...slidingMeshes],[{object:slider,openX:-2.18,closedX:-1.17}],{x1:-1.7,x2:-.65,z1:terraceZ-.11,z2:terraceZ+.1});
// Room doors have a white leaf and the brown jamb visible in the walk-through.
const doorBrown=mat('#845637',.72),doorDetail=mat('#70472e',.74),handle=mat('#aab0ac',.34,.6);
function doorLeafX(x,z,w,swing,material=doorBrown){
 const pivot=new THREE.Group();pivot.position.set(x,0,z);pivot.rotation.y=swing;scene.add(pivot);
 const meshes=[];
 const part=(pw,ph,pd,px,py,pz,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(pw,ph,pd),m);mesh.position.set(px,py,pz);mesh.castShadow=true;pivot.add(mesh);meshes.push(mesh)};
 part(w-.045,2.02,.035,w/2,1.01,0,material);
 for(const y of [.3,1.65])part(w-.14,.012,.006,w/2,y,.022,material===doorBrown?doorDetail:whiteMetal);
 part(.065,.025,.08,w-.13,1.01,.065,handle);
 return {pivot,meshes,swing,zone:{x1:x-.04,x2:x+w+.04,z1:z-.11,z2:z+.11}};
}
function doorLeafZ(x,z,w,swing,material=doorBrown){
 const pivot=new THREE.Group();pivot.position.set(x,0,z);pivot.rotation.y=swing;scene.add(pivot);
 const meshes=[];
 const part=(pw,ph,pd,px,py,pz,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(pw,ph,pd),m);mesh.position.set(px,py,pz);mesh.castShadow=true;pivot.add(mesh);meshes.push(mesh)};
 part(.035,2.02,w-.045,0,1.01,w/2,material);
 for(const y of [.3,1.65])part(.006,.012,w-.14,.022,y,w/2,material===doorBrown?doorDetail:whiteMetal);
 part(.08,.025,.065,.065,1.01,w-.13,handle);
 return {pivot,meshes,swing,zone:{x1:x-.11,x2:x+.11,z1:z-.04,z2:z+w+.04}};
}
function hinged(name,door){return registerDoor(name,door.meshes,[{object:door.pivot,openAngle:door.swing}],door.zone)}
hinged('Porta do quarto 1',doorLeafX(.65,room1Z,.71,-1.19));
hinged('Porta do quarto 2',doorLeafZ(room2X,-.02,.8,1.16));
hinged('Porta do banheiro',doorLeafZ(splitX,-1.95,.77,-1.14));
hinged('Porta da área de serviço',doorLeafZ(splitX,-3.55,.8,-1.14,whiteMetal));
hinged('Porta dos fundos',doorLeafX(-2.7,back,1.1,1.15,whiteMetal));
// Fixtures remain schematic; their room placement matches the new plan.
const wetWall=mat('#d5d4ce');
box(2.3,1.45,.018,1.55,1.07,back+.09,wetWall,false);
box(1.1,.07,.6,1.65,.88,-3.87,mat('#777a78'),false);
box(.4,.12,.28,1.65,.94,-3.85,whiteMetal,false);
box(.045,.32,.045,1.65,1.1,-3.92,whiteMetal,false);
box(.72,.45,.45,-2.4,.55,-1.55,whiteMetal,false);
box(.45,.15,.4,-2.4,.37,-1.55,whiteMetal,false);
box(.6,.42,.18,-1.0,.82,-2.2,whiteMetal,false);
box(.5,.07,.31,-1.0,1.04,-2.2,whiteMetal,false);
box(.8,.08,.5,-2.35,.86,-3.76,concrete,false);
windowX(-1.85,back-.09,.55,.35,2.18);
// Roof: a shallow sloping rendered volume, hidden in aerial and walking views.
const roof=new THREE.Group();scene.add(roof);const roofGeom=new THREE.BoxGeometry(6.67,.12,8.73);const roofMesh=new THREE.Mesh(roofGeom,mat('#a5a497'));roofMesh.position.set(0,2.98,0);roofMesh.rotation.z=-.045;roofMesh.castShadow=true;roofMesh.receiveShadow=true;roof.add(roofMesh);const fascia=box(6.7,.12,.08,0,2.99,4.39,mat('#9d9a8e'));roof.add(fascia);
// Labels sit on the approximate floor plan only during the overhead view.
const aerialLabels=new THREE.Group();scene.add(aerialLabels);
for(const [name,x,z] of [['SALA',-.9,.7],['TERRAÇO',-1.62,3.58],['QUARTO 1',1.68,2.98],['QUARTO 2',2.23,.42],['BANHEIRO',-1.62,-1.67],['COZINHA',1.57,-2.55],['SERVIÇO',-1.62,-3.34]]){
 const canvas=document.createElement('canvas');canvas.width=384;canvas.height=96;const c=canvas.getContext('2d');c.fillStyle='#f6f5ed';c.fillRect(0,0,384,96);c.fillStyle='#254a39';c.font='700 40px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(name,192,48);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const labelMesh=new THREE.Mesh(new THREE.PlaneGeometry(1.45,.36),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));labelMesh.rotation.x=-Math.PI/2;labelMesh.position.set(x,.09,z);aerialLabels.add(labelMesh)
}
// Soft context: neighbouring low volumes avoid a floating diorama.
for(const x of [-10.6,10.9]){box(5.2,2.6,8.6,x,1.2,-1.4,mat('#d5d0c2'));box(5.4,.13,8.8,x,2.56,-1.4,concrete)}
const visit=[['Fachada',[-.2,1.65,9.0],0],['Terraço',[-1.2,1.62,3.64],0],['Sala',[-1.2,1.62,1.2],-.55],['Quarto 1',[1.6,1.62,3.0],0],['Quarto 2',[2.2,1.62,.45],0],['Cozinha',[1.6,1.62,-2.45],Math.PI],['Banheiro',[-1.65,1.62,-1.65],Math.PI/2],['Serviço',[-1.65,1.62,-3.35],0],['Jardim',[4.15,1.62,-.7],Math.PI/2]];
const rooms=document.querySelector('#rooms');visit.slice(1).forEach(([name],i)=>{const b=document.createElement('button');b.className='room';b.textContent=name;b.onclick=()=>go(i+1);rooms.append(b)});
let mode='aerial',yaw=0,pitch=0,roofVisible=false,pressed=new Set(),drag=false,lastX=0,lastY=0;
const label=document.querySelector('#scene-label');
function setMode(next){mode=next;aerialLabels.visible=mode==='aerial';document.querySelectorAll('.bottom button').forEach(b=>b.classList.toggle('active',b.id===next));orbit.enabled=mode!=='walk';roof.visible=mode==='outside'&&roofVisible;document.body.classList.toggle('is-walking',mode==='walk');document.querySelector('#roof').textContent=roof.visible?'Ocultar teto':'Mostrar teto';document.querySelector('#roof').hidden=mode==='walk';document.querySelector('#joy').style.display=mode==='walk'&&matchMedia('(pointer:coarse)').matches?'grid':'none';document.querySelector('#help').innerHTML=mode==='walk'?'WASD / setas: andar · arraste: olhar<br>Q / E: girar · escolha ambientes à esquerda':'Arraste para girar · role para aproximar<br>Selecione um ambiente para entrar'}
function go(i){const [name,pos,angle]=visit[i];setMode(i===0?'outside':'walk');label.textContent=name;if(i===0){camera.position.set(7.5,5.2,10.8);orbit.target.set(0,1,0);orbit.update()}else{camera.position.set(...pos);yaw=angle;pitch=0;camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);document.querySelectorAll('.room').forEach((b,j)=>b.classList.toggle('active',j===i-1));closePanel()}}
function safeMove(dx,dz){let x=camera.position.x+dx,z=camera.position.z+dz;const blocked=(a,b)=>obstacles.some(o=>o.active!==false&&a+.2>o.x1&&a-.2<o.x2&&b+.2>o.z1&&b-.2<o.z2);if(!blocked(x,camera.position.z))camera.position.x=x;if(!blocked(camera.position.x,z))camera.position.z=z;camera.position.x=THREE.MathUtils.clamp(camera.position.x,-10,10);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-10,11)}
function walk(dt){let f=(pressed.has('w')||pressed.has('arrowup')?1:0)-(pressed.has('s')||pressed.has('arrowdown')?1:0),r=(pressed.has('d')||pressed.has('arrowright')?1:0)-(pressed.has('a')||pressed.has('arrowleft')?1:0);if(pressed.has('q'))yaw+=dt*1.6;if(pressed.has('e'))yaw-=dt*1.6;if(f||r){let len=Math.hypot(f,r),speed=2.3*dt;safeMove((-Math.sin(yaw)*f+Math.cos(yaw)*r)/len*speed,(-Math.cos(yaw)*f-Math.sin(yaw)*r)/len*speed)}camera.position.y=1.62;camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0)}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),doorTip=document.querySelector('#door-tip');
let pointerStart=null,tipTimer;
function pickDoor(clientX,clientY){
 const rect=renderer.domElement.getBoundingClientRect();
 pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(pointer,camera);
 const hit=raycaster.intersectObjects(doorMeshes,false).find(({distance})=>mode!=='walk'||distance<3.3);
 return hit?.object.userData.door;
}
function announce(message){doorTip.textContent=message;clearTimeout(tipTimer);tipTimer=setTimeout(()=>{doorTip.textContent='Toque nas portas e grades para abrir ou fechar'},3200)}
function toggleDoor(item){
 if(item.open){const {x1,x2,z1,z2}=item.closedZone;if(mode==='walk'&&camera.position.x>x1-.25&&camera.position.x<x2+.25&&camera.position.z>z1-.25&&camera.position.z<z2+.25){announce('Afaste-se um pouco para fechar '+item.name.toLowerCase());return}}
 item.open=!item.open;item.closedZone.active=!item.open;
 announce(item.name+(item.open?' aberta':' fechada'));
}
renderer.domElement.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 pointerStart={x:e.clientX,y:e.clientY,id:e.pointerId};
 if(mode==='walk'){drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)}
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(drag&&mode==='walk'){yaw-=(e.clientX-lastX)*.004;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-lastY)*.0035,-1.25,1.25);lastX=e.clientX;lastY=e.clientY}
 if(e.pointerType==='mouse'&&!drag)renderer.domElement.style.cursor=pickDoor(e.clientX,e.clientY)?'pointer':'';
});
renderer.domElement.addEventListener('pointerup',e=>{
 if(pointerStart?.id===e.pointerId&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<9){const item=pickDoor(e.clientX,e.clientY);if(item)toggleDoor(item)}
 pointerStart=null;drag=false;
});
for(const event of ['pointercancel','lostpointercapture'])renderer.domElement.addEventListener(event,()=>{pointerStart=null;drag=false});
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();pressed.add(e.key.toLowerCase())});addEventListener('keyup',e=>pressed.delete(e.key.toLowerCase()));addEventListener('blur',()=>pressed.clear());document.querySelectorAll('#joy button').forEach(b=>{const map={forward:'w',back:'s',left:'a',right:'d'},k=map[b.dataset.dir];b.addEventListener('pointerdown',e=>{e.preventDefault();pressed.add(k);b.setPointerCapture(e.pointerId)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>pressed.delete(k))});
document.querySelector('#outside').onclick=()=>go(0);function showAerial(){setMode('aerial');camera.position.set(0,Math.max(9.2,6.8/camera.aspect),.02);orbit.target.set(0,0,0);orbit.update();label.textContent='Vista superior';closePanel();document.querySelectorAll('.room').forEach(b=>b.classList.remove('active'))}document.querySelector('#aerial').onclick=showAerial;document.querySelector('#walk').onclick=()=>go(2);document.querySelector('#reset').onclick=()=>mode==='outside'?go(0):mode==='walk'?go(2):showAerial();document.querySelector('#roof').onclick=()=>{if(roof.visible){roofVisible=false;roof.visible=false;document.querySelector('#roof').textContent='Mostrar teto'}else{roofVisible=true;go(0);roof.visible=true;document.querySelector('#roof').textContent='Ocultar teto'}};
addEventListener('resize',()=>{camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix();renderer.setSize(viewer.clientWidth,viewer.clientHeight);if(mode==='aerial'){camera.position.y=Math.max(9.2,6.8/camera.aspect);orbit.update()}});
const planDialog=document.querySelector('#plan-dialog');document.querySelector('#plan-open').onclick=()=>planDialog.showModal();document.querySelector('#plan-close').onclick=()=>planDialog.close();planDialog.onclick=e=>{if(e.target===planDialog)planDialog.close()};const panel=document.querySelector('#panel'),toggle=document.querySelector('#rooms-toggle');function closePanel(){panel.classList.remove('open');toggle.setAttribute('aria-expanded','false')}toggle.onclick=()=>{const open=panel.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))};showAerial();const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);for(const item of interactive)for(const part of item.movingParts){if(part.openAngle!==undefined)part.object.rotation.y=THREE.MathUtils.damp(part.object.rotation.y,item.open?part.openAngle:0,10,dt);else part.object.position.x=THREE.MathUtils.damp(part.object.position.x,item.open?part.openX:part.closedX,9,dt)}if(mode==='walk')walk(dt);else orbit.update();renderer.render(scene,camera)}animate();document.querySelector('.loading').classList.add('hidden');

} catch (error) { console.error('Falha ao iniciar o passeio 3D:',error); viewer.innerHTML=`<section class="unsupported"><img src="${import.meta.env.BASE_URL}fachada.jpg" alt="Fachada real da casa C8"><div><h1>O passeio 3D não iniciou neste navegador.</h1><p>Ative a aceleração gráfica do navegador ou abra o site em outro dispositivo com WebGL. Enquanto isso, veja a fotografia da fachada.</p><a href="${import.meta.env.BASE_URL}lateral.jpg">Ver a lateral da casa</a><a href="${import.meta.env.BASE_URL}planta-original.png">Ver a planta enviada</a></div></section>`; }
