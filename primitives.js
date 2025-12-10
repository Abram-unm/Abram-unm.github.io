//cube
const positionsCube = new Float32Array([
      -1, -1, -1,  // 0
       1, -1, -1,  // 1
       1,  1, -1,  // 2
      -1,  1, -1,  // 3
      -1, -1,  1,  // 4
       1, -1,  1,  // 5
       1,  1,  1,  // 6
      -1,  1,  1   // 7
    ]);

const colorsCube = new Float32Array([
  0,1,0,  0,1,0,  0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0
]);

const colorsAltOneCube = new Float32Array([
  0.6,0.3,0,  0.6,0.3,0,  0.6,0.3,0, 0.6,0.3,0, 0.6,0.3,0, 0.6,0.3,0, 0.6,0.3,0, 0.6,0.3,0
]);

const colorsAltTwoCube = new Float32Array([
  1,0,0,  1,0,0,  1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0
]);

const indicesCube = new Uint16Array([
  // Front
  4, 5, 6,   4, 6, 7,
  // Back
  1, 0, 3,   1, 3, 2,
  // Top
  3, 7, 6,   3, 6, 2,
  // Bottom
  0, 1, 5,   0, 5, 4,
  // Right
  1, 2, 6,   1, 6, 5,
  // Left
  0, 4, 7,   0, 7, 3,
]);

const texCube = new Float32Array([
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0,
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0,
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0,
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0,
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0,
  0.0, 0.0,   1.0, 0.0,  1.0, 1.0,   0.0, 1.0
]);

const normalsCube = new Float32Array(positionsCube.length);
for ( let i = 0; i <= indicesCube.length - 3; i+=3 ){
  const vertexOne = indicesCube[i];
  const vertexTwo = indicesCube[i + 1];
  const vertexThree = indicesCube[i + 2];

  const vertexOnePoints = new Float32Array([positionsCube[vertexOne * 3], positionsCube[(vertexOne * 3) + 1], positionsCube[(vertexOne * 3) + 2]]);
  const vertexTwoPoints = new Float32Array([positionsCube[vertexTwo * 3], positionsCube[(vertexTwo * 3) + 1], positionsCube[(vertexTwo * 3) + 2]]);
  const vertexThreePoints = new Float32Array([positionsCube[vertexThree * 3], positionsCube[(vertexThree * 3) + 1], positionsCube[(vertexThree * 3) + 2]]);

  const edge1 = [vertexOnePoints[0] - vertexTwoPoints[0], vertexOnePoints[1] - vertexTwoPoints[1], vertexOnePoints[2] - vertexTwoPoints[2]];
  const edge2 = [vertexTwoPoints[0] - vertexThreePoints[0], vertexTwoPoints[1] - vertexThreePoints[1], vertexTwoPoints[2] - vertexThreePoints[2]];

  // Now cross-product
  const normalX = edge1[1] * edge2[2] - edge1[2] * edge2[1];
  const normalY = edge1[2] * edge2[0] - edge1[0] * edge2[2];
  const normalZ = edge1[0] * edge2[1] - edge1[1] * edge2[0];

  const normalizeScaler = Math.sqrt((normalX * normalX) + (normalY * normalY) + (normalZ * normalZ));
  const normX = normalX / normalizeScaler;
  const normY = normalY / normalizeScaler;
  const normZ = normalZ / normalizeScaler;
  // Assign normals for first vertex
  normalsCube[vertexOne * 3] = normX;
  normalsCube[(vertexOne * 3) + 1] = normY;
  normalsCube[(vertexOne * 3) + 2] = normZ;
  // Assign normals for second vertex
  normalsCube[vertexTwo * 3] = normX;
  normalsCube[(vertexTwo * 3) + 1] = normY;
  normalsCube[(vertexTwo * 3) + 2] = normZ;
  // Assign normals for third vertex
  normalsCube[vertexThree * 3] = normX;
  normalsCube[(vertexThree * 3) + 1] = normY;
  normalsCube[(vertexThree * 3) + 2] = normZ;
}


// prism
const positionsPrism = new Float32Array([
  -1,   -1, -1,  // 0
   1,   -1, -1,  // 1
   1,    1, -1,  // 2
  -1,    1, -1,  // 3
   0.5, -1,  1,  // 4
   0.5,  1,  1,  // 5
]);

const colorsPrism = new Float32Array([
  0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1
]);

