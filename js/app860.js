/*
 *   Virtual Speaker System 		Jun. 2024		L230 L38 L48 L55 L56
 */						
var xv, yv, zv, vol, rv, tv,tvv, cv, bv;
 vol = 0.3;   rv =0.28;		// rv*5 =1 rv =0.25;	********
 xv = 5.0; yv = 2.0; zv = -10.0;  tv = 0.0; bv = 0.0;

var AudioContext;
var audioCtx, listener, src, source, splitter, audio, fname, fc,flen, lz; 
var gainL,gainBL,gainR,gainBR, gainRL, gainRR, gainCL,gainCR;
var delayL, delayR, delayRL, delayRR, delayCL, delayCR
var pannerL,pannerR,pannerBL,pannerBR, pannerRL, pannerRR, pannerCL,pannerCR; 
var bassL,trebleL,trebleRL,bassR,trebleR,trebleRR;
	var analyserL,spectrumsL,analyserR,spectrumsR, tm, sampleRate = 48000; fftSize = 512;
	var merger, dest
	
function initCtx() {
 audioCtx = new AudioContext(); 	sampleRate = audioCtx.sampleRate; //48000
 splitter = audioCtx.createChannelSplitter(8);
 listener = audioCtx.listener;			

 pannerL  = audioCtx.createPanner(); setProperties( pannerL );
 pannerR  = audioCtx.createPanner(); setProperties( pannerR );
 pannerBL = audioCtx.createPanner(); setProperties( pannerBL );
 pannerBR = audioCtx.createPanner(); setProperties( pannerBR );
 pannerCL = audioCtx.createPanner(); setProperties( pannerCL );
 pannerCR = audioCtx.createPanner(); setProperties( pannerCR );
 pannerRL = audioCtx.createPanner(); setProperties( pannerRL );
 pannerRR = audioCtx.createPanner(); setProperties( pannerRR );

 bassL   = audioCtx.createBiquadFilter(); bassL.type   = 'lowshelf'; 
  bassL.frequency.value = 120;
  bassL.gain.value = bv; 				// -40db...40db
 trebleL = audioCtx.createBiquadFilter(); trebleL.type   = 'highshelf';
  trebleL.frequency.value = 8000;
  trebleL.gain.value = tv;
 trebleLH = audioCtx.createBiquadFilter(); trebleLH.type = 'highshelf';
  trebleLH.frequency.value = 16000;
  trebleLH.gain.value = tv+8;											// +2

 bassR   = audioCtx.createBiquadFilter(); bassR.type   = 'lowshelf';
  bassR.frequency.value = 120;
  bassR.gain.value = bv;
 trebleR = audioCtx.createBiquadFilter(); trebleR.type   = 'highshelf';
  trebleR.frequency.value = 8000;
  trebleR.gain.value = tv;
 trebleRH = audioCtx.createBiquadFilter(); trebleRH.type = 'highshelf';
  trebleRH.frequency.value = 16000;
  trebleRH.gain.value = tv+8;												// +2

gainBL = audioCtx.createGain(); gainBL.gain.value = rv;  	
gainBR = audioCtx.createGain(); gainBR.gain.value = rv*0.8; 	//********
gainCL = audioCtx.createGain(); gainCL.gain.value = rv*0.8; 	//********
gainCR = audioCtx.createGain(); gainCR.gain.value = rv;

 gainRL = audioCtx.createGain(); gainRL.gain.value = rv; //rv; 
 gainRR = audioCtx.createGain(); gainRR.gain.value = rv; //rv;

//delayL = audioCtx.createDelay();  delayR = audioCtx.createDelay();
delayCL = audioCtx.createDelay(); delayCR = audioCtx.createDelay();
delayBL = audioCtx.createDelay(); delayBR = audioCtx.createDelay();
delayRL = audioCtx.createDelay(); delayRR = audioCtx.createDelay(); 
	merger = audioCtx.createChannelMerger(8);
	//dest = audioCtx.createMediaStreamDestination();
//setDelay() 	
	analyserL = audioCtx.createAnalyser();	// analizer +++++++++++++++++++++++++++++++++++++++
	analyserL.fftSize = fftSize;
	analyserL.minDecibels = -100;  // Default -100 dB
	analyserL.maxDecibels =    -30;  // Default  -30 dB
	analyserR = audioCtx.createAnalyser();	// analizer +++++++++++++++++++++++++++++++++++++++
	analyserR.fftSize = fftSize;
	analyserR.minDecibels = -100;  // Default -100 dB
	analyserR.maxDecibels =    -30;  // Default  -30 dB
  var fsDivN = audioCtx.sampleRate / analyserL.fftSize; 
	dt = sampleRate/fftSize ; // fftSize = 1024  smpRate = 48000 dt = 46.875 ( 8000Hz=170.6f)
	fc8k = Math.floor(8000/dt); fc12k = Math.floor(12000/dt);	//fftSize = 1024;  sampleRate = 48000
	spectrumsL = new Uint8Array(analyserL.frequencyBinCount);	
	spectrumsR = new Uint8Array(analyserR.frequencyBinCount);
	//tm = setInterval( renderA, 16 );	// +++++++++++++++++++++++++++++
/*
  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(trebleLH).connect(merger,0,0)
	//.connect(audioCtx.destination); 											//     RL	RR	
	//.connect(merger,0).connect(dest)	//connect(destination, outputIndex, inputIndex)
  splitter.connect(gainRL,0).connect(pannerRL).connect(delayRL).connect(merger,0,0); //connect(audioCtx.destination);				
  splitter.connect(gainBL,0).connect(pannerBL).connect(delayBL).connect(merger,0,0); //connect(audioCtx.destination);	// BR BL  L	 R CR CL	
  splitter.connect(gainCL,0).connect(pannerCL).connect(delayCL).connect(merger,0,0); //connect(audioCtx.destination);
																								//	        o
  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(trebleRH).connect(merger,0,1); 
	//connect(audioCtx.destination);
    //.connect(delayR).connect(audioCtx.destination); 			
  splitter.connect(gainRR,1).connect(pannerRR).connect(delayRR).connect(merger,0,1); //connect(audioCtx.destination);			
  splitter.connect(gainBR,1).connect(pannerBR).connect(delayBR).connect(merger,0,1); //connect(audioCtx.destination); 
  splitter.connect(gainCR,1).connect(pannerCR).connect(delayCR).connect(merger,0,1); //connect(audioCtx.destination);
  
  merger.connect(analyserLR).connect(audioCtx.destination);
*/
  splitter.connect(pannerL,0).connect(bassL).connect(trebleL).connect(analyserL).connect(audioCtx.destination); 			//     RL	RR	
  splitter.connect(gainRL,0).connect(pannerRL).connect(delayRL).connect(trebleLH).connect(audioCtx.destination);				
  splitter.connect(gainBL,0).connect(pannerBL).connect(delayBL).connect(audioCtx.destination);	// BR BL  L	 R CR CL	
  splitter.connect(gainCL,0).connect(pannerCL).connect(delayCL).connect(audioCtx.destination);
																								//	        o
  splitter.connect(pannerR,1).connect(bassR).connect(trebleR).connect(analyserR).connect(audioCtx.destination);		
  splitter.connect(gainRR,1).connect(pannerRR).connect(delayRR).connect(trebleRH).connect(audioCtx.destination);			
  splitter.connect(gainBR,1).connect(pannerBR).connect(delayBR).connect(audioCtx.destination); 
  splitter.connect(gainCR,1).connect(pannerCR).connect(delayCR).connect(audioCtx.destination);
//  
audio = new Audio(src); audio.controls = true; audio.volume=vol;	audio.clientWidth=50;
audio.crossOrigin = "anonymous";			// +++ for chrome71- CORS access ++++

 var ip= document.getElementById("vals"); ip.append(audio);
  source = audioCtx.createMediaElementSource(audio); 
   source.connect(splitter);
 movsp(); 				// <-- setPos(xv,yv,zv);			2023 Aug

 audio.addEventListener('ended', savefxyz,false);
 audio.addEventListener('pause', savefxyz,false);
 audio.addEventListener('pause', function() { tm = setInterval( renderA, 16 ) },false);
 audio.addEventListener('volumechange', function() { vol=audio.volume },false); 
}			// ---- end of initCtx() ----

