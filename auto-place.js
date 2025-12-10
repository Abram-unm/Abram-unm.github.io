function lerp(start, end, t) {
    t = Math.max(0, Math.min(1, t));
    return start + (end - start) * t;
}

function lerpVector3(start, end, t) {
    return [
        lerp(start[0], end[0], t),
        lerp(start[1], end[1], t),
        lerp(start[2], end[2], t)
    ];
}

function lerpAngle(start, end, t) {
    let diff = end - start;
    if (diff > Math.PI) {
        diff -= Math.PI * 2;
    } else if (diff < -Math.PI) {
        diff += Math.PI * 2;
    }
    return start + diff * t;
}

function initAutoPlace(raycastInteraction, checkSnapping, allObjects) {
    let currentAnimation = null;
    
    function autoPlaceSelectedPiece(duration = 0.5) {
        if (currentAnimation) {
            cancelAnimationFrame(currentAnimation.frameId);
            currentAnimation = null;
        }
        const selectedObject = raycastInteraction.getSelectedObject();
        if (!selectedObject) {
            console.warn('No object selected, cannot perform auto-place');
            return false;
        }
        if (selectedObject.userData.isSnapped) {
            return false;
        }
        const pieceId = selectedObject.userData.id;
        if (pieceId === undefined || pieceId === null) {
            console.error('Object missing userData.id, cannot find target position');
            return false;
        }
        let targetConfig = null;
        if (currentLevelTargets) {
            targetConfig = currentLevelTargets.find(
                target => target.id === pieceId
            );
        }
        if (!targetConfig && currentLevelTargets) {
            const pieceType = selectedObject.userData.type;
            targetConfig = currentLevelTargets.find(
                target => target.type === pieceType
            );
        }
        if (!targetConfig && currentLevelTargets && currentLevelTargets[pieceId]) {
            targetConfig = currentLevelTargets[pieceId];
        }
        if (!targetConfig) {
            console.error(`Target configuration not found for ID ${pieceId}`);
            return false;
        }
        const startPosition = [...selectedObject.position];
        const startRotation = [...selectedObject.rotation];
        const targetPosition = [...targetConfig.position];
        const targetRotation = [...targetConfig.rotation];
        const startTime = performance.now();
        const durationMs = duration * 1000;
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            let t = elapsed / durationMs;
            if (t >= 1.0) {
                t = 1.0;
                selectedObject.position[0] = targetPosition[0];
                selectedObject.position[1] = targetPosition[1];
                selectedObject.position[2] = targetPosition[2];
                selectedObject.rotation[0] = targetRotation[0];
                selectedObject.rotation[1] = targetRotation[1];
                selectedObject.rotation[2] = targetRotation[2];
                const snapped = checkSnapping(selectedObject, allObjects);
                if (snapped) {
                } else {
                    console.warn('Auto-place completed, but snap check failed');
                }
                selectedObject.userData.isAnimating = false;
                currentAnimation = null;
                return;
            }
            const currentPosition = lerpVector3(startPosition, targetPosition, t);
            selectedObject.position[0] = currentPosition[0];
            selectedObject.position[1] = currentPosition[1];
            selectedObject.position[2] = currentPosition[2];
            selectedObject.rotation[0] = lerpAngle(startRotation[0], targetRotation[0], t);
            selectedObject.rotation[1] = lerpAngle(startRotation[1], targetRotation[1], t);
            selectedObject.rotation[2] = lerpAngle(startRotation[2], targetRotation[2], t);
            const frameId = requestAnimationFrame(animate);
            if (currentAnimation) {
                currentAnimation.frameId = frameId;
            }
        }
        selectedObject.userData.isAnimating = true;
        currentAnimation = {
            object: selectedObject,
            frameId: null,
            startTime: startTime
        };
        const frameId = requestAnimationFrame(animate);
        currentAnimation.frameId = frameId;
        return true;
    }
    
    function stopAnimation() {
        if (currentAnimation) {
            cancelAnimationFrame(currentAnimation.frameId);
            if (currentAnimation.object) {
                currentAnimation.object.userData.isAnimating = false;
            }
            currentAnimation = null;
        }
    }
    
    function isAnimating() {
        return currentAnimation !== null;
    }
    
    return {
        autoPlace: autoPlaceSelectedPiece,
        stop: stopAnimation,
        isAnimating: isAnimating
    };
}

