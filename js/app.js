const generalSettings = {
	opacity: .5,
	speed: .000004,
	transformIntencity: 10,
	transformScale: .2,
	dotSize: .2,
	dotAmount: 80,
	fogIntencity: 35,
	position: {
		x: 20,
		y: -5,
		z: 15
	}
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

	container = document.getElementById("container");

	scene = new THREE.Scene();

	const fogColor = "rgb(65,65,65)";
	scene.fog = new THREE.Fog(fogColor, 0, generalSettings.fogIntencity);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 50; // 70

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
			color1: {
				type: "c",
				value: new THREE.Color(0xffffff),
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

	// transparency
	material.transparent = true;
	// material.lights = true;


	mesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry(20, 4),
		material
	);
	scene.add(mesh);
	mesh.position.set(generalSettings.position.x, generalSettings.position.y, generalSettings.position.z);
	rotateObject(mesh, -10, 160, 10);

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	renderer.setClearColor(scene.fog.color);

	container.appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	onWindowResize();
	window.addEventListener('resize', onWindowResize);

	render();

});

function onWindowResize() {

	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

function render() {

	const speedFactor = generalSettings.speed;

	material.uniforms['time'].value = speedFactor * (Date.now() - start);

	renderer.render(scene, camera);
	requestAnimationFrame(render);

}