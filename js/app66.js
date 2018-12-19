/*
 *   Virtual Speaker System for Chrome Android (VSP)
 */						

var src, source, splitter, audio, fname, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl,mf;
 vol = 0.7; ctlvol = 0.6; cv = 1.0; rv =0.25; cf = 0;   //***

var touchSX,touchSY, touchEX,touchEY, touchDX, touchDY, diffSX, diffEX, el,ctx;

var AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioCtx; 

var gainL,gainBL,gainR,gainBR,delaySL,delaySR;
var pannerL,pannerR,pannerBL,pannerBR,listener;  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var bassL,trebleL,trebleBL,bassR,trebleR,trebleBR;

function initCtx() {

audioCtx = new AudioContext(); //{ latencyHint: 'playback' }
 splitter = audioCtx.createChannelSplitter(2);
 listener = audioCtx.listener;

xv = 4.0; yv = 2.0; zv = -8.0;  tv = 0.0; bv = 0.0; 

 pannerL  = audioCtx.createPanner(); 
    pannerL.panningModel = 'HRTF';  pannerL.distanceModel = 'linear'; pannerL.setOrientation(0,0,1); pannerL.maxDistance = 1000;
 pannerR  = audioCtx.createPanner(); 
    pannerR.panningModel = 'HRTF';  pannerR.distanceModel = 'linear'; pannerR.setOrientation(0,0,1); pannerR.maxDistance = 1000;
 pannerBL = audioCtx.createPanner(); pannerBL.refDistance = 1;
    pannerBL.panningModel = 'HRTF'; pannerBL.distanceModel = 'linear'; pannerBL.setOrientation(0,0,1);pannerBL.maxDistance = 100;
 pannerBR = audioCtx.createPanner(); pannerBR.refDistance = 1;
    pannerBR.panningModel = 'HRTF'; pannerBR.distanceModel = 'linear'; pannerBR.setOrientation(0,0,1);pannerBR.maxDistance = 100;

 bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf';  bassL.Q.automationRate='k-rate';
  bassL.frequency.setValueAtTime(100, 0); 
  bassL.gain.value = 0; //bassL.gain.setValueAtTime(bv, 0);				// -40db...40db
 trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleL.frequency.setValueAtTime(10000, 0);
  trebleL.gain.setValueAtTime(tv, 0);
 trebleBL = audioCtx.createBiquadFilter(); trebleBL.type   = 'highshelf';
  trebleBL.frequency.setValueAtTime(18000, 0);
  trebleBL.gain.setValueAtTime(tv, 20);

 bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';  bassR.Q.automationRate='k-rate';
  bassR.frequency.setValueAtTime(100, 0);
  bassR.gain.value = 0; //bassR.gain.setValueAtTime(bv, 0);
 trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';  trebleR.Q.automationRate='k-rate';
  trebleR.frequency.setValueAtTime(10000, 0);
  trebleR.gain.setValueAtTime(tv, 0);
 trebleBR = audioCtx.createBiquadFilter(); trebleBR.type   = 'highshelf';
  trebleBR.frequency.setValueAtTime(18000, 0);
  trebleBR.gain.setValueAtTime(tv, 20);

gainBL = audioCtx.createGain(); gainBL.gain.value = rv;  	gainBL.gain.automationRate='k-rate';
gainBR = audioCtx.createGain(); gainBR.gain.value = rv; 	gainBR.gain.automationRate='k-rate';
delaySL = audioCtx.createDelay(); delaySL.delayTime.value=0.04*(-zv/6); delaySL.delayTime.automationRate='k-rate';
delaySR = audioCtx.createDelay(); delaySR.delayTime.value=0.04*(-zv/6); delaySR.delayTime.automationRate='k-rate';

audio = new Audio(src); audio.controls = true; audio.volume=vol;	
audio.crossOrigin = "anonymous";				// +++ for chrome71 CORS access ++++
  document.body.appendChild(audio); 
  source = audioCtx.createMediaElementSource(audio); 
 //setPos(xv,yv,zv);

 audio.addEventListener('ended', savefxyz,false);
 audio.addEventListener('pause', savefxyz,false);
 audio.addEventListener('volumechange', function() { vol=audio.volume; },false); 
}

