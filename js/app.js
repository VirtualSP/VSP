/*
 *   Virtual Speaker System for Chrome Android (VSP)
 */						

var src, source, splitter, audio, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl,mf;
 vol = 0.6; ctlvol = 0.5; cv = 1.0; rv =-0.4; cf = 0;   //***
var obj= {};

var touchSX,touchSY, touchEX,touchEY, touchDX, touchDY, diffSX, diffEX, el,ctx;

var AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioCtx = new AudioContext();

var gainL = audioCtx.createGain();
 var gainBL = audioCtx.createGain();
var gainR = audioCtx.createGain();
 var gainBR = audioCtx.createGain();
gainL.gain.setValueAtTime(vol, 0); gainBL.gain.setValueAtTime(rv, 0);
gainR.gain.setValueAtTime(vol, 0); gainBR.gain.setValueAtTime(rv, 0);

splitter = audioCtx.createChannelSplitter(2);

xv = 6.0; yv = 2.0; zv = -6.0; rv = 0.0; tv = 0; bv = 0; gl=0;
/*--------------------------------------------------------------------
function Panner() {
	panningModel = 'HRTF';
 	distanceModel = 'linear';
 	refDistance = 1;
 	maxDistance = 1000;
 	rolloffFactor = 1;
 	coneInnerAngle = 360; //120;
 	coneOuterAngle = 360; // 180;
 	coneOuterGain = 0;
 	
	this.setOrientation = function(x,y,z) { this.setOrientation(x,y,z); }
}
*/
var pannerL  = audioCtx.createPanner(); 
    pannerL.panningModel = 'HRTF'; pannerL.distanceModel = 'linear'; pannerL.setOrientation(0,0,1); pannerL.maxDistance = 1000;
var pannerR  = audioCtx.createPanner(); 
    pannerR.panningModel = 'HRTF'; pannerR.distanceModel = 'linear'; pannerR.setOrientation(0,0,1); pannerR.maxDistance = 1000;
var pannerBL = audioCtx.createPanner(); 
    pannerBL.panningModel = 'HRTF'; pannerBL.distanceModel = 'linear'; pannerBL.setOrientation(0,0,1);pannerBL.maxDistance = 1000;
var pannerBR = audioCtx.createPanner();
    pannerBR.panningModel = 'HRTF'; pannerBR.distanceModel = 'linear'; pannerBR.setOrientation(0,0,1);pannerBR.maxDistance = 1000;
//var pannerSL = audioCtx.createPanner();
//var pannerSR = audioCtx.createPanner();

var delaySL = audioCtx.createDelay(); delaySL.delayTime.setValueAtTime(0.01, 0);
var delaySR = audioCtx.createDelay(); delaySR.delayTime.setValueAtTime(0.01, 0);
//----------------------------------------------------------------------

var listener = audioCtx.Spationallistener; 

var bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf';
 bassL.frequency.setValueAtTime(100, 0); 
 bassL.gain.setValueAtTime(rv, 0);
var trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';
 trebleL.frequency.setValueAtTime(12000, 0);
 trebleL.gain.setValueAtTime(20, 0);

var bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';
 bassR.frequency.setValueAtTime(100, 0);
 bassR.gain.setValueAtTime(rv, 0);
var trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';
 trebleR.frequency.setValueAtTime(12000, 0);
 trebleR.gain.setValueAtTime(20, 0);


var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0;	
	
var wX = 400;
var wY = 400;   
var meshL,meshR,cubeL, cubeR;
 
function ini() {
  audio = new Audio(src); audio.controls = true; document.body.appendChild(audio); 
  source = audioCtx.createMediaElementSource(audio);

  loadxyz();
   window.onbeforeunload = function() { savexyz();}
  initgls(); //movsp();

  document.querySelector("#input").addEventListener("change",
        function () { handleFiles(); } );
  document.querySelector("#loop").addEventListener("click",
	function () { chkLoop(); } );
  

  //document.querySelector("#rSp").addEventListener("change",
  //      function () { changeVolRear(document.querySelector("#rSp").value); });
  document.querySelector("#bass").addEventListener("change",
        function () { changeBass(document.querySelector("#bass").value); });
  document.querySelector("#treble").addEventListener("change",
        function () { changeTreble(document.querySelector("#treble").value); });
 
}

function loadxyz() { 
	sxv = localStorage.getItem("vspx"); if (sxv) { xv = parseFloat(sxv);};
	syv = localStorage.getItem("vspy"); if (syv) { yv = parseFloat(syv);};
	szv = localStorage.getItem("vspz"); if (szv) { zv = parseFloat(szv);};
};	
function savexyz() {  
	localStorage.setItem("vspx",xv.toString()); 
	localStorage.setItem("vspy",yv.toString()); 
	localStorage.setItem("vspz",zv.toString()); 
};

var lp = false;
function chkLoop() { 
//if (isMouseDown === false) {
// if ( document.getElementById('loop').innerHTML === "OFF" ) { 
//        document.getElementById('loop').innerHTML = "ON"; lp = true; }
// else { document.getElementById('loop').innerHTML = "OFF"; lp = false; }
//}
if ( document.getElementById('loop').checked ) { lp = true;  }
 else { lp = false;}
}