var camera, scene, renderer, canvas,ctx,geometry,material;	
var cube, plane, light0,Sphere0, meshL,meshR,cubeL, cubeR;	
	
var wX = 400, wY = 400;   

function ini() {
  initgls(); //setPos(xv,yv,zv); //movsp();
// ------- Jun 2024 -------
const st='Stop Putin,Trump and Netanyahu NOW...!<br>&emsp; The essence of their beliefs is<br>&emsp;&emsp; murder and violence.'

document.getElementById("centered0").innerHTML=st

  document.querySelector("#input").addEventListener("change", function () { handleFiles() } );
  document.querySelector("#loop").addEventListener("click",   function () { chkLoop() } );

  document.querySelector("#xv").addEventListener("change",
        function (e) { e.preventDefault(); changeXV(document.querySelector("#xv").valueAsNumber); });
  document.querySelector("#yv").addEventListener("change",
        function (e) { e.preventDefault(); changeYV(document.querySelector("#yv").valueAsNumber); });
  document.querySelector("#zv").addEventListener("change",
        function (e) { e.preventDefault(); changeZV(document.querySelector("#zv").valueAsNumber); });

  document.getElementById("bass").addEventListener("change",function () { changeBass() },false);
  document.getElementById("treble").addEventListener("change",function () { changeTreble() },false);
  
	//document.getElementById("spv").addEventListener("change",function () { changeSPv() },false); //******
 
}		// ---- end of ini ----

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
		document.getElementById("trebleValue").innerHTML="pos_t = "+ tv;
   		  document.querySelector("#treble").value = tv;
		document.getElementById("bassValue").innerHTML="pos_b = "+ bv;
   		  document.querySelector("#bass").value = bv;	
	}
	else { defpos() }
}