var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0;	
	
var wX = 400;
var wY = 400;   
var meshL,meshR,cubeL, cubeR;
 
function ini() {

  loadxyz();
   window.onbeforeunload = function() { savexyz(); alert("beforunload");}
  //initCtx();
  initgls(); setPos(xv,yv,zv); //movsp();

  document.querySelector("#input").addEventListener("change",   function () { handleFiles(); } );
  document.querySelector("#loop").addEventListener("click",  function () { chkLoop(); } );

  document.querySelector("#xv").addEventListener("change",
        function () { changeXV(document.querySelector("#xv").value); });
 document.querySelector("#yv").addEventListener("change",
        function () { changeYV(document.querySelector("#yv").value); });
 document.querySelector("#zv").addEventListener("change",
        function () { changeZV(document.querySelector("#zv").value); });

  document.querySelector("#bass").addEventListener("change",
        function () { changeBass(document.querySelector("#bass").value); });
  document.querySelector("#treble").addEventListener("change",
        function () { changeTreble(document.querySelector("#treble").value); });
 
}

function loadfxyz() {
  var fxyz=Array();
 	fxyz = JSON.parse(localStorage.getItem(fname));
	if (fxyz) {
	 xv = parseFloat(fxyz[0]); yv = parseFloat(fxyz[1]); zv = parseFloat(fxyz[2]);
		document.getElementById("xValue").innerHTML="pos_x = "+ xv;
   		document.querySelector("#xv").value = xv;
		document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    		document.querySelector("#yv").value = yv;
		document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    		document.querySelector("#zv").value = zv; 
	 vol = parseFloat(fxyz[3]); bv = parseFloat(fxyz[4]); tv = parseFloat(fxyz[5]);
	}
}
function savefxyz() { 
  var fxyz=Array();
	fxyz[0]=String(xv).substr(0, 5); fxyz[1]=String(yv).substr(0, 5); fxyz[2]=String(zv).substr(0, 5);
	fxyz[3]=String(vol).substr(0, 5); fxyz[4]=String(bv).substr(0, 5); fxyz[5]=String(tv).substr(0, 5);
	localStorage.setItem(fname, JSON.stringify(fxyz));	
}

function loadxyz() { 
	sxv = localStorage.getItem("vspx"); if (sxv) { xv = parseFloat(sxv);};
		document.getElementById("xValue").innerHTML="pos_x = "+ xv;
   		document.querySelector("#xv").value = xv;
	syv = localStorage.getItem("vspy"); if (syv) { yv = parseFloat(syv);}; 
		document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    		document.querySelector("#yv").value = yv;		
	szv = localStorage.getItem("vspz"); if (szv) { zv = parseFloat(szv);};
		document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    		document.querySelector("#zv").value = zv; 
};
	
function savexyz() {  
	localStorage.setItem("vspx",xv.toString()); 
	localStorage.setItem("vspy",yv.toString()); 
	localStorage.setItem("vspz",zv.toString()); 
};

var lp = false;
function chkLoop() { 
if ( document.getElementById('loop').checked ) { lp = true;  }
 else { lp = false;}
}

function movsp() { 
 var xv2;
  xv2 = xv*2;
  cubeL.position.setX(-xv2); cubeL.position.setY(yv); cubeL.position.setZ(zv); //changeXV(xv);
  cubeR.position.setX(xv2);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv); cubeR.rotation.x=Math.atan(-yv/zv);
    cubeL.rotation.y=Math.atan(-xv2/zv); cubeR.rotation.y=Math.atan( xv2/zv); 
 renderer.render( scene, camera ); 
chkLoop();   
}

function startPlay() {  			 
     setPos( xv, yv, zv ); changeBass(bv); changeTreble(tv); //audio.volume=vol;
     playGain(); 
} 
   
