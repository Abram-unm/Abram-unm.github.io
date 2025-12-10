function createTangramPieces(depth = 0.5) {
    const pieces = [];
    const u = 1;
    const SMALL_TRIANGLE = u;
    const MEDIUM_TRIANGLE = u * Math.sqrt(2);
    const LARGE_TRIANGLE = 2 * u;
    const SQUARE_SIDE = u * Math.sqrt(2) / 2;
    const PARA_SHORT = u;
    const PARA_LONG = u * Math.sqrt(2);
    const angle45 = Math.PI / 4;
    
    function createTriangleGeometry(base, height, depth) {
        const halfDepth = depth / 2;
        const positions = new Float32Array([
            0, 0, -halfDepth,
            base, 0, -halfDepth,
            0, height, -halfDepth,
            0, 0, halfDepth,
            base, 0, halfDepth,
            0, height, halfDepth
        ]);
        
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 0,
            1, 0,
            0, 1
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2,
            3, 5, 4,
            0, 3, 4, 0, 4, 1,
            1, 4, 5, 1, 5, 2,
            2, 5, 3, 2, 3, 0
        ]);
        
        const normals = calculateNormals(positions, indices);
        
        return { positions, indices, normals, texCoords };
    }
    
    function createSquareGeometry(side, depth) {
        const halfDepth = depth / 2;
        const positions = new Float32Array([
            0, 0, -halfDepth,
            side, 0, -halfDepth,
            side, side, -halfDepth,
            0, side, -halfDepth,
            0, 0, halfDepth,
            side, 0, halfDepth,
            side, side, halfDepth,
            0, side, halfDepth
        ]);
        
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,
            4, 7, 6, 4, 6, 5,
            0, 4, 5, 0, 5, 1,
            1, 5, 6, 1, 6, 2,
            2, 6, 7, 2, 7, 3,
            3, 7, 4, 3, 4, 0
        ]);
        
        const normals = calculateNormals(positions, indices);
        
        return { positions, indices, normals, texCoords };
    }
    
    function createParallelogramGeometry(long, short, angle, depth) {
        const halfDepth = depth / 2;
        const dx = long * Math.cos(angle);
        const dy = long * Math.sin(angle);
        const positions = new Float32Array([
            0, 0, -halfDepth,
            short, 0, -halfDepth,
            short + dx, dy, -halfDepth,
            dx, dy, -halfDepth,
            0, 0, halfDepth,
            short, 0, halfDepth,
            short + dx, dy, halfDepth,
            dx, dy, halfDepth
        ]);
        
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,
            4, 7, 6, 4, 6, 5,
            0, 4, 5, 0, 5, 1,
            1, 5, 6, 1, 6, 2,
            2, 6, 7, 2, 7, 3,
            3, 7, 4, 3, 4, 0
        ]);
        
        const normals = calculateNormals(positions, indices);
        
        return { positions, indices, normals, texCoords };
    }
    
    function calculateNormals(positions, indices) {
        const normals = new Float32Array(positions.length);
        const faceNormals = [];
        
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i] * 3;
            const i1 = indices[i + 1] * 3;
            const i2 = indices[i + 2] * 3;
            
            const v0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
            const v1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
            const v2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];
            
            const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
            
            const normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            ];
            
            const len = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            if (len > 0.0001) {
                normal[0] /= len;
                normal[1] /= len;
                normal[2] /= len;
            }
            
            faceNormals.push({ normal, indices: [indices[i], indices[i + 1], indices[i + 2]] });
        }
        
        for (let i = 0; i < positions.length / 3; i++) {
            let nx = 0, ny = 0, nz = 0;
            let count = 0;
            
            for (const face of faceNormals) {
                if (face.indices.includes(i)) {
                    nx += face.normal[0];
                    ny += face.normal[1];
                    nz += face.normal[2];
                    count++;
                }
            }
            
            if (count > 0) {
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                if (len > 0.0001) {
                    nx /= len;
                    ny /= len;
                    nz /= len;
                }
            }
            
            normals[i * 3] = nx;
            normals[i * 3 + 1] = ny;
            normals[i * 3 + 2] = nz;
        }
        
        return normals;
    }
    
    function generateColors(vertexCount, color) {
        const r = color ? color[0] : 0.5;
        const g = color ? color[1] : 0.5;
        const b = color ? color[2] : 0.5;
        const colors = new Float32Array(vertexCount * 3);
        for (let i = 0; i < vertexCount; i++) {
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
        }
        return colors;
    }
    
    const pieceColors = {
        small_triangle_1: [0.2, 0.6, 0.9],
        small_triangle_2: [0.9, 0.6, 0.2],
        medium_triangle: [0.4, 0.8, 0.4],
        large_triangle_1: [0.8, 0.4, 0.6],
        large_triangle_2: [0.6, 0.4, 0.8],
        square: [0.9, 0.7, 0.3],
        parallelogram: [0.5, 0.7, 0.9],
        sky: [0.3, 0.7, 0.9]
    };
    
    const geom0 = createTriangleGeometry(SMALL_TRIANGLE, SMALL_TRIANGLE, depth);
    const colors0 = generateColors(geom0.positions.length / 3, pieceColors.small_triangle_1);
    pieces.push({
        geometry: { ...geom0, colors: colors0 },
        userData: { type: 'small_triangle_1', id: 0 }
    });
    
    const geom1 = createTriangleGeometry(SMALL_TRIANGLE, SMALL_TRIANGLE, depth);
    const colors1 = generateColors(geom1.positions.length / 3, pieceColors.small_triangle_2);
    pieces.push({
        geometry: { ...geom1, colors: colors1 },
        userData: { type: 'small_triangle_2', id: 1 }
    });
    
    const geom2 = createTriangleGeometry(MEDIUM_TRIANGLE, MEDIUM_TRIANGLE, depth);
    const colors2 = generateColors(geom2.positions.length / 3, pieceColors.medium_triangle);
    pieces.push({
        geometry: { ...geom2, colors: colors2 },
        userData: { type: 'medium_triangle', id: 2 }
    });
    
    const geom3 = createTriangleGeometry(LARGE_TRIANGLE, LARGE_TRIANGLE, depth);
    const colors3 = generateColors(geom3.positions.length / 3, pieceColors.large_triangle_1);
    pieces.push({
        geometry: { ...geom3, colors: colors3 },
        userData: { type: 'large_triangle_1', id: 3 }
    });
    
    const geom4 = createTriangleGeometry(LARGE_TRIANGLE, LARGE_TRIANGLE, depth);
    const colors4 = generateColors(geom4.positions.length / 3, pieceColors.large_triangle_2);
    pieces.push({
        geometry: { ...geom4, colors: colors4 },
        userData: { type: 'large_triangle_2', id: 4 }
    });
    
    const geom5 = createSquareGeometry(SQUARE_SIDE, depth);
    const colors5 = generateColors(geom5.positions.length / 3, pieceColors.square);
    pieces.push({
        geometry: { ...geom5, colors: colors5 },
        userData: { type: 'square', id: 5 }
    });
    
    const geom6 = createParallelogramGeometry(PARA_LONG, PARA_SHORT, angle45, depth);
    const colors6 = generateColors(geom6.positions.length / 3, pieceColors.parallelogram);
    pieces.push({
        geometry: { ...geom6, colors: colors6 },
        userData: { type: 'parallelogram', id: 6 }
    });

    const geom7 = createSquareGeometry(SQUARE_SIDE, 10);
    const colors7 = generateColors(geom7.positions.length / 3, pieceColors.sky);
    pieces.push({
        geometry: { ...geom7, colors: colors7 },
        userData: { type: 'square', id: 7 }
    });

    const geom8 = createSquareGeometry(SQUARE_SIDE, 10);
    pieces.push({
        geometry: { ...geom8, colors: colors7 },
        userData: { type: 'square', id: 8 }
    });
    
    return pieces;
}