function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true }); //******
renderer.setSize (wX,wY);    
renderer.setClearColor(0x444477, 0.2); //*****
         
camera = new THREE.PerspectiveCamera (90, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=5;   
camera.lookAt( {x:0, y:4.2, z:0 } ); 
      
scene = new THREE.Scene(); scene.add(camera);  //scene.background = new THREE.Color( 0xff0000 );
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);         
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
Sphere0 = new THREE.Mesh (geometry_sph, material0);     
Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; Sphere0.castShadow = true;     
scene.add( Sphere0 );

var geometry_cube = new THREE.CubeGeometry (2, 3, 1.5);
     //var ambient = new THREE.AmbientLight(0x333333); scene.add(ambient);
        
     var br = new THREE.MeshLambertMaterial({color: 0x886600});
     var gr = new THREE.MeshLambertMaterial({color: 0x333333});
     var materials = [ br, br, br, br, gr, br ];
   
        //var material_cube = new THREE.Mesh(geometry_cube,materials);	//THREE.MeshFaceMaterial(materials);
         cubeL = new THREE.Mesh (geometry_cube, materials);		//material_cube
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
		cubeL.rotation.order = "ZYX";          
         cubeL.castShadow = true; 
	scene.add( cubeL ); 
         cubeR = new THREE.Mesh (geometry_cube, materials);		//material_cube
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv);
		cubeR.rotation.order = "ZYX";          
         cubeR.castShadow = true; 
        scene.add( cubeR ); 
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadow.mapSize.width = 2048; light0.shadow.mapSize.height = 2048;
  scene.add( light0 );
 
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 1, 1),
        new THREE.MeshLambertMaterial({
            color: 0xdddddd, transparent: true, opacity: 0.7
        })
    );
    plane.position.y = 0;
    plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 
    //document.getElementById("fn").innerHTML= "Drag/Swipe(xy) & Wheel/Pinch(z) to move Speakers";

    audio.autoplay = true; audio.volume = 0.9;
  setPos(xv,yv,zv); 
 gl=gl+1;

 el = document.getElementById("tCanvas");

//
 el.addEventListener("touchstart", handleStart, false);
	el.addEventListener("mousedown", handleStartm, false);
 el.addEventListener("touchmove", handleMove, false);
	el.addEventListener("wheel", handlewheelm,false);
	el.addEventListener("mousemove", handlMovem,false);
 el.addEventListener("touchend", handleEnd, false);
	el.addEventListener("mouseup", handleEndm, false);
//

} // -- end of initgl --


function movsp() { 
  cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv);
  cubeR.position.setX(xv);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv)/2; cubeR.rotation.x=Math.atan(-yv/zv)/2;
    cubeL.rotation.y=Math.atan(-xv/zv); cubeR.rotation.y=Math.atan(xv/zv); 
 renderer.render( scene, camera ); 
chkLoop();   
}

function startPlay() {  			 
        playGain(); setPos( xv, yv, zv ); 
} 
   
function handleFiles() { 
fc = 0; movsp();
//audio = new Audio(src);
var fileInput = document.getElementById("input");
flen = fileInput.files.length;
  if (flen>0) {loadsrc(flen);}
}

function loadnext() {
 fc = fc + 1; 
   if (fc<flen) {loadsrc();}  
   else { fc = 0; 
	if (lp === true) {loadsrc(flen);}
       //  loadsrc();	if (document.getElementById("roop").checked) {loadsrc();}
   } 
}

function loadsrc() {
 var fname;
    src = URL.createObjectURL(document.getElementsByTagName('input')[3].files[fc]); 
    fname = document.getElementsByTagName('input')[3].files[fc].name; 
    showMetaData(document.getElementsByTagName('input')[3].files[fc]);  // ********
	//tfile=fname;
						
    audio.src=src;	audio.autoplay = true;
  
    audio.addEventListener('loadeddata', function() {
      //document.getElementById("fn").innerHTML= (fc+1) +" of "+flen+" : "+fname;
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
        //audio.addEventListener('ended', function() { 
        //  fc = fc + 1; loadsrc();                                 
        //},false);
      //startPlay();
      }
    startPlay();
   }, false);

}


function playGain() {
  source.connect(splitter); 
  //splitter.connect(gainL, 0).connect(pannerL).connect(bassL).connect(trebleL).connect(audioCtx.destination);
  splitter.connect(gainL, 0).connect(pannerL).connect(bassL).connect(trebleL).connect(audioCtx.destination); //**
  splitter.connect(gainBL, 0).connect(pannerBL).connect(bassL).connect(trebleL).connect(delaySL).connect(audioCtx.destination);
    //splitter.connect(gainBL, 0).connect(pannerSL).connect(delaySL).connect(audioCtx.destination); 
      
  //splitter.connect(gainR, 0).connect(pannerR).connect(bassR).connect(trebleR).connect(audioCtx.destination);
  splitter.connect(gainR, 1).connect(pannerR).connect(bassR).connect(trebleR).connect(audioCtx.destination); //**
  splitter.connect(gainBR, 1).connect(pannerBR).connect(bassR).connect(trebleR).connect(delaySR).connect(audioCtx.destination);
    //splitter.connect(gainBR, 1).connect(pannerSR).connect(delaySR).connect(audioCtx.destination);  
   
 audio.play();
}