const indicesPrism = new Uint16Array([
  // Front
  3, 2, 5,
  // Back
  0, 1, 4,
  // Bottom
  0, 1, 2,   0, 3, 2,
  // Right
  1, 2, 5,   1, 4, 5,
  // Left
  0, 3, 5,   0, 4, 5,
]);

// This is a dummy shape for normals, i.e. filled with values just for the gpu to have something
const normalsPrism = new Float32Array(positionsPrism.length);
for ( let i = 0; i <= indicesPrism.length - 3; i+=3 ){
  const vertexOne = indicesPrism[i];
  const vertexTwo = indicesPrism[i + 1];
  const vertexThree = indicesPrism[i + 2];

  // Assign normals for first vertex
  normalsPrism[vertexOne * 3] = 0;
  normalsPrism[(vertexOne * 3) + 1] = 0;
  normalsPrism[(vertexOne * 3) + 2] = 1;
  // Assign normals for second vertex
  normalsPrism[vertexTwo * 3] = 0;
  normalsPrism[(vertexTwo * 3) + 1] = 0;
  normalsPrism[(vertexTwo * 3) + 2] = 1;
  // Assign normals for third vertex
  normalsPrism[vertexThree * 3] = 0;
  normalsPrism[(vertexThree * 3) + 1] = 0;
  normalsPrism[(vertexThree * 3) + 2] = 1;
}


// cylinder
const positionsCylinder = new Float32Array([
  // bottom
  -1,                   0,                  -1, // 0
  -Math.pow(3, 0.5)/2, -1/2,                -1, // 1
  -Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2, -1, // 2
  -1/2,                -Math.pow(3, 0.5)/2, -1, // 3
   0,                  -1,                  -1, // 4
   1/2,                -Math.pow(3, 0.5)/2, -1, // 5
   Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2, -1, // 6
   Math.pow(3, 0.5)/2, -1/2,                -1, // 7
   1,                   0,                  -1, // 8
   Math.pow(3, 0.5)/2,  1/2,                -1, // 9
   Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2, -1, // 10
   1/2,                 Math.pow(3, 0.5)/2, -1, // 11
   0,                   1,                  -1, // 12
  -1/2,                 Math.pow(3, 0.5)/2, -1, // 13
  -Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2, -1, // 14
  -Math.pow(3, 0.5)/2,  1/2,                -1, // 15
  // top
  -1,                   0,                   1, // 16
  -Math.pow(3, 0.5)/2, -1/2,                 1, // 17
  -Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2,  1, // 18
  -1/2,                -Math.pow(3, 0.5)/2,  1, // 19
   0,                  -1,                   1, // 20
   1/2,                -Math.pow(3, 0.5)/2,  1, // 21
   Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2,  1, // 22
   Math.pow(3, 0.5)/2, -1/2,                 1, // 23
   1,                   0,                   1, // 24
   Math.pow(3, 0.5)/2,  1/2,                 1, // 25
   Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2,  1, // 26
   1/2,                 Math.pow(3, 0.5)/2,  1, // 27
   0,                   1,                   1, // 28
  -1/2,                 Math.pow(3, 0.5)/2,  1, // 29
  -Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2,  1, // 30
  -Math.pow(3, 0.5)/2,  1/2,                 1, // 31
  // centers
  0,                    0,                  -1, //32
  0,                    0,                   1  //33
]);

const colorsCylinder = new Float32Array([
  1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0,
  1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0,
  1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0,
  1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0,
  1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0
]);

const indicesCylinder = new Uint16Array([
  // Front
  0,   1, 32,    1,  2, 32,    2,  3, 32,    3,  4, 32,
  4,   5, 32,    5,  6, 32,    6,  7, 32,    7,  8, 32,
  8,   9, 32,    9, 10, 32,   10, 11, 32,   11, 12, 32,
  12, 13, 32,   13, 14, 32,   14, 15, 32,   15,  0, 32,
  // Back
  16, 17, 33,   17, 18, 33,   18, 19, 33,   19, 20, 33,
  20, 21, 33,   21, 22, 33,   22, 23, 33,   23, 24, 33,
  24, 25, 33,   25, 26, 33,   26, 27, 33,   27, 28, 33,
  28, 29, 33,   29, 30, 33,   30, 31, 33,   31, 16, 33,
  // Side 1
  0, 1, 16,     1, 17, 16,
  // Side 
  1, 2, 17,     2, 18, 17,
  // Side 3
  2, 3, 18,     3, 19, 18,
  // Side 4
  3, 4, 19,     4, 20, 19,
  // Side 5
  4, 5, 20,     5, 21, 20,
  // Side 6
  5, 6, 21,     6, 22, 21,
  // Side 7
  6, 7, 22,     7, 23, 22,
  // Side 8
  7, 8, 23,     8, 24, 23,
  // Side 9
  8, 9, 24,     9, 25, 24,
  // Side 10
  9, 10, 25,    10, 26, 25,
  // Side 11
  10, 11, 26,   11, 27, 26,
  // Side 12
  11, 12, 27,   12, 28, 27,
  // Side 13
  12, 13, 28,   13, 29, 28,
  // Side 14
  13, 14, 29,   14, 30, 29,
  // Side 15
  14, 15, 30,   15, 31, 30,
  // Side 16
  15, 0, 31,    0, 16, 31
]);

