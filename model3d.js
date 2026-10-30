import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const ORIENTATION_CORRECTION_X_DEGREES = 0;
const ORIENTATION_CORRECTION_Z_DEGREES = 0;
const MODEL_PATH = 'inktober.glb';

const canvas = document.getElementById('model3dCanvas');
const container = document.getElementById('model3dItem');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const EXPOSURE_STOPS_EV = 0.8;
renderer.toneMappingExposure = Math.pow(10, EXPOSURE_STOPS_EV);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const cameraLight = new THREE.DirectionalLight(0xffffff, 1.4);
camera.add(cameraLight);
cameraLight.position.set(0, 0, 1);
scene.add(camera);

const sideLight = new THREE.DirectionalLight(0xffffff, 1.1);
sideLight.position.set(4, 2, -2);
scene.add(sideLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
rimLight.position.set(-3, -1, -4);
scene.add(rimLight);

const spinPivot = new THREE.Group();
scene.add(spinPivot);

function ensureLitMaterial(originalMaterial) {
  if (originalMaterial.isMeshStandardMaterial || originalMaterial.isMeshPhysicalMaterial) {
    return originalMaterial;
  }

  return new THREE.MeshStandardMaterial({
    color: originalMaterial.color ? originalMaterial.color.clone() : new THREE.Color(0xcccccc),
    map: originalMaterial.map || null,
    transparent: originalMaterial.transparent,
    opacity: originalMaterial.opacity,
    side: originalMaterial.side,
    roughness: 0.6,
    metalness: 0.1
  });
}

const MODEL_TARGET_SIZE = 2.0;

const loader = new GLTFLoader();
loader.load(
  MODEL_PATH,
  (gltf) => {
    const model = gltf.scene;

    model.traverse((child) => {
      if (!child.isMesh) return;

      child.geometry.computeVertexNormals();

      if (Array.isArray(child.material)) {
        child.material = child.material.map(ensureLitMaterial);
      } else {
        child.material = ensureLitMaterial(child.material);
      }
    });

    model.rotation.set(0, 0, 0);
    model.rotation.x = THREE.MathUtils.degToRad(ORIENTATION_CORRECTION_X_DEGREES);
model.rotation.z = THREE.MathUtils.degToRad(ORIENTATION_CORRECTION_Z_DEGREES);
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_TARGET_SIZE / maxDimension;

    model.position.sub(center);
    model.scale.setScalar(scale);

    spinPivot.add(model);
  },
  undefined,
  (error) => console.error('3D model failed to load:', error)
);

function resizeRenderer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width === 0 || height === 0) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(resizeRenderer);
resizeObserver.observe(container);
resizeRenderer();

const clock = new THREE.Clock();
const ROTATION_SPEED_RADIANS_PER_SECOND = 0.6;
const WORLD_UP_AXIS = new THREE.Vector3(0, 1, 0);

function animate() {
  requestAnimationFrame(animate);
  const deltaSeconds = clock.getDelta();
  spinPivot.rotateOnWorldAxis(WORLD_UP_AXIS, ROTATION_SPEED_RADIANS_PER_SECOND * deltaSeconds);
  renderer.render(scene, camera);
}
animate();