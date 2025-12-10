function initLevelManager(objects, tangramPieces) {
    let ghostObjects = [];
    let currentLevelName = null;
    const initialPositions = tangramPieces.map(piece => ({
        position: [...piece.position],
        rotation: [...piece.rotation]
    }));
    
    function createGhostObject(targetConfig) {
        const originalPiece = tangramPieces.find(p => p.userData.type === targetConfig.type);
        if (!originalPiece) {
            console.warn(`Piece with type ${targetConfig.type} not found`);
            return null;
        }
        const ghostGeometry = {
            positions: new Float32Array(originalPiece.geometry.positions),
            indices: new Uint16Array(originalPiece.geometry.indices),
            normals: new Float32Array(originalPiece.geometry.normals),
            colors: new Float32Array(originalPiece.geometry.colors.length)
        };
        for (let i = 0; i < ghostGeometry.colors.length; i += 3) {
            ghostGeometry.colors[i] = 1.0;
            ghostGeometry.colors[i + 1] = 0.0;
            ghostGeometry.colors[i + 2] = 0.0;
        }
        const Y_OFFSET = 0.25;
        const ghostPosition = [
            targetConfig.position[0],
            targetConfig.position[1] + Y_OFFSET,
            targetConfig.position[2]
        ];
        const ghost = createObject(
            { ...ghostGeometry, userData: { type: targetConfig.type } },
            ghostPosition,
            targetConfig.rotation,
            [1, 1, 1],
            true
        );
        return ghost;
    }
    
    function clearGhostObjects() {
        for (let i = objects.length - 1; i >= 0; i--) {
            if (objects[i].isGhost) {
                objects.splice(i, 1);
            }
        }
        ghostObjects = [];
    }
    
    function resetTangramPieces() {
        tangramPieces.forEach((piece, index) => {
            piece.position[0] = initialPositions[index].position[0];
            piece.position[1] = initialPositions[index].position[1];
            piece.position[2] = initialPositions[index].position[2];
            piece.rotation[0] = initialPositions[index].rotation[0];
            piece.rotation[1] = initialPositions[index].rotation[1];
            piece.rotation[2] = initialPositions[index].rotation[2];
            piece.userData.isSnapped = false;
            if (piece.userData.originalColor !== undefined) {
                piece.geometry.colors = new Float32Array(piece.userData.originalColor);
            }
        });
    }
    
    function loadLevel(levelName) {
        const levelData = getLevelData(levelName);
        if (!levelData) {
            console.error(`Level ${levelName} does not exist`);
            return false;
        }
        clearGhostObjects();
        resetTangramPieces();
        const Y_OFFSET = 0.25;
        currentLevelTargets = levelData.targets.map((target, index) => {
            const targetPosition = [
                target.position[0],
                target.position[1] + Y_OFFSET,
                target.position[2]
            ];
            return {
                id: index,
                type: target.type,
                position: targetPosition,
                rotation: [...target.rotation]
            };
        });
        levelData.targets.forEach(targetConfig => {
            const ghost = createGhostObject(targetConfig);
            if (ghost) {
                objects.push(ghost);
                ghostObjects.push(ghost);
            }
        });
        currentLevelName = levelName;
        return true;
    }
    
    function getCurrentLevel() {
        return currentLevelName;
    }
    
    function updateGhostObjects() {
    }
    
    return {
        loadLevel: loadLevel,
        reset: resetTangramPieces,
        getCurrentLevel: getCurrentLevel,
        clearGhosts: clearGhostObjects,
        update: updateGhostObjects,
        getGhostObjects: () => ghostObjects
    };
}