function savefxyz() { 
  var fxyz=Array();
 //  try {
	fxyz[0]=String(xv).substr(0, 5); fxyz[1]=String(yv).substr(0, 5); fxyz[2]=String(zv).substr(0, 5);
	fxyz[3]=String(vol).substr(0, 5); fxyz[4]=String(bv).substr(0, 5); fxyz[5]=String(tv).substr(0, 5);	// -8
	localStorage.setItem(fname, JSON.stringify(fxyz));
		clearInterval( tm ); //console.log(max8k,max12k)		// +++++++++++++++++++++++++
//  } catch(e) {
//    return false; 
//  }	
}

var lp = false;
function chkLoop() { 
  if ( document.getElementById('loop').checked ) { lp = true;  }
  else { lp = false;}
}

function movsp() { 
 var xv2,yv2,zv2;
  xv2 = xv*2; 	zv2=zv*2; yv2=yv*2;
  cubeL.position.setX(-xv2); cubeL.position.setY(yv); cubeL.position.setZ(zv2); 
  cubeR.position.setX(xv2);  cubeR.position.setY(yv); cubeR.position.setZ(zv2); 	
    cubeL.rotation.y=Math.atan(-xv2/zv*0.5); cubeR.rotation.y=Math.atan( xv2/zv*0.5);
    cubeL.rotation.x=Math.atan(-yv/zv*0.1);  cubeR.rotation.x=Math.atan(-yv/zv*0.1);	
 renderer.render( scene, camera ); 
chkLoop();   
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
		setPos( xv, yv, zv ); changeBass(bv); changeTreble(tv);
    showMetaData(document.getElementsByTagName('input')[6].files[fc]);						
    audio.src=src;	audio.autoplay = true;	tm = setInterval( renderA, 16 );
  
    audio.oncanplaythrough  = (event) => {			//onloadeddata
      if ( fc  < flen ) { 
       audio.onended = function() { loadnext(); }
      }

    audio.play(); 		//startPlay();
   };
}

function setProperties( sp ) {
  sp.orientationX.value = 0; 	sp.orientationY.value = 0; 	sp.orientationZ.value = 1;
  sp.rolloffFactor = 0; 	  sp.maxDistance = 10000;	sp.refDistance = 0; 
  sp.panningModel = 'HRTF';  sp.distanceModel = 'linear';
}

