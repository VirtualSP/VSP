/*
 *   Virtual Speaker System for Chrome Android (VSP)
 */						

var src, source, splitter, audio, fname, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl,mf;
 vol = 0.5;   rv =0.3; cf = 0;   				//*** rv =0.4;  2020 Nov
 xv = 5.0; yv = 2.0; zv = -10.0;  tv = 0.5; bv = 0.0; 

//var touchSX,touchSY, touchEX,touchEY, touchDX, touchDY, diffSX, diffEX, el,ctx;

var AudioContext = window.AudioContext; // || window.webkitAudioContext; 
var audioCtx; 

var gainL,gainBL,gainR,gainBR,delaySL,delaySR, gainRL, gainRR, delayRL, delayRR, 	gainCL,gainCR,delayCL,delayCR;
var pannerL,pannerR,pannerBL,pannerBR,listener, pannerRL, pannerRR, 		pannerCL,pannerCR; 
var bassL,trebleL,trebleRL,bassR,trebleR,trebleRR;
var analyserL, analyserR, analyserLR, analyserRR, spectrumsL, spectrumsR; //spectrumsLR, spectrumsRR;
	var comp;

var canvasL,canvasR,canvasA, ctxL,ctxR,ctxA, animationId,renderA;
var anf = false;
//canvasA = document.getElementById("canvasA");
//  ctxA = canvasA.getContext("2d");

