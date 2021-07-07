import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // To move the camera in the scrren

// Basic needed objects to start with the project
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true // Remove the edgy from the spheres
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)

camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 })
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

// Make light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xFFFFFF)

scene.add(pointLight, ambientLight)

// Light helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, renderer.domElement) // Stop ontroling the camera with the mouse

// Add stars in the background
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}

Array(400).fill().forEach(addStar) // Specify how many stars in the background

// Load image as a background
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture

// Add an avatar
const shazamTexture = new THREE.TextureLoader().load('shazam.png')
const shazam = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: shazamTexture })
)

scene.add(shazam)

// Add a moon in bakcground
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)

scene.add(moon)

// Change hte position of the moon and shazam
moon.position.z = 30
moon.position.setX(-10)

shazam.position.z = -5
shazam.position.x = 2

// Function to move the camera while scrolling with mouse
function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  shazam.rotation.y += 0.01
  shazam.rotation.z += 0.01

  camera.position.z = t * -0.01
  camera.position.x = t * -0.0002
  camera.rotation.y = t * -0.0002
}

document.body.onscroll = moveCamera
moveCamera()

// Animation loop
function animate() {
  requestAnimationFrame( animate )

  // To make the tour aimate
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  //controls.update() this will make the camera stable and doesn't move.

  renderer.render(scene, camera)
}

animate()