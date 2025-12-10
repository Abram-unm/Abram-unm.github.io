const MOVEMENT_SPEED = 0.1;
const ROTATION_STEP = Math.PI / 8;

const SPEED_MULTIPLIERS = {
    normal: 1.0,
    precision: 0.5,
    sprint: 2.0
};

function initKeyboardControl(raycastInteraction) {
    const keysPressed = new Set();
    let isShiftPressed = false;
    let isCtrlPressed = false;
    let isInitialized = false;
    
    function getSpeedMultiplier() {
        if (isShiftPressed) {
            return SPEED_MULTIPLIERS.precision;
        } else if (isCtrlPressed) {
            return SPEED_MULTIPLIERS.sprint;
        }
        return SPEED_MULTIPLIERS.normal;
    }
    
    function getRotationStep() {
        if (isShiftPressed) {
            return ROTATION_STEP * 0.5;
        }
        return ROTATION_STEP;
    }
    
    function handleKeyDown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        isShiftPressed = event.shiftKey;
        isCtrlPressed = event.ctrlKey || event.metaKey;
        const selectedObject = raycastInteraction.getSelectedObject();
        if (!selectedObject) {
            return;
        }
        if (selectedObject.userData.isSnapped) {
            return;
        }
        if (selectedObject.userData.isAnimating) {
            return;
        }
        switch (event.code) {
            case 'KeyQ':
                const rotationStepQ = getRotationStep();
                selectedObject.rotation[1] -= rotationStepQ;
                break;
            case 'KeyE':
                const rotationStepE = getRotationStep();
                selectedObject.rotation[1] += rotationStepE;
                break;
            case 'KeyZ':
                const rotationStepZ = getRotationStep();
                selectedObject.rotation[2] -= rotationStepZ;
                break;
            case 'KeyC':
                const rotationStepC = getRotationStep();
                selectedObject.rotation[2] += rotationStepC;
                break;
            case 'KeyW':
            case 'ArrowUp':
                keysPressed.add('w');
                break;
            case 'KeyS':
            case 'ArrowDown':
                keysPressed.add('s');
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keysPressed.add('a');
                break;
            case 'KeyD':
            case 'ArrowRight':
                keysPressed.add('d');
                break;
            case 'KeyR':
                keysPressed.add('r');
                break;
            case 'KeyF':
                keysPressed.add('f');
                break;
        }
    }
    
    function handleKeyUp(event) {
        isShiftPressed = event.shiftKey;
        isCtrlPressed = event.ctrlKey || event.metaKey;
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keysPressed.delete('w');
                break;
            case 'KeyS':
            case 'ArrowDown':
                keysPressed.delete('s');
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keysPressed.delete('a');
                break;
            case 'KeyD':
            case 'ArrowRight':
                keysPressed.delete('d');
                break;
            case 'KeyR':
                keysPressed.delete('r');
                break;
            case 'KeyF':
                keysPressed.delete('f');
                break;
        }
    }
    
    function update() {
        const selectedObject = raycastInteraction.getSelectedObject();
        if (!selectedObject) {
            return;
        }
        if (selectedObject.userData.isSnapped) {
            return;
        }
        if (selectedObject.userData.isAnimating) {
            return;
        }
        const speedMultiplier = getSpeedMultiplier();
        const currentMoveSpeed = MOVEMENT_SPEED * speedMultiplier;
        const moveVector = [0, 0, 0];
        if (keysPressed.has('w')) {
            moveVector[2] -= currentMoveSpeed;
        }
        if (keysPressed.has('s')) {
            moveVector[2] += currentMoveSpeed;
        }
        if (keysPressed.has('a')) {
            moveVector[0] -= currentMoveSpeed;
        }
        if (keysPressed.has('d')) {
            moveVector[0] += currentMoveSpeed;
        }
        if (keysPressed.has('r')) {
            moveVector[1] += currentMoveSpeed;
        }
        if (keysPressed.has('f')) {
            moveVector[1] -= currentMoveSpeed;
        }
        const moveLength = Math.sqrt(moveVector[0] * moveVector[0] + moveVector[1] * moveVector[1] + moveVector[2] * moveVector[2]);
        if (moveLength > 0) {
            selectedObject.position[0] += moveVector[0];
            selectedObject.position[1] += moveVector[1];
            selectedObject.position[2] += moveVector[2];
        }
    }
    
    function init() {
        if (isInitialized) {
            return;
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        isInitialized = true;
    }
    
    function dispose() {
        if (!isInitialized) {
            return;
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        keysPressed.clear();
        isInitialized = false;
    }
    
    init();
    
    return {
        update: update,
        dispose: dispose,
        getPressedKeys: () => Array.from(keysPressed)
    };
}
