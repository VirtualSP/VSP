/*
 *   Virtual Speaker System for Chrome Android (VSP)
 */						

var xv, yv, zv, vol, rv, tv,tvv, cv, bv;
 vol = 0.5;   rv =0.3;    				//rv =0.3; 			
 xv = 5.0; yv = 2.0; zv = -10.0;  tv = 0.0; bv = 0.0; 					// tv = 0.5 2021 Mar

var AudioContext;		// = new AudioContext(); 
var audioCtx, listener, src, source, splitter, audio, fname, fc,flen; 
var gainL,gainBL,gainR,gainBR, gainRL, gainRR, delayRL, delayRR, gainCL,gainCR,delayCL,delayCR;
var pannerL,pannerR,pannerBL,pannerBR, pannerRL, pannerRR, pannerCL,pannerCR; 
var bassL,trebleL,trebleRL,bassR,trebleR,trebleRR;

function initCtx() {
 audioCtx = new AudioContext(); 
 splitter = audioCtx.createChannelSplitter(2);
 listener = audioCtx.listener;			

 pannerL  = audioCtx.createPanner(); setProperties( pannerL );	//pannerL.panningModel = 'equalpower';
 pannerR  = audioCtx.createPanner(); setProperties( pannerR );	//pannerR.panningModel = 'equalpower';
 pannerBL = audioCtx.createPanner(); setProperties( pannerBL );	//pannerBL.panningModel = 'equalpower';
 pannerBR = audioCtx.createPanner(); setProperties( pannerBR );	//pannerBR.panningModel = 'equalpower';
 pannerCL = audioCtx.createPanner(); setProperties( pannerCL );	//pannerCL.panningModel = 'equalpower';
 pannerCR = audioCtx.createPanner(); setProperties( pannerCR );	//pannerCR.panningModel = 'equalpower';
 pannerRL = audioCtx.createPanner();	setProperties( pannerRL );	//pannerRL.panningModel = 'equalpower';
 pannerRR = audioCtx.createPanner();	setProperties( pannerRR );	//pannerRR.panningModel = 'equalpower';

 bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf'; 
  bassL.frequency.setValueAtTime(60, 0); 
  bassL.gain.setValueAtTime(bv, 0);				// -40db...40db
 trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';
  trebleL.frequency.setValueAtTime(12000, 0);
  trebleL.gain.setValueAtTime(tv, 0);

 trebleRL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';
  trebleRL.frequency.setValueAtTime(12000, 0);
  trebleRL.gain.setValueAtTime(tv, 0);
// trebleBL = audioCtx.createBiquadFilter(); trebleBL.type   = 'highshelf';
//  trebleBL.frequency.setValueAtTime(18000, 0);
//  trebleBL.gain.setValueAtTime(tv, 0);

 bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';
  bassR.frequency.setValueAtTime(60, 0);
  bassR.gain.setValueAtTime(bv, 0);
 trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';
  trebleR.frequency.setValueAtTime(12000, 0);
  trebleR.gain.setValueAtTime(tv, 0);

 trebleRR = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';
  trebleRR.frequency.setValueAtTime(12000, 0);
  trebleRR.gain.setValueAtTime(tv, 0);			// -40..40
// trebleBR = audioCtx.createBiquadFilter(); trebleBR.type   = 'highshelf';
//  trebleBR.frequency.setValueAtTime(18000, 0);
//  trebleBR.gain.setValueAtTime(tv, 0);

gainBL = audioCtx.createGain(); gainBL.gain.value = rv;  	
gainBR = audioCtx.createGain(); gainBR.gain.value = rv/2; 
gainCL = audioCtx.createGain(); gainCL.gain.value = rv/2; 
gainCR = audioCtx.createGain(); gainCR.gain.value = rv;

 gainRL = audioCtx.createGain(); gainRL.gain.value = rv; 
 gainRR = audioCtx.createGain(); gainRR.gain.value = rv; 

delayCL = audioCtx.createDelay(); delayCR = audioCtx.createDelay();
delayBL = audioCtx.createDelay(); delayBR = audioCtx.createDelay();
delayRL = audioCtx.createDelay(); delayRR = audioCtx.createDelay(); 
//setDelay() 	 

audio = new Audio(src); audio.controls = true; audio.volume=vol;	audio.clientWidth=50;
audio.crossOrigin = "anonymous";			// +++ for chrome71- CORS access ++++
  //document.body.appendChild(audio); 
 var ip= document.getElementById("vals"); ip.append(audio);
  source = audioCtx.createMediaElementSource(audio); 
 setPos(xv,yv,zv);

 audio.addEventListener('ended', savefxyz,false);
 audio.addEventListener('pause', savefxyz,false);
 audio.addEventListener('volumechange', function() { vol=audio.volume },false); 
}

var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0, meshL,meshR,cubeL, cubeR;	
	
var wX = 400, wY = 400;   