function initCtx() {

audioCtx = new AudioContext(); 
 splitter = audioCtx.createChannelSplitter(2);
 listener = audioCtx.listener;			
	comp = audioCtx.createDynamicsCompressor();

 pannerL  = audioCtx.createPanner(); pannerL.rolloffFactor = 0;	//equalpower
    pannerL.panningModel = 'HRTF';  pannerL.distanceModel = 'linear'; pannerL.setOrientation(0,0,1); pannerL.maxDistance = 10000;
 pannerR  = audioCtx.createPanner(); pannerR.rolloffFactor = 0;
    pannerR.panningModel = 'HRTF';  pannerR.distanceModel = 'linear'; pannerR.setOrientation(0,0,1); pannerR.maxDistance = 10000;

 pannerBL = audioCtx.createPanner(); pannerBL.refDistance = 0;
    pannerBL.panningModel = 'HRTF'; pannerBL.distanceModel = 'linear'; pannerBL.setOrientation(0,0,1);pannerBL.maxDistance = 10000;
 pannerBR = audioCtx.createPanner(); pannerBR.refDistance = 0;
    pannerBR.panningModel = 'HRTF'; pannerBR.distanceModel = 'linear'; pannerBR.setOrientation(0,0,1);pannerBR.maxDistance = 10000;

 pannerCL = audioCtx.createPanner(); pannerCL.refDistance = 0;
    pannerCL.panningModel = 'HRTF'; pannerCL.distanceModel = 'linear'; pannerCL.setOrientation(0,0,1);pannerCL.maxDistance = 10000;
 pannerCR = audioCtx.createPanner(); pannerCR.refDistance = 0;
    pannerCR.panningModel = 'HRTF'; pannerCR.distanceModel = 'linear'; pannerCR.setOrientation(0,0,1);pannerCR.maxDistance = 10000;

 pannerRL = audioCtx.createPanner();		pannerRL.refDistance = 0;
    pannerRL.panningModel = 'HRTF'; pannerRL.distanceModel = 'linear'; pannerRL.setOrientation(0,0,1);pannerRL.maxDistance = 10000;
 pannerRR = audioCtx.createPanner();		pannerRR.refDistance = 0;
    pannerRR.panningModel = 'HRTF'; pannerRR.distanceModel = 'linear'; pannerRR.setOrientation(0,0,1);pannerRR.maxDistance = 10000;

 bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf';  bassL.Q.automationRate='k-rate';
  bassL.frequency.setValueAtTime(60, 0); 
  bassL.gain.setValueAtTime(bv, 0);				// -40db...40db
 trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleL.frequency.setValueAtTime(11000, 0);
  trebleL.gain.setValueAtTime(tv, 0);

 trebleRL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleRL.frequency.setValueAtTime(12000, 0);
  trebleRL.gain.setValueAtTime(tv, 0);
// trebleBL = audioCtx.createBiquadFilter(); trebleBL.type   = 'highshelf';
//  trebleBL.frequency.setValueAtTime(18000, 0);
//  trebleBL.gain.setValueAtTime(tv, 0);

 bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';  bassR.Q.automationRate='k-rate';
  bassR.frequency.setValueAtTime(60, 0);
  bassR.gain.setValueAtTime(bv, 0);
 trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';  trebleR.Q.automationRate='k-rate';
  trebleR.frequency.setValueAtTime(11000, 0);
  trebleR.gain.setValueAtTime(tv, 0);

 trebleRR = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleRR.frequency.setValueAtTime(12000, 0);
  trebleRR.gain.setValueAtTime(tv, 0);			// -40..40
// trebleBR = audioCtx.createBiquadFilter(); trebleBR.type   = 'highshelf';
//  trebleBR.frequency.setValueAtTime(18000, 0);
//  trebleBR.gain.setValueAtTime(tv, 0);

gainBL = audioCtx.createGain(); gainBL.gain.value = -rv/2;  	// -/4 gainBL.gain.automationRate='k-rate';
gainBR = audioCtx.createGain(); gainBR.gain.value = -rv; 	// -/4 gainBR.gain.automationRate='k-rate';
gainCL = audioCtx.createGain(); gainCL.gain.value = -rv;  	// -/4 gainBL.gain.automationRate='k-rate';
gainCR = audioCtx.createGain(); gainCR.gain.value = -rv/2;

 gainRL = audioCtx.createGain(); gainRL.gain.value = rv;  	//gainBR.gain.automationRate='k-rate';
 gainRR = audioCtx.createGain(); gainRR.gain.value = rv; 	//gainBR.gain.automationRate='k-rate';

delayCL = audioCtx.createDelay(); delayCL.delayTime.value=0.001*(-zv/2); delayCL.delayTime.automationRate='k-rate';
delayCR = audioCtx.createDelay(); delayCR.delayTime.value=0.001*(-zv/4); delayCR.delayTime.automationRate='k-rate';
delayBL = audioCtx.createDelay(); delayBL.delayTime.value=0.001*(-zv/4); delayBL.delayTime.automationRate='k-rate'; 
delayBR = audioCtx.createDelay(); delayBR.delayTime.value=0.001*(-zv/2); delayBR.delayTime.automationRate='k-rate';

delayRL = audioCtx.createDelay(); delayRL.delayTime.value=0.001*(-zv); delayRL.delayTime.automationRate='k-rate';
delayRR = audioCtx.createDelay(); delayRR.delayTime.value=0.001*(-zv); delayRR.delayTime.automationRate='k-rate';

// --------------------------------------------------------------------------

analyserL = audioCtx.createAnalyser();	// analizer
  analyserL.fftSize = 512;
  analyserL.minDecibels = -100;  // Default -100 dB
  analyserL.maxDecibels =    -30;  // Default  -30 dB
analyserR = audioCtx.createAnalyser();	// analizer
  analyserR.fftSize = 512;
  analyserR.minDecibels = -100;  // Default -100 dB
  analyserR.maxDecibels =    -30;  // Default  -30 dB
var fsDivN = audioCtx.sampleRate / analyserL.fftSize; 
	//analyserLR = analyserL;analyserRR = analyserR; 
 spectrumsL = new Uint8Array(analyserL.frequencyBinCount); //mx=0; Float32
 spectrumsR = new Uint8Array(analyserR.frequencyBinCount);
 //spectrumsLR = new Uint8Array(analyserLR.frequencyBinCount); //mx=0;
 //spectrumsRR = new Uint8Array(analyserRR.frequencyBinCount);
len=analyserL.frequencyBinCount; 
	 
// --------------------------------------------------------------------------

audio = new Audio(src); audio.controls = true; audio.volume=vol;	audio.clientWidth=50;
audio.crossOrigin = "anonymous";			// +++ for chrome71- CORS access ++++
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

  //loadxyz(); 
  // window.onbeforeunload = function() { savexyz(); alert("beforunload");}
  //initCtx();
  initgls(); setPos(xv,yv,zv); //movsp();
// ------- Feb 2021 -------
const st='Deer Users, </br>Speaker coodinate system has chanded. (v1.9.9) Move speakers to your favorite position again if loaded old position.(VSP automatically saves speaker position when you chaged for each file.)'
document.getElementById("centered").innerHTML=st
// --------------------------
  document.querySelector("#input").addEventListener("change",   function () { handleFiles(); } );
  document.querySelector("#loop").addEventListener("click",  function () { chkLoop(); } );

  document.querySelector("#xv").addEventListener("change",
        function (e) { e.preventDefault(); changeXV(document.querySelector("#xv").value); });
 document.querySelector("#yv").addEventListener("change",
        function (e) { e.preventDefault(); changeYV(document.querySelector("#yv").value); });
 document.querySelector("#zv").addEventListener("change",
        function (e) { e.preventDefault(); changeZV(document.querySelector("#zv").value); });

  document.querySelector("#bass").addEventListener("change",
        function () { changeBass(document.querySelector("#bass").value); });
  document.querySelector("#treble").addEventListener("change",
        function () { changeTreble(document.querySelector("#treble").value); });
 
}

