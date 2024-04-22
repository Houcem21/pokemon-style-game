
const keys = {
    z: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    q: {
        pressed: false
    }
}



function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleTiles.forEach(battleTile => {
        battleTile.draw()
    })
    character.draw()
    foregroundObjects.draw()

    let moving = true
    character.moving = false
    console.log(animationId)
    
    if (battle.initiated) return

    if (keys.z.pressed || keys.d.pressed || keys.s.pressed || keys.q.pressed) {
        for (let i = 0; i < battleTiles.length; i++) {
            const battleTile = battleTiles[i]
            const overlappingArea = (Math.min(character.position.x + character.width, battleTile.position.x + battleTile.width) - Math.max(character.position.x, battleTile.position.x)) * (Math.min(character.position.y + character.height, battleTile.position.y + battleTile.height) - Math.max(character.position.y, battleTile.position.y))
            if (rectangularDetection({rectangle1: character, rectangle2: battleTile}) &&
            overlappingArea > (character.height * character.width) / 2 && Math.random() < 0.05) {
                console.log('battle'); 
                window.cancelAnimationFrame(animationId);
                battle.initiated = true; 
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4
                        }) 
                        animateBattle(); 
                    }
                }); 
                break
            }
        }
    }

    
    
    if (keys.z.pressed) {
        character.moving = true;
        character.image = character.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularDetection({rectangle1: character, rectangle2: {...boundary, position: {x: boundary.position.x, y: boundary.position.y+stepWidth}}, jointRatio: collisionRatio}) ) {moving=false; break}
        }
        if (moving) relatives.forEach(relative => relative.position.y += stepWidth)
    }
    if (keys.d.pressed) {
        character.moving = true;
        character.image = character.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularDetection({rectangle1: character, rectangle2: {...boundary, position: {x: boundary.position.x-stepWidth, y: boundary.position.y}}, jointRatio: collisionRatio}) ) {moving=false; break}
        }
        if (moving) relatives.forEach(relative => relative.position.x -= stepWidth)
    }
    if (keys.s.pressed) {
        character.moving = true;
        character.image = character.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularDetection({rectangle1: character, rectangle2: {...boundary, position: {x: boundary.position.x, y: boundary.position.y-stepWidth}}, jointRatio: collisionRatio}) ) {moving=false; break}
        }
        if (moving) relatives.forEach(relative => relative.position.y -= stepWidth)
    }
    if (keys.q.pressed) {
        character.moving = true;
        character.image = character.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularDetection({rectangle1: character, rectangle2: {...boundary, position: {x: boundary.position.x+stepWidth, y: boundary.position.y}}, jointRatio: collisionRatio}) ) {moving=false; break}
        }
        if (moving) relatives.forEach(relative => relative.position.x += stepWidth)
    }
}

animate()

const battleBackgroundImage = 

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    console.log('battle frames')
}

window.addEventListener('keydown',  (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = true;
            break
        case 'd':
            keys.d.pressed = true;
            break
        case 's':
            keys.s.pressed = true;
            break
        case 'q':
            keys.q.pressed = true;
            break
    }
})

window.addEventListener('keyup',  (e) => {
    switch (e.key) {
        case 'z':
            keys.z.pressed = false;
            break
        case 'd':
            keys.d.pressed = false;
            break
        case 's':
            keys.s.pressed = false;
            break
        case 'q':
            keys.q.pressed = false;
            break
    }
    character.image = character.sprites.down;
    character.frames.val = 0;
})