function ini() {

  //loadxyz(); 
  //initCtx();
  initgls(); setPos(xv,yv,zv); //movsp();
// ------- Mar 2020 -------L182
const st=' Stop Putin and bring about <br>a peaceful,democratic Europe-Russia'
document.getElementById("centered0").innerHTML=st
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
   		  document.querySelector("#xv").value = xv;
		document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    		  document.querySelector("#yv").value = yv;
		document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    		  document.querySelector("#zv").value = zv; 
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

var lp = false;
function chkLoop() { 
  if ( document.getElementById('loop').checked ) { lp = true;  }
  else { lp = false;}
}

function movsp() { 
 var xv2,zv2;
  xv2 = xv*2; 	zv2=zv*2
  cubeL.position.setX(-xv2); cubeL.position.setY(yv); cubeL.position.setZ(zv2); 
  cubeR.position.setX(xv2);  cubeR.position.setY(yv); cubeR.position.setZ(zv2); 	
    cubeL.rotation.y=Math.atan(-xv2/zv*0.5); cubeR.rotation.y=Math.atan( xv2/zv*0.5); //cubeL.rotation.z=-(zv+10)/1000
    cubeL.rotation.x=Math.atan(-yv/zv*0.1);   cubeR.rotation.x=Math.atan(-yv/zv*0.1);	
 renderer.render( scene, camera ); 
chkLoop();   
}

function startPlay() {  	
   audio.addEventListener('pause',function() { anf = false; },false);		 
     setPos( xv, yv, zv ); changeBass(bv); changeTreble(tv);
     playGain(); 
} 
   
function handleFiles() { 
  var fileInput = document.getElementById("input");
 	if ( !audioCtx ) { initCtx() }	
	fc = 0; movsp();
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

function loadsrc() {	document.getElementById("centered0").innerHTML=''	
    src = URL.createObjectURL(document.getElementsByTagName('input')[6].files[fc]);
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

function playGain() {	//  audio with depth information, improved the sound sense of depth : Sep 2021
  source.connect(splitter); 

  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(audioCtx.destination); 		//     RL	              RR
  splitter.connect(gainRL,0).connect(pannerRL).connect(delayRL).connect(audioCtx.destination);				
  splitter.connect(gainBL,0).connect(pannerBL).connect(delayBL).connect(audioCtx.destination);	// BR  BL          L	             R         CR CL	
  splitter.connect(gainCL,0).connect(pannerCL).connect(delayCL).connect(audioCtx.destination);
											//	    o
  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(audioCtx.destination); 			
  splitter.connect(gainRR,1).connect(pannerRR).connect(delayRR).connect(audioCtx.destination);			
  splitter.connect(gainBR,1).connect(pannerBR).connect(delayBR).connect(audioCtx.destination); 
  splitter.connect(gainCR,1).connect(pannerCR).connect(delayCR).connect(audioCtx.destination);

 audio.play();
}

  var RL=[],RR=[],BL=[],BR=[],CL=[],CR=[]
function setPos(x,y,z) { 	
 var a,b; 	a=3; y=y-2; w=x*3; v=x*4	//x=x/2;w=15+x;v=15-x; 		// a=2				// **2020Mar**(a=2)
 if (fname) { 
  setPan( pannerL, -x, y, z); setPan( pannerRL, -x, y, z*a);	//RL[0]=-x; RL[1]=y; RL[2]=z*a	// -x-(-z), y, z*a
  setPan( pannerR,  x, y, z); setPan( pannerRR,  x, y, z*a); //RR[0]= x; RR[1]=y; RR[2]=z*a	//  x-z, y, z*a
			setPan( pannerBL,  -w, y, z); //BL[0]=-w; BL[1]=y; BL[2]=z;	//(  -x*4, y, z)
			setPan( pannerBR,  -v, y, z); //BR[0]=-v; BR[1]=y; BR[2]=z 	//( -x*2, y, z)
			setPan( pannerCL,   v, y, z);  	//CL[0]= v; CL[1]=y; CL[2]=z 		//(   x*2, y, z)
			setPan( pannerCR,   w, y, z);	//CR[0]= w; CR[1]=y; CR[2]=z 	//(   x*4, y, z)
 }
  movsp();   if (fname) { setDelay()  }
}

function setPan( sp, x,y,z ) {
  sp.positionX.value = x; sp.positionY.value = y; sp.positionZ.value = z;	listener.positionZ.value=-z/2		// **2020Mar** (-z)
}

function setProperties( sp ) {
  sp.orientationX.value = 0; 	sp.orientationY.value = 0; 	sp.orientationZ.value = 1;
  sp.rolloffFactor = 0; 	sp.maxDistance = 10000;	sp.refDistance = 0; 
  sp.panningModel = 'HRTF';  sp.distanceModel = 'linear';
}

function setDelay() {		// in seconds
  var dr, dv, dw, df = -zv/100;  
	//dr =  0.004*Math.sqrt(RL[0]*RL[0]+RL[1]*RL[1]+RL[2]*RL[2])*df; 
	//dw = 0.004*Math.sqrt(BL[0]*BL[0]+BL[1]*BL[1]+BL[2]*BL[2])*df/2;
	//dv =  0.004*Math.sqrt(CL[0]*CL[0]+CL[1]*CL[1]+CL[2]*CL[2])*df; 
	dr =  ( Math.sqrt(xv*xv+9*zv*zv)-Math.sqrt(xv*xv+zv*zv) )/340;					// **2020Mar**(3*zv)
	dw = ( Math.sqrt(9*xv*xv+zv*zv)-Math.sqrt(xv*xv+zv*zv) )/340;
	dv=   ( Math.sqrt(16*xv*xv+zv*zv)-Math.sqrt(xv*xv+zv*zv) )/340;
		//console.log(BL[0],dr,dw,dv);	// dw<dv
	delayRL.delayTime.setValueAtTime( dr,0 );  delayRR.delayTime.setValueAtTime( dr,0 ); 	
	delayBL.delayTime.setValueAtTime( dw,0 ); delayBR.delayTime.setValueAtTime( dv,0 );
	delayCL.delayTime.setValueAtTime( dv,0 ); delayCR.delayTime.setValueAtTime( dw,0 ); //console.log(dr,dv,dw)
}

function defpos() {
 xv=5; yv=2; zv=-10; //setPos(xv,yv,zv); 
 document.getElementById("xValue").innerHTML="pos_x = "+ xv;
  document.querySelector("#xv").value = xv;
 document.getElementById("yValue").innerHTML="pos_y = "+ yv;
  document.querySelector("#yv").value = yv;
 document.getElementById("zValue").innerHTML="pos_z = "+ zv;
  document.querySelector("#zv").value = zv;
   if ( fname ) { setDelay() } 	
 setPos(xv,yv,zv); 
}

function changeBass(bvalue) { 
  if (fname) {
	bassL.gain.setValueAtTime(bvalue,0); 
	bassR.gain.setValueAtTime(bvalue,0);
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
 setPos( xv, yv, zv );
}

//------------------------- init gl ------------------------------------
function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true, antialias: true }); 
renderer.setSize (wX,wY);    
renderer.setClearColor(0x3333ff, 0.5);						// 0x3333cc, 0.1
	canvasB = document.getElementById("canvasB"); ctxB = canvasB.getContext("2d");
	canvasC = document.getElementById("canvasC"); ctxC = canvasC.getContext("2d");
         
camera = new THREE.PerspectiveCamera (60, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=6;   	//z:5
camera.lookAt( {x:0, y:4, z:-500 } ); 				//z:0
      
scene = new THREE.Scene(); scene.add(camera);  //scene.background = new THREE.Color( 0xff0000 );
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);         
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
	//Sphere0 = new THREE.Mesh (geometry_sph, material0);     				//12_12
	//Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; Sphere0.castShadow = true;     //12_12
	//scene.add( Sphere0 );

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
     var materialsL = [ br, br, br, br, grL, br ]; 
     var materialsR = [ br, br, br, br, grR, br ];
   
         cubeL = new THREE.Mesh (geometry_cube, materialsL);
         cubeL.position.setX(-xv); cubeL.position.setY(yv); cubeL.position.setZ(zv); 
         cubeL.rotation.order = "ZYX"; cubeL.castShadow = true; 
         scene.add( cubeL ); 

         cubeR = new THREE.Mesh (geometry_cube, materialsR);
         cubeR.position.setX(xv); cubeR.position.setY(yv); cubeR.position.setZ(zv); 
         cubeR.rotation.order = "ZYX"; cubeR.castShadow = true; 
         scene.add( cubeR ); 					//cubeR.rotation.y=-0.4
         
  light0 = new THREE.SpotLight( 0xffffff );      
  light0.position.x=100; light0.position.y=100; light0.position.z=100;    
  light0.shadow.mapSize.width = 4096; light0.shadow.mapSize.height = 4096;
  scene.add( light0 );
 
   var gm = new THREE.PlaneBufferGeometry(120, 120, 30, 30);
    plane = new THREE.Mesh( gm,
        new THREE.MeshLambertMaterial({
            color: 0xE0FA03, transparent: true, opacity: 0.95			// color: 0x888888 opacity: 0.7
        })
    );	//color: 0x8888ee
    plane.position.y = 0; plane.rotation.x = -Math.PI / 2;
	var grid = new THREE.GridHelper(100, 50, 0x555555, 0x777777);	//(120, 60, 0x555555, 0x777777)
	//var grid = new THREE.InfiniteGridHelper(120,60,0x777777,100)
    scene.add( plane ); scene.add( grid );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 

 //canvasA = document.getElementById("canvasA");
  //ctxA = canvasA.getContext("2d");

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
