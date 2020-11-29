window.addEventListener( 'load', init );
window.addEventListener( 'mousemove', onMouseMove );
// window.addEventListener( 'mousedown', onMouseDown );
// window.addEventListener( 'mouseup', onMouseUp );
window.addEventListener( 'click', onMouseClick );
window.addEventListener( 'resize', onWindowResize, false );

const xAxis = new THREE.Vector3(1,0,0);
const yAxis = new THREE.Vector3(0,1,0);
const zAxis = new THREE.Vector3(0,0,1);

const loader = new THREE.TextureLoader();
const marbleTex = loader.load('textures/sprite.png', createMarbles);
const boardTex = loader.load('textures/hardwood.jpg');

var closest = null;
var	mouse = new THREE.Vector2(0, 0);
var containter, renderer, scene, camera, controls, stats;
var worker, raycaster;
var board = null;
var marbles = [ ];
var marbleMat = [ new THREE.SpriteMaterial({ color: 0x00ff00 }),
                  new THREE.SpriteMaterial({ color: 0xff0000 }),
                  new THREE.SpriteMaterial({ color: 0x0000ff }),
                  new THREE.SpriteMaterial({ color: 0xff00ff })
                ];

var selectedMarble = null;
var selectedHole = null;


function init() {
  // Obatain the DOM element handle for the main display area
  container = document.getElementById( 'container' );

  // Create the THREE.js renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
  
  // Create a THREE.js scene
  scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );
  
  // Instantiate the main camera view
  //camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 4000 );
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.up.set(0,0,1);
  camera.position.set(0, 0, 25);
  scene.add( camera );

  // Add ambient light
	scene.add( new THREE.AmbientLight( 0x888888 ) );
  // Add spotlight
	// var light = new THREE.SpotLight( 0xffffff, 1.5 );
	// light.position.set( 200, 400, 300 );
  // Use light to cast shadows
	// light.castShadow = true;
	// scene.add( light );
  

  // Instantiate the controls needed to manipulate the main camera view
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.damping = 0.2;
  controls.addEventListener( 'change', render );

  // Create a FPS widget
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top  = '0px';
  stats.domElement.style.left = '0px';
  container.appendChild( stats.domElement );

  // Create the assets to be rendered in the scene
  createAssets();

  // Launch the primary worker thread
  // launchWorker();

  // Begin the main display loop
  animate();
}

function createAssets() {
  // Ground Plane
	var planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
	var planeMaterial = new THREE.ShadowMaterial( { opacity: 0.2 } );
	var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.position.y = 0;
	plane.receiveShadow = true;
	scene.add( plane );
  
	var helper = new THREE.GridHelper( 2000, 100 );
	helper.rotateX( - Math.PI / 2 );
	helper.material.opacity = 0.25;
	helper.material.transparent = true;
	scene.add( helper );
  
	var axis = new THREE.AxesHelper();
	axis.position.set( -500, -500, -500 );
	scene.add( axis );
  
	raycaster = new THREE.Raycaster();

  board = new Board();
  scene.add( board );
    
  for (let j=0; j<marbles.length; ++j) {
    for (let i=0; i<marbles[j].length; ++i) {
      scene.add(marbles[j][i]);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function launchWorker() {
  if (window.Worker && typeof(worker) == "undefined") {
    worker = new Worker("js/worker.js");
    worker.addEventListener( 'message', onWorkerMessage, false );
    // worker.postMessage({ numNodes: cortex.numNodes,
    //                      sparsity: cortex.sparsity });
  }   
}

function onWorkerMessage(e) {
  // console.log("Main: " + e.data.nodes);
  // var nodes = [];
  // e.data.nodes.forEach( function(n) {
  //   nodes.push(cortex.children[n]);
  // });
  // cortex.update({activeNodes: nodes});
}

function onMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
  closest = null;
	for (let j=0; j<marbles.length; ++j) {
    for (let i=0; i<marbles[j].length; ++i) {
      const obj = marbles[j][i];
      if (obj.lit && !obj.selected) {
        obj.material = marbleMat[j];
        obj.lit = false;
      }
      raycaster.intersectObject(obj).forEach( function(arg) {
        closest = (closest && closest.distance < arg.distance ? closest : arg);
      } );
    }
  }
  board.children.forEach( function(obj) {
    if (obj.lit && !obj.selected) {
      obj.material = holeMat;
      obj.lit = false;
    }
    raycaster.intersectObject(obj).forEach( function(arg) {
      closest = (closest && closest.distance < arg.distance ? closest : arg);
    } );
  } );
	if ( closest && closest.object ) {
    closest.object.lit = true;
    if (closest.object.type == "Sprite") {
	    closest.object.material = marbleMat[4];
    }
    else if (closest.object.type == "Mesh") {
	    closest.object.material = holeLit;
    }
	}
}

function onMouseClick( event ) {
	if ( closest && closest.object ) {
    var obj = closest.object;
    obj.selected = !obj.selected;
    if (obj.type == "Sprite") {
      selectedMarble = obj;
    }
    else if (obj.type == "Mesh") {
      selectedHole = obj;
      if (selectedMarble) {
        selectedMarble.position.x = selectedHole.position.x;
        selectedMarble.position.y = -selectedHole.position.z;
        selectedMarble.position.z = selectedHole.position.y+0.5;
        selectedMarble.selected = false;
        selectedMarble = null;
        selectedHole.selected = false;
        selectedHole = null;
      }
    }
	}
}

function onMouseDown( event ) {
	if ( closest && closest.object ) {
    closest.object.selected = true;
	}
}

function onMouseUp( event ) {
	if ( closest && closest.object ) {
    closest.object.selected = false;
	}
}

function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}

var clock = new THREE.Clock();
function render() {
  renderer.render( scene, camera );
}

