import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// GLTFExporter expects browser FileReader; polyfill for Node.
class NodeFileReader {
  result = null;
  onloadend = null;
  onerror = null;

  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer())
      .then((buffer) => {
        this.result = buffer;
        this.onloadend?.({ target: this });
      })
      .catch((err) => {
        this.onerror?.(err);
      });
  }
}

globalThis.FileReader = NodeFileReader;

const outDir = join(dirname(fileURLToPath(import.meta.url)), '../public/models');
mkdirSync(outDir, { recursive: true });

// Real-world sofa ~2.2m wide, 0.9m deep, ~0.85m tall. Floor at y=0.
const couch = new THREE.Group();
couch.name = 'Couch';

const fabric = new THREE.MeshStandardMaterial({
  color: 0x5c6b7a,
  roughness: 0.85,
  metalness: 0.05,
});
const wood = new THREE.MeshStandardMaterial({
  color: 0x3a2a1f,
  roughness: 0.7,
  metalness: 0.1,
});

function box(w, h, d, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  couch.add(mesh);
}

box(2.2, 0.12, 0.9, wood, 0, 0.18, 0);
box(2.05, 0.16, 0.72, fabric, 0, 0.32, 0.04);
box(2.05, 0.52, 0.18, fabric, 0, 0.58, -0.32);
box(0.14, 0.42, 0.9, fabric, -1.03, 0.45, 0);
box(0.14, 0.42, 0.9, fabric, 1.03, 0.45, 0);

const legY = 0.06;
const legInsetX = 0.95;
const legInsetZ = 0.35;
for (const [lx, lz] of [
  [-legInsetX, -legInsetZ],
  [legInsetX, -legInsetZ],
  [-legInsetX, legInsetZ],
  [legInsetX, legInsetZ],
]) {
  box(0.08, 0.12, 0.08, wood, lx, legY, lz);
}

couch.updateMatrixWorld(true);

const exporter = new GLTFExporter();
const gltf = await exporter.parseAsync(couch, {
  binary: true,
  onlyVisible: true,
});

const buffer = Buffer.from(gltf);
const outPath = join(outDir, 'couch.glb');
writeFileSync(outPath, buffer);
console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