function setPan( sp, x,y,z ) {
  sp.positionX.value = x; sp.positionY.value = y; sp.positionZ.value = z;
}

var sx,sy,sz, spv=1.5									//*************
function setPos(x,y,z) {
 var a,b, w,v, lz,dy; 	
  a=1.5; lz = listener.positionZ.value= -z/5; dy = y/( z+lz )*a; //z=(z-2)*16
 //a=1.5; 			a=spv;
 w=x*1.5; v=w+2*x;	//console.log(a,w,v)		//*************
 if (fname) { 
  setPan( pannerL, -x, y, z); setPan( pannerRL, -x, z*dy, z*a ); 	//y*a
  setPan( pannerR,  x, y, z); setPan( pannerRR,  x, z*dy, z*a );	//console.log( x,z*dy, z*a )
			setPan( pannerBL,  -w, z*dy, z*a);		//y*a
			setPan( pannerBR,  -v, z*dy, z*a);		
			setPan( pannerCL,   v, z*dy, z*a);
			setPan( pannerCR,   w, z*dy, z*a);		
  setDelay();
  //};	//sx=-x*a; sy=y*a; sz=z*a;
  }
  movsp();   //if (fname) { setDelay(); };
}

function setDelay() {		// in seconds
  var dr, dv, dw, df, xs,ys,zs, lz, e;
     lz = listener.positionZ.value;
  xs = pannerR.positionX.value; ys = pannerR.positionY.value; zs = pannerR.positionZ.value
    df = Math.sqrt(xs*xs+ys*ys+(zs+lz)*(zs+lz));
  xs = pannerRR.positionX.value; ys = pannerRR.positionY.value; zs = pannerRR.positionZ.value;
    dr = ( Math.sqrt(xs*xs+ys*ys +(zs+lz)*(zs+lz))-df )/340;		// dr
  xs = pannerCR.positionX.value; ys = pannerCR.positionY.value; zs = pannerCR.positionZ.value
	dw = ( Math.sqrt(xs*xs +ys*ys +(zs+lz)*(zs+lz))-df )/340;
  xs = pannerCL.positionX.value; ys = pannerCL.positionY.value; zs = pannerCL.positionZ.value
	dv=  ( Math.sqrt(xs*xs +ys*ys +(zs+lz)*(zs+lz))-df )/340;	
  
	dr=dr*3;dw=dw*2;dv=dv*2; //console.log( df, dr*360,dw*360,dv*360 )
	//delayR.delayTime.value = df/340;	in seconds
	
	delayRL.delayTime.value = dr; delayRR.delayTime.value = dr; 	//rear
	delayBL.delayTime.value = dw; delayBR.delayTime.value = dv;		// dw<dv
	delayCL.delayTime.value = dv; delayCR.delayTime.value = dw; 	// BR-BL L-R CR-CL

}

function defpos() {
 xv=5; yv=2; zv=-10;
 document.getElementById("xValue").innerHTML="pos_x = "+ xv;
  document.querySelector("#xv").value = xv;
 document.getElementById("yValue").innerHTML="pos_y = "+ yv;
  document.querySelector("#yv").value = yv;
 document.getElementById("zValue").innerHTML="pos_z = "+ zv;
  document.querySelector("#zv").value = zv;
		tv = 0; bv = 0
		document.getElementById("trebleValue").innerHTML="pos_t = "+ tv;
   		  document.querySelector("#treble").value = tv;
		document.getElementById("bassValue").innerHTML="pos_b = "+ bv;
   		  document.querySelector("#bass").value = bv;
   //if ( fname ) { setDelay() } 	
 setPos(xv,yv,zv); changeBass(); changeTreble();
}

function changeBass() {
 var bvalue = document.getElementById("bass").valueAsNumber, bvL;
  bv = bvalue; bvL = bv + 2;
  if (fname) {
	bassL.gain.value = bv; bassR.gain.value = bv;
  } 
    document.getElementById("bassValue").innerHTML="bass = "+ bvalue;
}
	