function defpos() {
 xv=6; yv=2; zv=-6; setPos(xv,yv,zv);
}

function setPos(x,y,z) { 
 pannerL.setPosition( -x, y*2, z*3); 
  pannerBL.setPosition(-x*0.8,y*2, -z*6); //pannerSL.setPosition(-x*4,y*2, 3*z/2); 
 pannerR.setPosition( x,y*2, z*3);  
  pannerBR.setPosition( x*0,8,y*2, -z*6); //pannerSR.setPosition( x*4,y*2, 3*z/2); 
 
 movsp();    
//audio.currentTime=audio.currentTime-0.1; 
}

function changeBass(bvalue) {
  bassL.gain.setValueAtTime(bvalue,0); bassR.gain.setValueAtTime(bvalue,0); 
  bv = bvalue;  //bv = bvalue*3 + 45;
  //bass.frequency.value   =  bv;
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    document.querySelector("#bass").value = bvalue;
}
function changeTreble(tvalue) {
  trebleL.gain.setValueAtTime(tvalue,0); trebleR.gain.setValueAtTime(tvalue,0); 
  tv = tvalue; tvv = -tvalue*500 + 12000;
  //treble.frequency.value   = tvv;
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    document.querySelector("#treble").value = tvalue;
}

// ---- swipe & pitch -----
var isMouseDown = false, needForRAF = true;

function handleStart(evt) { 
 mf = 1; isMouseDown = true; needForRAF = true;
  evt.preventDefault(); 
 switch ( evt.touches.length ) {
  case 1:
   touchDX = 0; touchDY = 0;
   touchSX = evt.touches[0].pageX-200; touchSY = evt.touches[0].pageY-200; break;
  case 2:
   diffSX = Math.abs( evt.touches[0].pageX - evt.touches[1].pageX ); break;
 }
}

function handleMove(evt) {
  evt.preventDefault();
if ( isMouseDown ) {
 switch ( evt.touches.length ) {
  case 1:
   touchEX = evt.touches[0].pageX-200; touchEY = evt.touches[0].pageY-200;
   if ( touchSX > 0) { 
	touchDX = (touchSX - touchEX)*(-zv)*0.0004;	// /500;
   } else {
	touchDX = -(touchSX - touchEX)*(-zv)*0.0004;	// /500;
   } 
   touchDY = (touchSY - touchEY)*(-zv)*0.0004;		// /500;
   xv = xv - touchDX;
   yv = yv + touchDY;	
   break;
  case 2:
   diffEX = Math.abs( evt.touches[0].pageX - evt.touches[1].pageX );
   if ( diffSX > diffEX ) { 
    zv = zv - 0.2;
   } else {
    zv = zv + 0.2;
   }   
   break;
 }
 if (needForRAF) {
    needForRAF = false;            
    requestAnimationFrame(update); 
  };
}
}

function handleEnd(evt) { needForRAF = false;
  evt.preventDefault(); isMouseDown = false;
}

//----- mouse -------

function handleStartm(evt) {
  evt.preventDefault(); isMouseDown = true; document.body.style.cursor = "move";
   touchDX = 0; touchDY = 0;
   touchSX = evt.pageX-200; touchSY = evt.pageY-200; 
}

function handlMovem(evt) { evt.preventDefault(); 
 
  if (isMouseDown) { 
   
  	touchEX = evt.pageX-200; touchEY = evt.pageY-200;
   	if ( touchSX > 0) {
	touchDX = (touchSX - touchEX)*(-zv)*0.0004;
   	} else {
	touchDX = -(touchSX - touchEX)*(-zv)*0.0004;
   	} 

   touchDY = (touchSY - touchEY)*(-zv)*0.0004;		// /800;
   xv = xv - touchDX; 
   yv = yv + touchDY;  

  if (needForRAF) {
    needForRAF = false;            
    requestAnimationFrame(update); 
  };
  }
}
function update() {
  needForRAF = true;
  setPos( xv, yv, zv );
}

function handlewheelm(evt) { evt.preventDefault(); //isMouseDown = true;
   zv = zv - evt.deltaY/120; 
  setPos( xv, yv, zv );
}

function handleEndm(evt) { evt.preventDefault(); 
 isMouseDown = false; document.body.style.cursor = "default"; //savexyz(); //mf = 0;
}

//------------ metedata --------------------------
var material,picture,texture,planea,image,img,picdata;

function showMetaData(data) {
      musicmetadata(data, function (err, result) {
       
	image = document.getElementById('myimg');

        if (result.picture.length > 0) { 
          picture = result.picture[0]; 
          var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
	 
          image.src = url; image.width=164; image.height=164;	

        }
        else {image.style.visibility = 'hidden';} 
      });
    }