function handleFiles() { 
 if (!fname) { initCtx();}	//!!!!!!!!!!!!!!!!!!!
fc = 0; movsp();

var fileInput = document.getElementById("input");
flen = fileInput.files.length;
  if (flen>0) {loadsrc(flen);}
}

function loadnext() {
 fc = fc + 1; 
   if (fc<flen) {loadsrc();}  
   else { fc = 0; 
	if (lp === true) {loadsrc(flen);}
   } 
}

function loadsrc() {	//initCtx();			//*************************************************
    src = URL.createObjectURL(document.getElementsByTagName('input')[6].files[fc]); //console.log(src);
    fname = document.getElementsByTagName('input')[6].files[fc].name; 

	loadfxyz();
    showMetaData(document.getElementsByTagName('input')[6].files[fc]);
    //initCtx();							
    audio.src=src;	audio.autoplay = true;
  
    audio.addEventListener('loadeddata', function() {
      //showMetaData(document.getElementsByTagName('input')[6].files[fc]);
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
      }
    startPlay();
   }, false);

}

function playGain() {
  source.connect(splitter); 

  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(audioCtx.destination); 
  splitter.connect(gainBL,0).connect(pannerBL).connect(trebleBL).connect(delaySL).connect(audioCtx.destination);

  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(audioCtx.destination); 
  splitter.connect(gainBR,1).connect(pannerBR).connect(trebleBR).connect(delaySR).connect(audioCtx.destination);
   
 audio.play();
}

function defpos() {
 xv=4; yv=2; zv=-8; setPos(xv,yv,zv); 
 document.getElementById("xValue").innerHTML="pos_x = "+ xv;
  document.querySelector("#xv").value = xv;
 document.getElementById("yValue").innerHTML="pos_y = "+ yv;
  document.querySelector("#yv").value = yv;
 document.getElementById("zValue").innerHTML="pos_z = "+ zv;
  document.querySelector("#zv").value = zv;
}

function setPos(x,y,z) { 
 if (fname) {
  pannerL.setPosition( -x, y, z); pannerBL.setPosition(-x, y, z*2);   
  pannerR.setPosition(  x, y, z); pannerBR.setPosition( x, y, z*2);  
 }
 movsp();    
 
}

function changeBass(bvalue) {
  if (fname) {
	bassL.gain.setValueAtTime(bvalue,audioCtx.currentTime); 
	bassR.gain.setValueAtTime(bvalue,audioCtx.currentTime);
  } 
  bv = bvalue; 
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    document.querySelector("#bass").value = bvalue;
}
function changeTreble(tvalue) {
  if (fname) {
  	trebleL.gain.setValueAtTime(tvalue,audioCtx.currentTime); 
  	trebleR.gain.setValueAtTime(tvalue,audioCtx.currentTime); 
  }
  tv = tvalue; 
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    document.querySelector("#treble").value = tvalue;
}

function changeXV(x) {
  xv = x; 
    document.getElementById("xValue").innerHTML="pos_x = "+ xv;
    document.querySelector("#xv").value = xv;
 setPos( xv, yv, zv );
}
function changeYV(y) {
  yv = y; 
    document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    document.querySelector("#yv").value = yv;
 setPos( xv, yv, zv );
}
function changeZV(z) {
  zv = z; 
    document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    document.querySelector("#zv").value = zv;
	delaySL.delayTime.value=0.04*(-zv/6);
	//delaySR.delayTime.value=0.04*(-zv/6); //console.log(0.04*(-zv/6));
 setPos( xv, yv, zv );
}

function incXV() { xv = Math.round(xv*10 + 2)/10; setPos( xv, yv, zv ); document.getElementById("xValue").innerHTML="pos_x = "+ xv;}
function decXV() { xv = Math.round(xv*10 - 2)/10; setPos( xv, yv, zv ); document.getElementById("xValue").innerHTML="pos_x = "+ xv;}
function incYV() { yv = Math.round(yv*10 + 2)/10; setPos( xv, yv, zv ); document.getElementById("yValue").innerHTML="pos_y = "+ yv;}
function decYV() { yv = Math.round(yv*10 - 2)/10; setPos( xv, yv, zv ); document.getElementById("yValue").innerHTML="pos_y = "+ yv;}
function incZV() { zv = Math.round(zv*10 + 2)/10; setPos( xv, yv, zv ); document.getElementById("zValue").innerHTML="pos_z = "+ zv;}
function decZV() { zv = Math.round(zv*10 - 2)/10; setPos( xv, yv, zv ); document.getElementById("zValue").innerHTML="pos_z = "+ zv;}

