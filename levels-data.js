const LEVELS = {
    tree: {
        name: "Tree",
        targets: [
            {
                id: 0,
                type: 'small_triangle_1',
                position: [0.7, 1.3, 0],
                rotation: [0, 0, (Math.PI/8)*2]
            },
            {
                id: 1,
                type: 'small_triangle_2',
                position: [1.4, 2, 0],
                rotation: [0, 0, -(Math.PI/8)*6]
            },
            {
                id: 2,
                type: 'medium_triangle',
                position: [0, 2, 0],
                rotation: [Math.PI, 0, Math.PI / 4]
            },
            {
                id: 3,
                type: 'large_triangle_1',
                position: [0, 2, 0],
                rotation: [0, 0, 0]
            },
            {
                id: 4,
                type: 'large_triangle_2',
                position: [0, 2, 0],
                rotation: [0, 0, Math.PI / 2]
            },
            {
                id: 5,
                type: 'square',
                position: [-0.5, 0, 0],
                rotation: [0, 0, 0]
            },
            {
                id: 6,
                type: 'parallelogram',
                position: [-2.0, 1, 0],
                rotation: [0, 0, 0]
            }
        ]
    }
};

function getLevelData(levelName) {
    return LEVELS[levelName] || null;
}

function getAllLevelNames() {
    return Object.keys(LEVELS);
}
