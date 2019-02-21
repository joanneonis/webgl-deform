const generalSettings = {
	opacity: .5,
	speed: .04,
	transformIntencity: 10,
	transformScale: .2,
	dotSize: .2,
	dotAmount: 80,
	fogIntencity: 35,
	position: {
		x: 20,
		y: -5,
		z: 15
	},
	bgColor: "rgb(65,65,65)"
};

var
	container,
	renderer,
	scene,
	camera,
	mesh,
	material,
	start = Date.now(),
	fov = 30;


function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
	object.rotateX(THREE.Math.degToRad(degreeX));
	object.rotateY(THREE.Math.degToRad(degreeY));
	object.rotateZ(THREE.Math.degToRad(degreeZ));
}

window.addEventListener('load', function () {

	// container for canvas element
	container = document.getElementById("container");

	// scene to draw upon
	scene = new THREE.Scene();

	// fog settings
	const fogColor = generalSettings.bgColor;
	scene.fog = new THREE.Fog(fogColor, 0, generalSettings.fogIntencity);

	// camera settings
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 50; // 70

	// material options
	material = new THREE.ShaderMaterial({
		uniforms: {
			transformScale: {
				type: 'f',
				value: generalSettings.transformScale,
			},
			transformIntencity: {
				type: 'f',
				value: generalSettings.transformIntencity,
			},
			opacity: {
				type: 'f',
				value: generalSettings.opacity,
			},
			opacity2: {
				type: 'f',
				value: 0,
			},
			radius1: {
				type: "f",
				value: generalSettings.dotSize,
			},
			radius2: {
				type: "f",
				value: generalSettings.dotSize,
			},
			amount: {
				type: "f",
				value: generalSettings.dotAmount,
			},
			time: {
				type: "f",
				value: 0.0
			},
			fogColor: {
				type: "c",
				value: scene.fog.color
			},
			fogNear: {
				type: "f",
				value: scene.fog.near
			},
			fogFar: {
				type: "f",
				value: scene.fog.far
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		fog: true,
	});

	// enable transparency in the material
	material.transparent = true;

	// init sphere with materialoptions
	mesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry(20, 4),
		material
	);
	scene.add(mesh);
	mesh.position.set(generalSettings.position.x, generalSettings.position.y, generalSettings.position.z);
	rotateObject(mesh, -10, 160, 10);

	// init rendering
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(scene.fog.color);
	container.appendChild(renderer.domElement);

	// TODO orbitcontrols (only for testing)
	// var controls = new THREE.OrbitControls(camera, renderer.domElement);

	onWindowResize();
	window.addEventListener('resize', onWindowResize);

	render();
});

// responsiveness
function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function render() {
	// set time/speed for materials
	const speedFactor = generalSettings.speed;
	material.uniforms['time'].value = speedFactor * (Date.now() - start);

	// render & animate
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
