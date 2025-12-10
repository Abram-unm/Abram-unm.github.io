function screenToWorldRay(canvas, camera, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    
    const ndcX = (x / width) * 2 - 1;
    const ndcY = 1 - (y / height) * 2;
    
    const fov = camera.fov;
    const aspect = camera.aspect;
    const near = camera.near;
    
    const tanHalfFov = Math.tan(fov / 2);
    const rayDirX = ndcX * tanHalfFov * aspect;
    const rayDirY = ndcY * tanHalfFov;
    const rayDirZ = -1;
    
    const rayDir = [rayDirX, rayDirY, rayDirZ];
    const rayDirLen = Math.sqrt(rayDirX * rayDirX + rayDirY * rayDirY + rayDirZ * rayDirZ);
    rayDir[0] /= rayDirLen;
    rayDir[1] /= rayDirLen;
    rayDir[2] /= rayDirLen;
    
    const viewMatrix = updateCameraViewMatrix(camera);
    const invViewMatrix = invertMatrix4(viewMatrix);
    
    const worldRayDir = [
        invViewMatrix[0] * rayDir[0] + invViewMatrix[4] * rayDir[1] + invViewMatrix[8] * rayDir[2],
        invViewMatrix[1] * rayDir[0] + invViewMatrix[5] * rayDir[1] + invViewMatrix[9] * rayDir[2],
        invViewMatrix[2] * rayDir[0] + invViewMatrix[6] * rayDir[1] + invViewMatrix[10] * rayDir[2]
    ];
    
    const worldRayOrigin = [
        invViewMatrix[12],
        invViewMatrix[13],
        invViewMatrix[14]
    ];
    
    return {
        origin: worldRayOrigin,
        direction: worldRayDir
    };
}

function invertMatrix4(m) {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
    
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1.0 / det;
    
    return new Float32Array([
        (a11 * b11 - a12 * b10 + a13 * b09) * det,
        (a02 * b10 - a01 * b11 - a03 * b09) * det,
        (a31 * b05 - a32 * b04 + a33 * b03) * det,
        (a22 * b04 - a21 * b05 - a23 * b03) * det,
        (a12 * b08 - a10 * b11 - a13 * b07) * det,
        (a00 * b11 - a02 * b08 + a03 * b07) * det,
        (a32 * b02 - a30 * b05 - a33 * b01) * det,
        (a20 * b05 - a22 * b02 + a23 * b01) * det,
        (a10 * b10 - a11 * b08 + a13 * b06) * det,
        (a01 * b08 - a00 * b10 - a03 * b06) * det,
        (a30 * b04 - a31 * b02 + a33 * b00) * det,
        (a21 * b02 - a20 * b04 - a23 * b00) * det,
        (a11 * b07 - a10 * b09 - a12 * b06) * det,
        (a00 * b09 - a01 * b07 + a02 * b06) * det,
        (a31 * b01 - a30 * b03 - a32 * b00) * det,
        (a20 * b03 - a21 * b01 + a22 * b00) * det
    ]);
}

function rayTriangleIntersect(ray, v0, v1, v2) {
    const EPSILON = 0.0000001;
    const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
    
    const h = [
        ray.direction[1] * edge2[2] - ray.direction[2] * edge2[1],
        ray.direction[2] * edge2[0] - ray.direction[0] * edge2[2],
        ray.direction[0] * edge2[1] - ray.direction[1] * edge2[0]
    ];
    
    const a = edge1[0] * h[0] + edge1[1] * h[1] + edge1[2] * h[2];
    if (a > -EPSILON && a < EPSILON) return null;
    
    const f = 1.0 / a;
    const s = [
        ray.origin[0] - v0[0],
        ray.origin[1] - v0[1],
        ray.origin[2] - v0[2]
    ];
    const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);
    
    if (u < 0.0 || u > 1.0) return null;
    
    const q = [
        s[1] * edge1[2] - s[2] * edge1[1],
        s[2] * edge1[0] - s[0] * edge1[2],
        s[0] * edge1[1] - s[1] * edge1[0]
    ];
    const v = f * (ray.direction[0] * q[0] + ray.direction[1] * q[1] + ray.direction[2] * q[2]);
    
    if (v < 0.0 || u + v > 1.0) return null;
    
    const t = f * (edge2[0] * q[0] + edge2[1] * q[1] + edge2[2] * q[2]);
    if (t > EPSILON) {
        return {
            distance: t,
            point: [
                ray.origin[0] + ray.direction[0] * t,
                ray.origin[1] + ray.direction[1] * t,
                ray.origin[2] + ray.direction[2] * t
            ]
        };
    }
    
    return null;
}

