/*
 *   Virtual Speaker System for Chrome Android (VSP)
 */						

var src, source, splitter, audio, fname, fc,flen;
var xv, yv, zv, vol, rv, tv,tvv, cv, bv, cf,cn2 ,tfile,gl,mf;
 vol = 0.7; ctlvol = 0.6; cv = 1.0; rv =0.4; cf = 0;   				//*** rv =0.25;  2019/1/25
 xv = 5.0; yv = 2.0; zv = -10.0;  tv = 0.0; bv = 0.0; 

//var touchSX,touchSY, touchEX,touchEY, touchDX, touchDY, diffSX, diffEX, el,ctx;

var AudioContext = window.AudioContext; // || window.webkitAudioContext; 
var audioCtx; 

var gainL,gainBL,gainR,gainBR,delaySL,delaySR, gainRL, gainRR, delayRL, delayRR;
var pannerL,pannerR,pannerBL,pannerBR,listener, pannerRL, pannerRR;  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var bassL,trebleL,trebleRL,bassR,trebleR,trebleRR;
var analyserL, analyserR, analyserLR, analyserRR, spectrumsL, spectrumsR; //spectrumsLR, spectrumsRR;

var canvasL,canvasR,canvasA, ctxL,ctxR,ctxA, animationId,renderA;
var anf = false;
//canvasA = document.getElementById("canvasA");
//  ctxA = canvasA.getContext("2d");