function changeTreble() {
 var tvalue = document.getElementById("treble").valueAsNumber, tvH;
 tv = tvalue; tvH = ( 20-tvalue )/5;	console.log(tv,tvH,tv+tvH)

  if (fname) { 
  	trebleL.gain.value = tv;   trebleR.gain.value = tv;
	trebleLH.gain.value = tvH; trebleRH.gain.value = tvH;
  }
    document.getElementById("trebleValue").innerHTML="treble = "+ tvalue;
}

function changeXV(x) {
  xv = x; 
    document.getElementById("xValue").innerHTML="pos_x = "+ xv;
 setPos( xv, yv, zv );	
}
function changeYV(y) {
  yv = y; 
    document.getElementById("yValue").innerHTML="pos_y = "+ yv;
 setPos( xv, yv, zv ); 
}
function changeZV(z) {	
  zv = z; 
    document.getElementById("zValue").innerHTML="pos_z = "+ zv;
 setPos( xv, yv, zv );
}
//function changeSPv() {	
//	spv = document.getElementById("spv").value; console.log(gainCL.gain.value)
//	document.getElementById("spVal").innerHTML=spv; setPos( xv, yv, zv ) }	//*************

//------------------------- init gl ------------------------------------
function initgls() {

renderer = new THREE.WebGLRenderer({ canvas: tCanvas , alpha: true, antialias: true }); 
renderer.setSize (wX,wY);    
renderer.setClearColor(0x3333ff, 0.5);						// 0x3333cc, 0.1
	canvasB = document.getElementById("canvasB"); ctxB = canvasB.getContext("2d");
	canvasC = document.getElementById("canvasC"); ctxC = canvasC.getContext("2d");
		canvasA = document.getElementById("canvasA"); ctxA = canvasA.getContext("2d");	//+++++++
         
camera = new THREE.PerspectiveCamera (60, 1, 1, 1000);  
camera.position.x=0; camera.position.y=5; camera.position.z=6;   	//z:5
camera.lookAt( {x:0, y:4, z:-500 } ); 				//z:0
      
scene = new THREE.Scene(); scene.add(camera);  //scene.background = new THREE.Color( 0xff0000 );
    
var geometry_sph = new THREE.SphereGeometry (0.7, 36, 36);   	// head      
var material0 = new THREE.MeshLambertMaterial( { color: 0x0088cc } );    
	//Sphere0 = new THREE.Mesh (geometry_sph, material0); 
	//Sphere0.position.x= 0; Sphere0.position.y= 0; Sphere0.position.z= 0; Sphere0.castShadow = true;
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
            color: 0xE0FA03, transparent: true, opacity: 0.75		// color: 0x888888 opacity: 0.7
        })
    );	//color: 0x8888ee
    plane.position.y = 0; plane.rotation.x = -Math.PI / 2;
	var grid = new THREE.GridHelper(100, 50, 0x555555, 0x777777);	//(120, 60, 0x555555, 0x777777)
	//var grid = new THREE.InfiniteGridHelper(120,60,0x777777,100)
    scene.add( plane ); scene.add( grid );

    light0.castShadow = true;
    plane.receiveShadow = true;
    renderer.shadowMap.enabled = true;
   renderer.render( scene, camera ); 		movsp()

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
// ------------- analizer --------------------------------
var fq, cSize = fftSize/2, len=512,	max8k, max12k;	//fftSize = 1024;
	//maxIndex = numArray.indexOf(Math.max(...numArray)); //animals.slice(2, 4)
function renderA() {
  var sL,sR,sLR, dtf,maxL,maxF;
    fq = 0; max8k=0; max12k=0
	 analyserL.getByteFrequencyData(spectrumsL); analyserR.getByteFrequencyData(spectrumsR);
		ctxA.clearRect(0, 220, canvasA.width, 80);
	while ( fq<cSize ) { 		// len=512
     	sL = spectrumsL[fq]; sR = spectrumsR[fq]; sLR = Math.floor( ( sL+sR )/20 )
			//if ( fq<128 && sLR>max8k ) { max8k = sLR } //fq*dt }
			//if ( fq>128 && sLR>max12k ) { max12k = sLR } //fq*dt }
		hue = fq/len * 360; ctxA.strokeStyle = 'hsl(' + hue + ',100%, 65%)';
			 ctxA.strokeRect( fq+72, 300, 1, -sLR);
		fq++;	
   } 	
}