function performRaycast(canvas, camera, objects, clientX, clientY) {
    const ray = screenToWorldRay(canvas, camera, clientX, clientY);
    if (!ray) return [];
    
    const intersects = [];
    
    for (const obj of objects) {
        if (obj.isGhost) continue;
        if (!obj.geometry || !obj.geometry.positions || !obj.geometry.indices) continue;
        
        const positions = obj.geometry.positions;
        const indices = obj.geometry.indices;
        const transform = getObjectTransformMatrix(obj);
        
        let closestIntersect = null;
        let closestDistance = Infinity;
        
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i];
            const i1 = indices[i + 1];
            const i2 = indices[i + 2];
            
            if (i0 * 3 + 2 >= positions.length || i1 * 3 + 2 >= positions.length || i2 * 3 + 2 >= positions.length) {
                continue;
            }
            
            const v0 = [
                positions[i0 * 3],
                positions[i0 * 3 + 1],
                positions[i0 * 3 + 2]
            ];
            const v1 = [
                positions[i1 * 3],
                positions[i1 * 3 + 1],
                positions[i1 * 3 + 2]
            ];
            const v2 = [
                positions[i2 * 3],
                positions[i2 * 3 + 1],
                positions[i2 * 3 + 2]
            ];
            
            const wv0 = [
                transform[0] * v0[0] + transform[4] * v0[1] + transform[8] * v0[2] + transform[12],
                transform[1] * v0[0] + transform[5] * v0[1] + transform[9] * v0[2] + transform[13],
                transform[2] * v0[0] + transform[6] * v0[1] + transform[10] * v0[2] + transform[14]
            ];
            const wv1 = [
                transform[0] * v1[0] + transform[4] * v1[1] + transform[8] * v1[2] + transform[12],
                transform[1] * v1[0] + transform[5] * v1[1] + transform[9] * v1[2] + transform[13],
                transform[2] * v1[0] + transform[6] * v1[1] + transform[10] * v1[2] + transform[14]
            ];
            const wv2 = [
                transform[0] * v2[0] + transform[4] * v2[1] + transform[8] * v2[2] + transform[12],
                transform[1] * v2[0] + transform[5] * v2[1] + transform[9] * v2[2] + transform[13],
                transform[2] * v2[0] + transform[6] * v2[1] + transform[10] * v2[2] + transform[14]
            ];
            
            const intersect = rayTriangleIntersect(ray, wv0, wv1, wv2);
            if (intersect && intersect.distance < closestDistance) {
                closestIntersect = intersect;
                closestDistance = intersect.distance;
            }
        }
        
        if (closestIntersect) {
            intersects.push({
                object: obj,
                distance: closestIntersect.distance,
                point: closestIntersect.point
            });
        }
    }
    
    intersects.sort((a, b) => a.distance - b.distance);
    return intersects;
}

function initRaycastInteraction(canvas, camera, objects) {
    let hoveredObject = null;
    let currentSelectedObject = null;
    const originalColors = new Map();
    
    function handleHover(intersects) {
        const currentHovered = intersects.length > 0 ? intersects[0].object : null;
        if (currentHovered !== hoveredObject) {
            if (hoveredObject && hoveredObject !== currentSelectedObject) {
                const original = originalColors.get(hoveredObject);
                if (original) {
                    hoveredObject.geometry.colors = original;
                }
            }
            hoveredObject = currentHovered;
            if (hoveredObject && hoveredObject !== currentSelectedObject && !hoveredObject.isSnapped) {
                if (!originalColors.has(hoveredObject)) {
                    originalColors.set(hoveredObject, new Float32Array(hoveredObject.geometry.colors));
                }
                const original = originalColors.get(hoveredObject);
                const colors = hoveredObject.geometry.colors;
                for (let i = 0; i < colors.length; i += 3) {
                    colors[i] = Math.min(1.0, original[i] + 0.3);
                    colors[i + 1] = Math.min(1.0, original[i + 1] + 0.3);
                    colors[i + 2] = original[i + 2];
                }
                if (window.updateColorBuffer) {
                    window.updateColorBuffer(hoveredObject);
                }
            }
        }
    }
    
    function clearSelection() {
        if (currentSelectedObject) {
            if (currentSelectedObject === hoveredObject) {
                const original = originalColors.get(currentSelectedObject);
                if (original) {
                    currentSelectedObject.geometry.colors = original;
                }
            }
            currentSelectedObject = null;
        }
    }
    
    function handleClick(intersects) {
        const clickedObject = intersects.length > 0 ? intersects[0].object : null;
        if (clickedObject) {
            if (clickedObject === currentSelectedObject) {
                clearSelection();
                return;
            }
            if (currentSelectedObject) {
                clearSelection();
            }
            currentSelectedObject = clickedObject;
        } else {
            clearSelection();
        }
    }
    
    let isDragging = false;
    let wasDragging = false;
    
    canvas.addEventListener('mousemove', (event) => {
        if (isDragging) return;
        const intersects = performRaycast(canvas, camera, objects, event.clientX, event.clientY);
        handleHover(intersects);
    });
    
    canvas.addEventListener('click', (event) => {
        if (wasDragging) {
            wasDragging = false;
            return;
        }
        const intersects = performRaycast(canvas, camera, objects, event.clientX, event.clientY);
        handleClick(intersects);
    });
    
    return {
        getSelectedObject: () => currentSelectedObject,
        setDragging: (dragging) => {
            isDragging = dragging;
            if (dragging) {
                wasDragging = true;
            }
        },
        clearSelection: () => {
            clearSelection();
        }
    };
}

