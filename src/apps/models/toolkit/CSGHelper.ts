import * as THREE from 'three';
import { SUBTRACTION, ADDITION, INTERSECTION, Brush, Evaluator } from 'three-bvh-csg';

const evaluator = new Evaluator();
evaluator.useGroups = true;

/**
 * Performs a boolean subtraction (A minus B).
 * Used for carving holes, windows, tree hollows, dents, and joints.
 */
export function csgSubtract(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  meshA.updateMatrixWorld(true);
  meshB.updateMatrixWorld(true);

  const brushA = new Brush(meshA.geometry, meshA.material);
  brushA.matrix.copy(meshA.matrixWorld);
  brushA.matrixAutoUpdate = false;

  const brushB = new Brush(meshB.geometry, meshB.material);
  brushB.matrix.copy(meshB.matrixWorld);
  brushB.matrixAutoUpdate = false;

  const result = evaluator.evaluate(brushA, brushB, SUBTRACTION);
  return result;
}

/**
 * Performs a boolean union (A merged with B cleanly without interior faces).
 */
export function csgUnion(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  meshA.updateMatrixWorld(true);
  meshB.updateMatrixWorld(true);

  const brushA = new Brush(meshA.geometry, meshA.material);
  brushA.matrix.copy(meshA.matrixWorld);
  brushA.matrixAutoUpdate = false;

  const brushB = new Brush(meshB.geometry, meshB.material);
  brushB.matrix.copy(meshB.matrixWorld);
  brushB.matrixAutoUpdate = false;

  const result = evaluator.evaluate(brushA, brushB, ADDITION);
  return result;
}

/**
 * Performs a boolean intersection (Volume common to both A and B).
 */
export function csgIntersect(meshA: THREE.Mesh, meshB: THREE.Mesh): THREE.Mesh {
  meshA.updateMatrixWorld(true);
  meshB.updateMatrixWorld(true);

  const brushA = new Brush(meshA.geometry, meshA.material);
  brushA.matrix.copy(meshA.matrixWorld);
  brushA.matrixAutoUpdate = false;

  const brushB = new Brush(meshB.geometry, meshB.material);
  brushB.matrix.copy(meshB.matrixWorld);
  brushB.matrixAutoUpdate = false;

  const result = evaluator.evaluate(brushA, brushB, INTERSECTION);
  return result;
}