// This is a dummy shape for normals, i.e. filled with values just for the gpu to have something
const normalsCylinder = new Float32Array(positionsCylinder.length);
for ( let i = 0; i <= indicesCylinder.length - 3; i+=3 ){
  const vertexOne = indicesCylinder[i];
  const vertexTwo = indicesCylinder[i + 1];
  const vertexThree = indicesCylinder[i + 2];

  // Assign normals for first vertex
  normalsCylinder[vertexOne * 3] = 0;
  normalsCylinder[(vertexOne * 3) + 1] = 0;
  normalsCylinder[(vertexOne * 3) + 2] = 1;
  // Assign normals for second vertex
  normalsCylinder[vertexTwo * 3] = 0;
  normalsCylinder[(vertexTwo * 3) + 1] = 0;
  normalsCylinder[(vertexTwo * 3) + 2] = 1;
  // Assign normals for third vertex
  normalsCylinder[vertexThree * 3] = 0;
  normalsCylinder[(vertexThree * 3) + 1] = 0;
  normalsCylinder[(vertexThree * 3) + 2] = 1;
}

// cone
// 17 sides means 18 points
const positionsCone = new Float32Array([
  // bottom
  -1,                   0,                  -1, // 0
  -Math.pow(3, 0.5)/2, -1/2,                -1, // 1
  -Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2, -1, // 2
  -1/2,                -Math.pow(3, 0.5)/2, -1, // 3
   0,                  -1,                  -1, // 4
   1/2,                -Math.pow(3, 0.5)/2, -1, // 5
   Math.pow(2, 0.5)/2, -Math.pow(2, 0.5)/2, -1, // 6
   Math.pow(3, 0.5)/2, -1/2,                -1, // 7
   1,                   0,                  -1, // 8
   Math.pow(3, 0.5)/2,  1/2,                -1, // 9
   Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2, -1, // 10
   1/2,                 Math.pow(3, 0.5)/2, -1, // 11
   0,                   1,                  -1, // 12
  -1/2,                 Math.pow(3, 0.5)/2, -1, // 13
  -Math.pow(2, 0.5)/2,  Math.pow(2, 0.5)/2, -1, // 14
  -Math.pow(3, 0.5)/2,  1/2,                -1, // 15
  // centers
  0,                    0,                  -1, //16
  0,                    0,                   1  //17
]);

const colorsCone = new Float32Array([
  1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
  1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
  1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
]);

const indicesCone = new Uint16Array([
  // Front
   0,  1, 17,   1,  2, 17,   2,  3, 17,   3,  4, 17,
   4,  5, 17,   5,  6, 17,   5,  6, 17,   6,  7, 17,
   7,  8, 17,   8,  9, 17,   9, 10, 17,  10, 11, 17,
  11, 12, 17,  12, 13, 17,  13, 14, 17,  14, 15, 17,
  15,  0, 17,
  // Bottom
   0,  1, 16,   1,  2, 16,   2,  3, 16,   3,  4, 16,
   4,  5, 16,   5,  6, 16,   5,  6, 16,   6,  7, 16,
   7,  8, 16,   8,  9, 16,   9, 10, 16,  10, 11, 16,
  11, 12, 16,  12, 13, 16,  13, 14, 16,  14, 15, 16,
  15,  0, 16,
]);