function loadfxyz() {
  var fxyz=Array();
  try {
 	fxyz = JSON.parse(localStorage.getItem(fname));
	if (fxyz) {
	 xv = parseFloat(fxyz[0]); yv = parseFloat(fxyz[1]); zv = parseFloat(fxyz[2]);
		document.getElementById("xValue").innerHTML="pos_x = "+ xv;
   		//document.querySelector("#xv").value = xv;
		document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    		//document.querySelector("#yv").value = yv;
		document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    		//document.querySelector("#zv").value = zv; 
	 vol = parseFloat(fxyz[3]); bv = parseFloat(fxyz[4]); tv = parseFloat(fxyz[5]);
	}
  } catch(e) { defpos();
    return false; 
  }
}

function savefxyz() { 
  var fxyz=Array();
   try {
	fxyz[0]=String(xv).substr(0, 5); fxyz[1]=String(yv).substr(0, 5); fxyz[2]=String(zv).substr(0, 5);
	fxyz[3]=String(vol).substr(0, 5); fxyz[4]=String(bv).substr(0, 5); fxyz[5]=String(tv).substr(0, 5);
	localStorage.setItem(fname, JSON.stringify(fxyz));
  } catch(e) {
    return false; 
  }	
}

function savexyz() {  
  try {
	localStorage.setItem("vspx",xv.toString()); 
	localStorage.setItem("vspy",yv.toString()); 
	localStorage.setItem("vspz",zv.toString()); 
  } catch(e) {
    return false; 
  }
};

var lp = false;
function chkLoop() { 
if ( document.getElementById('loop').checked ) { lp = true;  }
 else { lp = false;}
}

function movsp() { 
 var xv2;
  xv2 = xv*2;		// xv*2
  cubeL.position.setX(-xv2); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
  cubeR.position.setX(xv2);  cubeR.position.setY(yv); cubeR.position.setZ(zv); 
    cubeL.rotation.x=Math.atan(-yv/zv*1.0); cubeR.rotation.x=Math.atan(-yv/zv*1.0);
    cubeL.rotation.y=Math.atan(-xv2/zv*1.2); cubeR.rotation.y=Math.atan( xv2/zv*1.2); 
 renderer.render( scene, camera ); 
chkLoop();   
}

function startPlay() {  	
// ------------------------------------------------------------------------------------------------------
   audio.addEventListener('pause',function() { anf = false; },false);
   //audio.addEventListener('play',function() { renderA(); anf = true; },false);	//chk3Dsv()
   //audio.addEventListener('play',function() { chk3Dsv() },false);	---------	Feb 2021 -----------
// ------------------------------------------------------------------------------------------------------		 
     setPos( xv, yv, zv ); changeBass(bv); changeTreble(tv); //audio.volume=vol;
     playGain(); 
} 
   