function initCtx() {

audioCtx = new AudioContext(); 
 splitter = audioCtx.createChannelSplitter(2);
 listener = audioCtx.listener;

 pannerL  = audioCtx.createPanner(); pannerL.rolloffFactor = 1;
    pannerL.panningModel = 'HRTF';  pannerL.distanceModel = 'linear'; pannerL.setOrientation(0,0,1); pannerL.maxDistance = 10000;
 pannerR  = audioCtx.createPanner(); pannerR.rolloffFactor = 1;
    pannerR.panningModel = 'HRTF';  pannerR.distanceModel = 'linear'; pannerR.setOrientation(0,0,1); pannerR.maxDistance = 10000;
 pannerBL = audioCtx.createPanner(); pannerBL.refDistance = 1;
    pannerBL.panningModel = 'HRTF'; pannerBL.distanceModel = 'linear'; pannerBL.setOrientation(0,0,1);pannerBL.maxDistance = 100;
 pannerBR = audioCtx.createPanner(); pannerBR.refDistance = 1;
    pannerBR.panningModel = 'HRTF'; pannerBR.distanceModel = 'linear'; pannerBR.setOrientation(0,0,1);pannerBR.maxDistance = 100;
 pannerRL = audioCtx.createPanner();
    pannerRL.panningModel = 'HRTF'; pannerRL.distanceModel = 'linear'; pannerRL.setOrientation(0,0,1);pannerRL.maxDistance = 100;
 pannerRR = audioCtx.createPanner();
    pannerRR.panningModel = 'HRTF'; pannerRR.distanceModel = 'linear'; pannerRR.setOrientation(0,0,1);pannerRR.maxDistance = 100;

 bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf';  bassL.Q.automationRate='k-rate';
  bassL.frequency.setValueAtTime(100, 0); 
  bassL.gain.setValueAtTime(bv, 0);				// -40db...40db
 trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleL.frequency.setValueAtTime(12000, 0);
  trebleL.gain.setValueAtTime(tv, 0);

 trebleRL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleRL.frequency.setValueAtTime(12000, 0);
  trebleRL.gain.setValueAtTime(tv, 0);
// trebleBL = audioCtx.createBiquadFilter(); trebleBL.type   = 'highshelf';
//  trebleBL.frequency.setValueAtTime(18000, 0);
//  trebleBL.gain.setValueAtTime(tv, 0);

 bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';  bassR.Q.automationRate='k-rate';
  bassR.frequency.setValueAtTime(100, 0);
  bassR.gain.setValueAtTime(bv, 0);
 trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';  trebleR.Q.automationRate='k-rate';
  trebleR.frequency.setValueAtTime(12000, 0);
  trebleR.gain.setValueAtTime(tv, 0);

 trebleRR = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';  trebleL.Q.automationRate='k-rate';
  trebleRR.frequency.setValueAtTime(12000, 0);
  trebleRR.gain.setValueAtTime(tv, 0);
// trebleBR = audioCtx.createBiquadFilter(); trebleBR.type   = 'highshelf';
//  trebleBR.frequency.setValueAtTime(18000, 0);
//  trebleBR.gain.setValueAtTime(tv, 0);

gainBL = audioCtx.createGain(); gainBL.gain.value = rv/4;  	//gainBL.gain.automationRate='k-rate';
gainBR = audioCtx.createGain(); gainBR.gain.value = rv/4; 	//gainBR.gain.automationRate='k-rate';
 gainRL = audioCtx.createGain(); gainRL.gain.value = rv;  	//gainBR.gain.automationRate='k-rate';
 gainRR = audioCtx.createGain(); gainRR.gain.value = rv; 	//gainBR.gain.automationRate='k-rate';

//delayL = audioCtx.createDelay(); delayL.delayTime.value=0.004*(-zv/6); delaL.delayTime.automationRate='k-rate';
//delayR = audioCtx.createDelay(); delayR.delayTime.value=0.004*(-zv/6); delayR.delayTime.automationRate='k-rate';
delayBL = audioCtx.createDelay(); delayBL.delayTime.value=0.04*(-zv/4); delayBL.delayTime.automationRate='k-rate'; 
delayBR = audioCtx.createDelay(); delayBR.delayTime.value=0.04*(-zv/4); delayBR.delayTime.automationRate='k-rate';
 delayRL = audioCtx.createDelay(); delayRL.delayTime.value=0.04*(-zv/4); delayRL.delayTime.automationRate='k-rate';
 delayRR = audioCtx.createDelay(); delayRR.delayTime.value=0.04*(-zv/4); delayRR.delayTime.automationRate='k-rate';

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

  loadxyz(); 
   window.onbeforeunload = function() { savexyz(); alert("beforunload");}
  //initCtx();
  initgls(); setPos(xv,yv,zv); //movsp();

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

function loadxyz() { 
  try {
	sxv = localStorage.getItem("vspx"); if (sxv) { xv = parseFloat(sxv);};
		document.getElementById("xValue").innerHTML="pos_x = "+ xv;
   		document.querySelector("#xv").value = xv;
	syv = localStorage.getItem("vspy"); if (syv) { yv = parseFloat(syv);}; 
		document.getElementById("yValue").innerHTML="pos_y = "+ yv;
    		document.querySelector("#yv").value = yv;		
	szv = localStorage.getItem("vspz"); if (szv) { zv = parseFloat(szv);};
		document.getElementById("zValue").innerHTML="pos_z = "+ zv;
    		document.querySelector("#zv").value = zv; 
  } catch(e) {
    return false; 
  }
};
	
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
  xv2 = xv*2;
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
   audio.addEventListener('play',function() { chk3Dsv() },false);
// ------------------------------------------------------------------------------------------------------		 
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

  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(audioCtx.destination); 			//     RL	              RR
  splitter.connect(gainRL,0).connect(pannerRL).connect(delayRL).connect(audioCtx.destination);				
  splitter.connect(gainBL,0).connect(pannerBL).connect(delayBL).connect(audioCtx.destination);			//         L	             R	
    //splitter.connect(pannerL,0).connect(analyserL); //splitter.connect(pannerRL,0).connect(analyserLR);
												//	    o
  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(audioCtx.destination); 			
  splitter.connect(gainRR,1).connect(pannerRR).connect(delayRR).connect(audioCtx.destination);			
  splitter.connect(gainBR,1).connect(pannerBR).connect(delayBR).connect(audioCtx.destination); 		//          BR           BL
  //splitter.connect(pannerR,1).connect(analyserR); //splitter.connect(pannerRR,0).connect(analyserRR);

 audio.play();
}

function setPos(x,y,z) {  var fx,frx;
 if (fname) { fx = Math.abs(8/z); //frx = fx*0.8;
  pannerL.setPosition( -x, y*2, z*2); pannerBL.setPosition( x*2, -y*2, -z*2);  pannerRL.setPosition(-x*2, y*2, z*2);   //2019/1/25
  pannerR.setPosition(  x, y*2, z*2); pannerBR.setPosition(-x*2, -y*2, -z*2);  pannerRR.setPosition( x*2, y*2, z*2); 
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
   if ( fname ) { delayRL.delayTime.setValueAtTime(0.04*(-zv/5),0);
   	         delayRR.delayTime.setValueAtTime(0.04*(-zv/5),0); }
 setPos(xv,yv,zv); 
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
  	trebleL.gain.setValueAtTime(tvalue,0); 
  	trebleR.gain.setValueAtTime(tvalue,0); 
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
	if ( fname ) {delayRL.delayTime.setValueAtTime(0.04*(-zv/8),0);
		     delayRR.delayTime.setValueAtTime(0.04*(-zv/8),0); 
		     delayRL.delayTime.setValueAtTime(0.04*(-zv/4),0);
		     delayRR.delayTime.setValueAtTime(0.04*(-zv/4),0); }; 
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
            color: 0x888888, transparent: true, opacity: 0.7
        })
    );	//color: 0x8888ee
    plane.position.y = 0; plane.rotation.x = -Math.PI / 2;
    scene.add( plane );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 

 //el = document.getElementById("tCanvas");
 canvasA = document.getElementById("canvasA");
  ctxA = canvasA.getContext("2d");

} // -- end of initgl --

