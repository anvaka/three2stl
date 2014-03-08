/**
 * Exports three.js scene into stl format (stereo lithography)
 * This file is based on work of viktor kovács (http://kovacsv.hu/)
 *
 * @author Andrei Kashcha
 */
module.exports = {
  scene: exportScene,
  meshes: exportMeshes
};

function exportScene(scene) {
  var meshes = [];
  scene.traverse (function (obj) {
    if (obj instanceof THREE.Mesh) meshes.push (obj);
  });

  return exportMeshes(meshes);
}

function exportMeshes(meshes) {
  var result = [];
  add('solid exported');

  var i, j, mesh, geometry, face, matrix, position;
  var normal, vertex1, vertex2, vertex3;

  for (i = 0; i < meshes.length; i++) {
    mesh = meshes[i];

    geometry = mesh.geometry;
    matrix = mesh.matrix;

    for (j = 0; j < geometry.faces.length; j++) {
      face = geometry.faces[j];
      normal = face.normal;
      vertex1 = getTransformedPosition(geometry.vertices[face.a], matrix);
      vertex2 = getTransformedPosition(geometry.vertices[face.b], matrix);
      vertex3 = getTransformedPosition(geometry.vertices[face.c], matrix);
      addTriangle(normal, vertex1, vertex2, vertex3);
    }
  }

  add('endsolid exported');

  return result.join('\n');

  function add(line) {
    result.push(line);
  }

  function addTriangle(normal, vertex1, vertex2, vertex3) {
    add('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
    add('\t\touter loop');
    add('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
    add('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
    add('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
    add('\t\tendloop');
    add('\tendfacet');
  }

  function getTransformedPosition(vertex, matrix) {
    var result = vertex.clone();
    if (matrix !== undefined) {
      result.applyMatrix4(matrix);
    }

    return result;
  }
}
