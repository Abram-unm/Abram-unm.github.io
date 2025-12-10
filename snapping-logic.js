let currentLevelTargets = [];

const SNAPPING_CONFIG = {
    positionThreshold: 0.5,
    rotationThreshold: Math.PI / 12,
    snappedColor: [0, 1, 0],
    snapAnimationDuration: 200
};

function euclideanDistance(pos1, pos2) {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];
    const dz = pos2[2] - pos1[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function angleDifference(angle1, angle2) {
    const normalize = (angle) => {
        angle = angle % (Math.PI * 2);
        if (angle < 0) angle += Math.PI * 2;
        return angle;
    };
    let diff = Math.abs(normalize(angle1) - normalize(angle2));
    if (diff > Math.PI) {
        diff = Math.PI * 2 - diff;
    }
    return diff;
}

function checkRotationMatch(currentRotation, targetRotation, threshold) {
    const yDiff = angleDifference(currentRotation[1], targetRotation[1]);
    return yDiff <= threshold;
}

function checkSnapping(object, allObjects = []) {
    if (object.userData.isSnapped) {
        return true;
    }
    if (!currentLevelTargets || currentLevelTargets.length === 0) {
        return false;
    }
    const targetConfig = currentLevelTargets.find(
        target => target.type === object.userData.type
    );
    if (!targetConfig) {
        return false;
    }
    const distance = euclideanDistance(
        object.position,
        targetConfig.position
    );
    const rotationMatch = checkRotationMatch(
        object.rotation,
        targetConfig.rotation,
        SNAPPING_CONFIG.rotationThreshold
    );
    if (distance < SNAPPING_CONFIG.positionThreshold && rotationMatch) {
        object.position[0] = targetConfig.position[0];
        object.position[1] = targetConfig.position[1];
        object.position[2] = targetConfig.position[2];
        object.rotation[0] = targetConfig.rotation[0];
        object.rotation[1] = targetConfig.rotation[1];
        object.rotation[2] = targetConfig.rotation[2];
        if (!object.userData.originalColor) {
            object.userData.originalColor = new Float32Array(object.geometry.colors);
        }
        object.userData.isSnapped = true;
        const tangramPieces = allObjects.filter(obj => !obj.isGhost);
        checkWinCondition(tangramPieces);
        return true;
    }
    return false;
}

function checkWinCondition(allObjects) {
    const tangramPieces = allObjects.filter(obj => !obj.isGhost && obj.userData);
    const allSnapped = tangramPieces.every(
        obj => obj.userData.isSnapped === true
    );
    if (allSnapped && tangramPieces.length === 7) {
        return true;
    }
    return false;
}

function initSnappingSystem(tangramPieces, onWinCallback = null, clearGhostsCallback = null) {
    let winCallback = onWinCallback;
    let clearGhosts = clearGhostsCallback;
    let hasWon = false;
    
    function updateSnapping() {
        if (hasWon) return;
        tangramPieces.forEach(piece => {
            if (!piece.userData.isSnapped) {
                checkSnapping(piece, tangramPieces);
            }
        });
    }
    
    function resetSnapping() {
        hasWon = false;
        tangramPieces.forEach(piece => {
            piece.userData.isSnapped = false;
            if (piece.userData.originalColor !== undefined) {
                piece.geometry.colors = new Float32Array(piece.userData.originalColor);
                if (window.updateColorBuffer) {
                    window.updateColorBuffer(piece);
                }
            }
        });
    }
    
    function checkObjectSnapping(object) {
        return checkSnapping(object, tangramPieces);
    }
    
    function getSnappingStats() {
        const snappedCount = tangramPieces.filter(
            piece => piece.userData.isSnapped
        ).length;
        return {
            total: tangramPieces.length,
            snapped: snappedCount,
            remaining: tangramPieces.length - snappedCount,
            progress: (snappedCount / tangramPieces.length) * 100
        };
    }
    
    const originalCheckWin = checkWinCondition;
    checkWinCondition = function(objects) {
        const result = originalCheckWin(objects);
        if (result && !hasWon) {
            hasWon = true;
            if (clearGhosts) {
                clearGhosts();
            }
            if (winCallback) {
                winCallback();
            }
        }
        return result;
    };
    
    return {
        update: updateSnapping,
        reset: resetSnapping,
        checkObject: checkObjectSnapping,
        getStats: getSnappingStats,
        checkWin: () => checkWinCondition(tangramPieces),
        setWinCallback: (callback) => { winCallback = callback; },
        setClearGhostsCallback: (callback) => { clearGhosts = callback; }
    };
}