//------------ metedata --------------------------
var material,picture,texture,planea,image,img,picdata;

function showMetaData(data) { //console.log(fname);
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
var dar=[], sar=[], darB=[], sarB=[];

var x,y,z, intv, hue; x=0; y=0; var ly=2; var k=0; maxdef=0;

function renderA() {  
  var nextANLtime = audioCtx.currentTime; //ctxA.lineWidth = 0.5;

     analyserL.getByteFrequencyData(spectrumsL); analyserR.getByteFrequencyData(spectrumsR);
    
    if ( k%3 == 0 ) { ctxA.clearRect(0, 0, canvasA.width, canvasA.height);	k=0 }
    //len=analyserL.frequencyBinCount; = 256
	k=k+1; fq = 0; 
    while ( fq<len ) { 
	
     	sef = (spectrumsL[fq]+spectrumsR[fq]); //sefR = (spectrumsLR[fq]+spectrumsRR[fq]); 	
	def = -(spectrumsL[fq]-spectrumsR[fq]); //defR = -(spectrumsLR[fq]-spectrumsRR[fq]); 
	logdef = Math.log2(Math.abs(def))
	 	if ( maxdef<logdef ) { maxdef=logdef; changeXV( Math.round(maxdef*10)/10)
				     if (maxdef>6) { zv = Math.round( (zv - (maxdef-6))*10 )/10; changeZV(zv) }  }	
	ds = (sef*2-sar[fq] -dar[fq])+Math.abs(def)/2; //+sef-dar[fq];   +def?

	 //y = 80-(ds*(-zv)/4);  	    x = ( def*xv*(y+100)/256 )+200 ; 	z = -sef/20
	//y = -Math.abs(ds)*(-zv)/4;  x = ( def*xv/(-zv)*10 ) ; 	z = -sef/20	
		y = Math.abs(ds);  x = ( def ) ; 	z = Math.abs(sef/20); 

		if ( y<20 ) { y=Math.log(y)*10-10 }
		else if ( y>50) { y=50+(y-50)/2; }
		
	//if (y < 120 && z<-3) {	// 50-100?
	hue = fq/len * 360; 
    	 //ctxA.strokeStyle = 'hsla(' + hue + ', 100%, 65%,' +y/80+ ')'; 	 //y:35-110?
	ctxA.strokeStyle = 'hsl(' + hue + ', 100%, 60% )'; 
    	 //ctxA.strokeRect( x/2+200, y+z/4-yv+250, y/30, z );	// ( x, y+z-yv*8+120, y/30, z )
		ctxA.strokeRect( x*3*xv/5*12/(-zv+2)+200, 220-(-zv)*3-yv*10+50-y, 4/(y/30+1.5), -z ); //4/(y/30+1)
		//console.log(Math.sqrt(y))
	// }
	sar[fq] = sef; 	 dar[fq] = sar[fq]; 
       fq++;
    } ; //ctxA.strokeRect( 198, 120, maxdef*2, 1 ); ctxA.strokeRect( 202, 120, -maxdef*2, 1 ); //ct = audio.currentTime;
     if ( anf )  { 
	// while(nextANLtime < audioCtx.currentTime + 0.1) {
        	//  nextANLtime += 4.0;
    	//}
	intv = setTimeout(renderA, 60) } 
	else { clearTimeout( intv ); ctxA.clearRect(0, 0, canvasA.width, canvasA.height);}
  }

function chk3Dsv() { 
 if (document.getElementById("3Dfrq").checked ) { 
          	anf = true; pannerL.connect(analyserL); pannerR.connect(analyserR); maxdef=0; renderA(); }  
 else { 	anf = false; analyserL.disconnect(); analyserR.disconnect();  }
 };
// --------------------------------------------------------------------------