//------------------------- init gl ------------------------------------
function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true, antialias: true }); //******
renderer.setSize (wX,wY);    
renderer.setClearColor(0x3333cc, 0.1); //*****
         
camera = new THREE.PerspectiveCamera (90, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=5;   
camera.lookAt( {x:0, y:4.2, z:0 } ); 
      
scene = new THREE.Scene(); scene.add(camera);  //scene.background = new THREE.Color( 0xff0000 );
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);         
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
Sphere0 = new THREE.Mesh (geometry_sph, material0);     
Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; Sphere0.castShadow = true;     
scene.add( Sphere0 );

var geometry_cube = new THREE.BoxGeometry (2, 3, 1.5);
        
     var br = new THREE.MeshLambertMaterial({color: 0x886600});
     var gr = new THREE.MeshLambertMaterial({color: 0x333333});
     var materials = [ br, br, br, br, gr, br ];
   
       //var material_cube = new THREE.MeshFaceMaterial(materials);
         cubeL = new THREE.Mesh (geometry_cube, materials);	//cubeL.name="cubeL";console.log(cubeL.uuid);	//material_cube
	//cubeL = new THREE.Mesh (geometry_cube, [ br, br, br, br, gr, br ]);
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
		cubeL.rotation.order = "ZYX";          
         cubeL.castShadow = true; 
	scene.add( cubeL ); 
         cubeR = new THREE.Mesh (geometry_cube, materials);	//cubeR.name="cubeR"	//material_cube
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv);
		cubeR.rotation.order = "ZYX";          
         cubeR.castShadow = true; 
        scene.add( cubeR ); 
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadow.mapSize.width = 4096; light0.shadow.mapSize.height = 4096;
  scene.add( light0 );
 
   var gm = new THREE.PlaneBufferGeometry(90, 120, 10, 10);
    plane = new THREE.Mesh( gm,
        new THREE.MeshLambertMaterial({
            color: 0x9999ee, transparent: true, opacity: 0.7
        })
    );
    plane.position.y = 0; plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 

 //el = document.getElementById("tCanvas");

} // -- end of initgl --
//------------ metedata --------------------------
var material,picture,texture,planea,image,img,picdata;

function showMetaData(data) { //console.log(fname);
	image = document.getElementById('myimg');
      musicmetadata(data, function (err, result) {
       
	//image = document.getElementById('myimg');

        if (result.picture.length > 0) { image.style.visibility = 'visible';
          picture = result.picture[0]; 		//console.log(result.title,result.year);
          var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
	document.getElementById("centered").innerHTML=''; 
          image.src = url; image.width=178; image.height=178;	

        }
        else { image.style.visibility = 'hidden';
	document.getElementById("centered").innerHTML=result.title+"<br>"+result.artist[0];  } 
      });
    }
// ---------------- draw art ------------------
function drawArt() {
var texture = new THREE.TextureLoader().load(image.src,
(tex) => { // ì«Ç›çûÇ›äÆóπéû
    
    const w = 32;//tex.image.width; 
    const h = 32;//tex.image.height/(tex.image.width/w); //console.log(w,h);

    // ïΩñ 
    //const geometry = new THREE.PlaneGeometry(1, 1);

     const geometry = new THREE.TextGeometry( 'Hello three.js!',{height: 16} );

    const material = new THREE.MeshPhongMaterial( { map:texture } );
    const plane = new THREE.Mesh( geometry, material );
    plane.scale.set(w, h, 1); plane.position.z=-30; plane.position.y = 10; //plane.rotation.x = -Math.PI / 2;
    scene.add( plane ); renderer.render( scene, camera ); 
}); //renderer.render( scene, camera ); 
}