function handleFiles() { 
 if (!fname) { initCtx() }	
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

function loadsrc() {	
    src = URL.createObjectURL(document.getElementsByTagName('input')[6].files[fc]); //console.log(src);
    fname = document.getElementsByTagName('input')[6].files[fc].name; 
	loadfxyz();
    showMetaData(document.getElementsByTagName('input')[6].files[fc]);						
    audio.src=src;	audio.autoplay = true;
  
    audio.addEventListener('loadeddata', function() {
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
      }
    startPlay();
   }, false);

}

function playGain() {
  source.connect(splitter); 

  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(audioCtx.destination); 		//     RL	              RR
  splitter.connect(gainRL,0).connect(pannerRL).connect(delayRL).connect(audioCtx.destination);				
  splitter.connect(gainBL,0).connect(pannerBL).connect(delayBL).connect(audioCtx.destination);	// BL  BR          L	             R         CL CR	
  splitter.connect(gainCL,0).connect(pannerCL).connect(delayCL).connect(audioCtx.destination);
  	//splitter.connect(gainRL,0).connect(pannerRL).connect(audioCtx.destination);				
    	//splitter.connect(gainBL,0).connect(pannerBL).connect(audioCtx.destination);
											//	    o
  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(audioCtx.destination); 			
  splitter.connect(gainRR,1).connect(pannerRR).connect(delayRR).connect(audioCtx.destination);			
  splitter.connect(gainBR,1).connect(pannerBR).connect(delayBR).connect(audioCtx.destination); 	 //          -BR           -BL
  splitter.connect(gainCR,1).connect(pannerCR).connect(delayCR).connect(audioCtx.destination);

  	//splitter.connect(gainRR,1).connect(pannerRR).connect(audioCtx.destination);			
    	//splitter.connect(gainBR,1).connect(pannerBR).connect(audioCtx.destination);
 		//comp.connect(audioCtx.destination)
 audio.play();
}

function setPos(x,y,z) { 	y=y-2; x=x/2; 	 //var fx,frx;
 if (fname) { 			//fx = Math.abs(8/z); //frx = fx*0.8;
  pannerL.setPosition( -x, y, z); pannerRL.setPosition ( -x, y, z*3);   //*-3 BLR
  pannerR.setPosition(  x, y, z); pannerRR.setPosition(   x, y, z*3); 
			   pannerBL.setPosition(  -x*4, y, z);  pannerBR.setPosition( -x*2, y, z);
			   pannerCL.setPosition(   x*2, y, z);  pannerCR.setPosition(   x*4, y, z);
 }
 movsp();     
}

function defpos() {
 xv=5; yv=2; zv=-10; //setPos(xv,yv,zv); 
 document.getElementById("xValue").innerHTML="pos_x = "+ xv;
  document.querySelector("#xv").value = xv;
 document.getElementById("yValue").innerHTML="pos_y = "+ yv;
  document.querySelector("#yv").value = yv;
 document.getElementById("zValue").innerHTML="pos_z = "+ zv;
  document.querySelector("#zv").value = zv;
   if ( fname ) { delayRL.delayTime.setValueAtTime(0.001*(-zv),0);
   	         delayRR.delayTime.setValueAtTime(0.001*(-zv),0); }
 setPos(xv,yv,zv); 
}

function changeBass(bvalue) {
  if (fname) {
	bassL.gain.setValueAtTime(bvalue,audioCtx.currentTime); 
	bassR.gain.setValueAtTime(bvalue,audioCtx.currentTime);
  } 
  bv = bvalue; 
    document.getElementById("bassValue").innerHTML="bass = "+ bv;
    //document.querySelector("#bass").value = bvalue;
}
function changeTreble(tvalue) {
  if (fname) {
  	trebleL.gain.setValueAtTime(tvalue,0); 
  	trebleR.gain.setValueAtTime(tvalue,0); 
  }
  tv = tvalue; 
    document.getElementById("trebleValue").innerHTML="treble = "+ tv;
    //document.querySelector("#treble").value = tvalue;
}

