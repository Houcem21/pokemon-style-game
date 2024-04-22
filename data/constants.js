function parseArray(array, size) {
    let parsedArray = [];
    let init = 0
    while (init < array.length) {
        parsedArray.push(array.slice(init, init + size))
        init += size
    }
    return parsedArray
}

const collisionsMap = parseArray(collisions, 70)

const battleZonesMap = parseArray(battleZones, 70)

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const offset = {
    x: -642,
    y: -875
}

const image = new Image()
image.src = '../assets/map-zoomed.png'

const playerDownImage = new Image();
playerDownImage.src = "../assets/playerDown.png"
const playerUpImage = new Image();
playerUpImage.src = "../assets/playerUp.png"
const playerRightImage = new Image();
playerRightImage.src = "../assets/playerRight.png"
const playerLeftImage = new Image();
playerLeftImage.src = "../assets/playerLeft.png"

const playerImage = playerDownImage;

const foregroundImage = new Image()
foregroundImage.src = '../assets/foregroundObjects.png'


const background = new Sprite({position: {
    x: offset.x, y: offset.y
}, image: image})

const foregroundObjects = new Sprite({position: {
    x: offset.x, y: offset.y
}, image: foregroundImage})

const character = new Sprite(
    {   position: {
            x: canvas.width / 2 - playerImage.width / 4 / 2, y: canvas.height / 2 - playerImage.height / 2
        }, image: playerImage, frames: {max: 4},
        sprites: {up: playerUpImage, right: playerRightImage, down: playerDownImage, left: playerLeftImage }
    }
)

const boundaries = []

collisionsMap.forEach((row, i)=> {
    row.forEach((value, j) => {
        if (value === 1025) boundaries.push(new Boundary({position: {x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y}}))
    })
})

const battleTiles = []

battleZonesMap.forEach((row, i)=> {
    row.forEach((value, j) => {
        if (value === 1025) battleTiles.push(new Boundary({position: {x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y}, colliderOpacity: 0.4}))
    })
})

function rectangularDetection({rectangle1, rectangle2, jointRatio= {x:1, y:1}}) {
    return (
        rectangle1.position.x + rectangle1.width / jointRatio.x >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width / jointRatio.x &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height / jointRatio.y &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}


const stepWidth = 6;

const relatives = [background, ...boundaries, foregroundObjects, ...battleTiles]

const collisionRatio = {x: 1.3, y: 1.3};

const battle = {initated: false}