// This is a dummy shape for normals, i.e. filled with values just for the gpu to have something
const normalsCone = new Float32Array(positionsCone.length);
for ( let i = 0; i <= indicesCone.length - 3; i+=3 ){
  const vertexOne = indicesCone[i];
  const vertexTwo = indicesCone[i + 1];
  const vertexThree = indicesCone[i + 2];

  // Assign normals for first vertex
  normalsCone[vertexOne * 3] = 0;
  normalsCone[(vertexOne * 3) + 1] = 0;
  normalsCone[(vertexOne * 3) + 2] = 1;
  // Assign normals for second vertex
  normalsCone[vertexTwo * 3] = 0;
  normalsCone[(vertexTwo * 3) + 1] = 0;
  normalsCone[(vertexTwo * 3) + 2] = 1;
  // Assign normals for third vertex
  normalsCone[vertexThree * 3] = 0;
  normalsCone[(vertexThree * 3) + 1] = 0;
  normalsCone[(vertexThree * 3) + 2] = 1;
}


// sphere
const indicesTemp = [];
const positionsTemp = [];
const colorsTemp = [];
const altColorsTemp = [];
const texTemp = [];
let vSteps = 32;
let uSteps = 32;
let r = 1;
for ( let i = 0; i <= vSteps; i++ ){
  const v = i * Math.PI / vSteps;
  const sinv = Math.sin( v );
  const cosv = Math.cos( v );

  for ( let j = 0; j <= uSteps; j++ ){
    const u = j * 2 * Math.PI / uSteps;
    const sinu = Math.sin( u );
    const cosu = Math.cos( u );
    const x = cosu * sinv;
    const y = cosv;
    const z = sinu * sinv;

    positionsTemp.push( r * x, r * y, r * z );
    colorsTemp.push( 1, 0, 1 );
    altColorsTemp.push( 0, 1, 1 );
    texTemp.push(u/uSteps, 1 - (v/vSteps));
  }
}

for ( let i = 0; i < vSteps; i++ ){
  for ( let j = 0; j < uSteps; j++ ){
    const k1 = ( i * ( uSteps + 1 ) ) + j;
    const k2 = k1 + uSteps + 1;
    indicesTemp.push( k1, k2, k1 + 1 );
    indicesTemp.push( k2, k2 + 1, k1 + 1 );
  }
}

const indicesSphere = new Uint16Array(indicesTemp);
const positionsSphere = new Float32Array(positionsTemp);
const colorsSphere = new Float32Array(colorsTemp);
const altSphereColors = new Float32Array(altColorsTemp);
const texSphere = new Float32Array(texTemp);

const normalsSphere = new Float32Array(positionsSphere.length);

for ( let i = 0; i <= positionsSphere.length - 3; i+=3 ){
  const normalX = positionsSphere[i];
  const normalY = positionsSphere[i + 1];
  const normalZ = positionsSphere[i + 2];

  const normalizeScaler = Math.sqrt((normalX * normalX) + (normalY * normalY) + (normalZ * normalZ));
  // Assign normals for vertex
  normalsSphere[i] = normalX / normalizeScaler;
  normalsSphere[i + 1] = normalY / normalizeScaler;
  normalsSphere[i + 2] = normalZ / normalizeScaler;
}



const shapes = [
  {
    ind: 0,
    positions: positionsCube,
    colors: colorsCube,
    indices: indicesCube,
    translation: [-1, -1, 0],
    scale: [0.3, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 1],
    rotation: [0, 0],
    offset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    normals: normalsCube,
    tex: texCube,
  },
  {
    ind: 1,
    positions: positionsSphere,
    colors: colorsSphere,
    indices: indicesSphere,
    translation: [0, 0, 0],
    scale: [0.4, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 1],
    rotation: [0, 0],
    offset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -0.5, 1],
    normals: normalsSphere,
    tex: texSphere,
  },
  {
    ind: 2,
    positions: positionsSphere,
    colors: altSphereColors,
    indices: indicesSphere,
    translation: [0, 0, 0],
    scale: [0.2, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 1],
    rotation: [0, 0],
    offset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -0.5, 1],
    normals: normalsSphere,
    tex: texSphere,
  },
  {
    ind: 3,
    positions: positionsCube,
    colors: colorsAltOneCube,
    indices: indicesCube,
    translation: [-1, -1, 0],
    scale: [100, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 100, 0, 0, 0, 0, 1],
    rotation: [0, 0],
    offset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    normals: normalsCube,
    tex: texCube,
  },
  {
    ind: 4,
    positions: positionsCube,
    colors: colorsAltTwoCube,
    indices: indicesCube,
    translation: [-1, -1, 0],
    scale: [100, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 1],
    rotation: [0, 0],
    offset: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    normals: normalsCube,
    tex: texCube,
  },
];