function changeXV(x) {
  xv = x; 
    document.getElementById("xValue").innerHTML="pos_x = "+ xv;
    //document.querySelector("#xv").value = xv;
 setPos( xv, yv, zv );
}
function changeYV(y) {
  yv = y; 
    document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    //document.querySelector("#yv").value = yv;
 setPos( xv, yv, zv ); 
}
function changeZV(z) {	
  zv = z; 
    document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    //document.querySelector("#zv").value = zv;
//
	if ( fname ) {delayRL.delayTime.setValueAtTime(0.001*(-zv),0);
		     delayRR.delayTime.setValueAtTime(0.001*(-zv),0); 
		     delayBL.delayTime.setValueAtTime(0.001*(-zv/2),0);	delayCL.delayTime.setValueAtTime(0.001*(-zv/2),0);
		     delayBR.delayTime.setValueAtTime(0.001*(-zv/2),0); 	delayCR.delayTime.setValueAtTime(0.001*(-zv/2),0); }; 
//
 setPos( xv, yv, zv );
}

//------------------------- init gl ------------------------------------
function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true, antialias: true }); 
renderer.setSize (wX,wY);    
renderer.setClearColor(0x3333cc, 0.1);
	canvasB = document.getElementById("canvasB"); ctxB = canvasB.getContext("2d");
	canvasC = document.getElementById("canvasC"); ctxC = canvasC.getContext("2d");
         
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

	canvasB.style.visibility = "hidden"; canvasC.style.visibility = "hidden";

	ctxB.beginPath(); ctxB.fillStyle = "#504000"; ctxB.fillRect( 0,0,256,256 );
	ctxB.ellipse(50, 50, 20, 30, 0, 0, 2 * Math.PI);
	ctxB.ellipse(70, 170, 40, 70, 0, 0, 2 * Math.PI); ctxB.fillStyle = "black";ctxB.fill(); 	
	var txR = new THREE.CanvasTexture(canvasB);		//txR.needsUpdate = true; txR.flipY = true;
      	var grR = new THREE.MeshBasicMaterial({map: txR,}); ctxB.closePath()
//
	ctxC.beginPath(); ctxC.fillStyle = "#504000"; ctxC.fillRect( 0,0,256,256 );
	ctxC.ellipse(80, 50, 20, 30, 0, 0, 2 * Math.PI);
	ctxC.ellipse(60, 170, 40, 70, 0, 0, 2 * Math.PI); ctxC.fillStyle = "black";ctxC.fill();	// 60<-70 11/16
	var txL = new THREE.CanvasTexture(canvasC);		//txL.needsUpdate = true; //txL.flipY = true;
      	var grL = new THREE.MeshBasicMaterial({map: txL,}); ctxC.closePath()
//        
     var br = new THREE.MeshLambertMaterial({color: 0x886600});
     //var gr = new THREE.MeshLambertMaterial({color: 0x333333});
     var materialsL = [ br, br, br, br, grL, br ]; 
     var materialsR = [ br, br, br, br, grR, br ];
   
         cubeL = new THREE.Mesh (geometry_cube, materialsL);
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
         cubeL.rotation.order = "ZYX"; cubeL.castShadow = true; 
         scene.add( cubeL ); 

         cubeR = new THREE.Mesh (geometry_cube, materialsR);
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv); 
         cubeR.rotation.order = "ZYX"; cubeR.castShadow = true; 
         scene.add( cubeR ); 
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadow.mapSize.width = 4096; light0.shadow.mapSize.height = 4096;
  scene.add( light0 );
 
   var gm = new THREE.PlaneBufferGeometry(90, 120, 10, 10);
    plane = new THREE.Mesh( gm,
        new THREE.MeshLambertMaterial({
            color: 0x888888, transparent: true, opacity: 0.7
        })
    );	//color: 0x8888ee
    plane.position.y = 0; plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 

 canvasA = document.getElementById("canvasA");
  ctxA = canvasA.getContext("2d");

} // -- end of initgl --

//------------ metedata --------------------------
var material,picture,texture,planea,image,img,picdata;

