function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vsSource, fsSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) {
        return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function initWebGL(canvas) {
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        alert('WebGL2 not supported');
        return null;
    }
    
    const mainProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const ghostProgram = createProgram(gl, vertexShaderSource, ghostFragmentShaderSource);
    
    if (!mainProgram || !ghostProgram) {
        return null;
    }
    
    const attribLocations = {
        position: gl.getAttribLocation(mainProgram, 'aPosition'),
        color: gl.getAttribLocation(mainProgram, 'aColor'),
        normal: gl.getAttribLocation(mainProgram, 'aNormal'),
        texCoord: gl.getAttribLocation(mainProgram, 'aTexCoord')
    };
    
    const uniformLocations = {
        time: gl.getUniformLocation(mainProgram, 'uTime'),
        modelViewMatrix: gl.getUniformLocation(mainProgram, 'uModelViewMatrix'),
        projectionMatrix: gl.getUniformLocation(mainProgram, 'uProjectionMatrix'),
        modelTransformationMatrix: gl.getUniformLocation(mainProgram, 'uModelTransformationMatrix'),
        scaleTransformationMatrix: gl.getUniformLocation(mainProgram, 'uScaleTransformationMatrix'),
        translateTransformationMatrix: gl.getUniformLocation(mainProgram, 'uTranslateTransformationMatrix'),
        normalMatrix: gl.getUniformLocation(mainProgram, 'uNormalMatrix'),
        alpha: gl.getUniformLocation(mainProgram, 'uAlpha'),
        ka: gl.getUniformLocation(mainProgram, 'uKa'),
        kd: gl.getUniformLocation(mainProgram, 'uKd'),
        ks: gl.getUniformLocation(mainProgram, 'uKs'),
        viewPos: gl.getUniformLocation(mainProgram, 'uViewPos'),
        pointPos: gl.getUniformLocation(mainProgram, 'uPointPos'),
        spotlightPos: gl.getUniformLocation(mainProgram, 'uSpotlightPos'),
        useTexture: gl.getUniformLocation(mainProgram, 'uUseTexture'),
        texture: gl.getUniformLocation(mainProgram, 'uTexture'),
        bump: gl.getUniformLocation(mainProgram, 'uBumpStrength')
    };
    
    const ghostAttribLocations = {
        position: gl.getAttribLocation(ghostProgram, 'aPosition'),
        color: gl.getAttribLocation(ghostProgram, 'aColor'),
        normal: gl.getAttribLocation(ghostProgram, 'aNormal')
    };
    
    const ghostUniformLocations = {
        modelViewMatrix: gl.getUniformLocation(ghostProgram, 'uModelViewMatrix'),
        projectionMatrix: gl.getUniformLocation(ghostProgram, 'uProjectionMatrix'),
        modelTransformationMatrix: gl.getUniformLocation(ghostProgram, 'uModelTransformationMatrix'),
        scaleTransformationMatrix: gl.getUniformLocation(ghostProgram, 'uScaleTransformationMatrix'),
        translateTransformationMatrix: gl.getUniformLocation(ghostProgram, 'uTranslateTransformationMatrix'),
        normalMatrix: gl.getUniformLocation(ghostProgram, 'uNormalMatrix')
    };
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
    return {
        gl: gl,
        mainProgram: mainProgram,
        ghostProgram: ghostProgram,
        attribLocations: attribLocations,
        uniformLocations: uniformLocations,
        ghostAttribLocations: ghostAttribLocations,
        ghostUniformLocations: ghostUniformLocations
    };
}

function setupCamera(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return {
        fov: fov,
        aspect: aspect,
        near: near,
        far: far,
        position: [5, 5, 10],
        target: [0, 0, 0],
        up: [0, 1, 0],
        projectionMatrix: new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ])
    };
}

function updateCameraViewMatrix(camera) {
    const eye = camera.position;
    const target = camera.target;
    const up = camera.up;
    
    const zAxis = [
        eye[0] - target[0],
        eye[1] - target[1],
        eye[2] - target[2]
    ];
    const zLen = Math.sqrt(zAxis[0] * zAxis[0] + zAxis[1] * zAxis[1] + zAxis[2] * zAxis[2]);
    zAxis[0] /= zLen;
    zAxis[1] /= zLen;
    zAxis[2] /= zLen;
    
    const xAxis = [
        up[1] * zAxis[2] - up[2] * zAxis[1],
        up[2] * zAxis[0] - up[0] * zAxis[2],
        up[0] * zAxis[1] - up[1] * zAxis[0]
    ];
    const xLen = Math.sqrt(xAxis[0] * xAxis[0] + xAxis[1] * xAxis[1] + xAxis[2] * xAxis[2]);
    xAxis[0] /= xLen;
    xAxis[1] /= xLen;
    xAxis[2] /= xLen;
    
    const yAxis = [
        zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
        zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
        zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]
    ];
    
    const translation = [
        -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]),
        -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]),
        -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2])
    ];
    
    return new Float32Array([
        xAxis[0], yAxis[0], zAxis[0], 0,
        xAxis[1], yAxis[1], zAxis[1], 0,
        xAxis[2], yAxis[2], zAxis[2], 0,
        translation[0], translation[1], translation[2], 1
    ]);
}

