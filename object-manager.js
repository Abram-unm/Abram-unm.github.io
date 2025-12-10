function createObject(geometry, position, rotation, scale, isGhost = false) {
    return {
        geometry: geometry,
        position: position ? [position[0], position[1], position[2]] : [0, 0, 0],
        rotation: rotation ? [rotation[0], rotation[1], rotation[2]] : [0, 0, 0],
        scale: scale ? [scale[0], scale[1], scale[2]] : [1, 1, 1],
        userData: geometry.userData || {},
        isGhost: isGhost,
        originalColor: null,
        isSnapped: false,
        isAnimating: false
    };
}

function getObjectTransformMatrix(object) {
    const scale = mat4Scale(object.scale[0], object.scale[1], object.scale[2]);
    
    let rotation = mat4Identity();
    rotation = mat4RotateX(rotation, object.rotation[0]);
    rotation = mat4RotateY(rotation, object.rotation[1]);
    rotation = mat4RotateZ(rotation, object.rotation[2]);
    
    const translation = mat4Translation(object.position[0], object.position[1], object.position[2]);
    
    let transform = multiplyMat4(scale, rotation);
    transform = multiplyMat4(translation, transform);
    
    return transform;
}

function getObjectWorldVertices(object) {
    const vertices = [];
    const positions = object.geometry.positions;
    const transform = getObjectTransformMatrix(object);
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        const wx = transform[0] * x + transform[4] * y + transform[8] * z + transform[12];
        const wy = transform[1] * x + transform[5] * y + transform[9] * z + transform[13];
        const wz = transform[2] * x + transform[6] * y + transform[10] * z + transform[14];
        
        vertices.push([wx, wy, wz]);
    }
    
    return vertices;
}

function getObjectBoundingBox(object) {
    const vertices = getObjectWorldVertices(object);
    if (vertices.length === 0) return null;
    
    let minX = vertices[0][0], maxX = vertices[0][0];
    let minY = vertices[0][1], maxY = vertices[0][1];
    let minZ = vertices[0][2], maxZ = vertices[0][2];
    
    for (const v of vertices) {
        minX = Math.min(minX, v[0]);
        maxX = Math.max(maxX, v[0]);
        minY = Math.min(minY, v[1]);
        maxY = Math.max(maxY, v[1]);
        minZ = Math.min(minZ, v[2]);
        maxZ = Math.max(maxZ, v[2]);
    }
    
    return {
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
        center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2]
    };
}