function showMetaData(data) {
	image = document.getElementById('myimg');
      musicmetadata(data, function (err, result) {	

        if (result.picture.length > 0) { image.style.visibility = 'visible';
          picture = result.picture[0]; 		
          var url = URL.createObjectURL(new Blob([picture.data], {'type': 'image/' + picture.format}));
	document.getElementById("centered").innerHTML=''; 
          image.src = url; image.width=178; image.height=178;	
        }
        else { image.style.visibility = 'hidden';
	document.getElementById("centered").innerHTML=result.title+"<br>"+result.artist[0];  } 
      });
    }

// --------------------------------------------------------------------------
var def,sef,defB,sefB,ds,mx,col,cr,cg,cb, fq, defR,sefR, ct,maxdef, logdef;
var dar=[], sar=[];

var x,y,z, intv, hue; x=0; y=0;  var maxdef=0;
var xar = new Array( ), yar = new Array( ), zar = new Array( ), xw = new Array()          
   for( var i=0; i<512; i++)     { xar[i] = new Array(10).fill(0); yar[i] = new Array(10).fill(0); zar[i] = new Array(10).fill(0);
			     xw[i] = new Array(10).fill(0); sar[i]=0; dar[i]=0	}

function renderA() {  
  var nextANLtime = audioCtx.currentTime; 	//ctxA.lineWidth = 0.5;

     analyserL.getByteFrequencyData(spectrumsL); analyserR.getByteFrequencyData(spectrumsR);
   
   fq = 0; 	
    while ( fq<len ) { 		  //len=analyserL.frequencyBinCount; = 256
	
     	sef = (spectrumsL[fq]+spectrumsR[fq]);	
	def = -(spectrumsL[fq]-spectrumsR[fq]);
	logdef = Math.log2(Math.abs(def))
	 	if ( maxdef<logdef ) { maxdef=logdef; changeXV( Math.round(maxdef*10)/10)
				     if (maxdef>6) { zv = Math.round( (zv - (maxdef-6))*10 )/10; changeZV(zv) }  }	
	ds = (sef*2-sar[fq] -dar[fq])+Math.abs(def)/2;

	 //y = 80-(ds*(-zv)/4);  	    x = ( def*xv*(y+100)/256 )+200 ; 	z = -sef/20
	//y = -Math.abs(ds)*(-zv)/4;  x = ( def*xv/(-zv)*10 ) ; 	z = -sef/20
	
		 x = def; y = Math.abs(ds);  z = Math.abs(sef/20); if (z<5) {z=0;;x=0;y=0}
		  if ( y<20 ) { y=Math.log(y)*10-10 } else if ( y>50) { y=50+(y-50)/2; }
		xar[fq].push( x*3*xv/5*12/(-zv+2)+200 ); xar[fq].shift(); 
		yar[fq].push( 220-(-zv)*3-yv*10+50-y );    yar[fq].shift(); 
		zar[fq].push( z ); 			       zar[fq].shift();
		xw[fq].push( 4/(y/30+1.5) ); 	       xw[fq].shift()
		
	hue = fq/len * 360; ctxA.strokeStyle = 'hsl(' + hue + ', 100%, 60% )'; 
    			 //ctxA.strokeRect( x/2+200, y+z/4-yv+250, y/30, z );	// ( x, y+z-yv*8+120, y/30, z )
	ctxA.strokeRect( xar[fq][9], yar[fq][9], xw[fq][9], zar[fq][9]  );			 //4/(y/30+1)
	ctxA.clearRect( xar[fq][0]-1, yar[fq][0]-1, xw[fq][0]+2, zar[fq][0]+2  );

	dar[fq] = sar[fq]; sar[fq] = sef; 	 //dar[fq] = sar[fq]; 
       fq++;
    } ; 
     if ( anf )  { 
	 while(nextANLtime < audioCtx.currentTime + 0.1) {
        	  nextANLtime += 4.0;
    	}
	intv = setTimeout(renderA, 60) } 
	else { clearTimeout( intv ); ctxA.clearRect(0, 0, canvasA.width, canvasA.height);}
  }

function chk3Dsv() { 
 if (document.getElementById("3Dfrq").checked ) { 
          	anf = true; pannerL.connect(analyserL); pannerR.connect(analyserR); maxdef=0; renderA(); }  
 else { 	anf = false; analyserL.disconnect(); analyserR.disconnect();  }
 };
// --------------------------------------------------------------------------