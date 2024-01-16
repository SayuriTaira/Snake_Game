const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const score = document.querySelector('.score-value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const restartBtn = document.querySelector('.restartBtn')

const audio = new Audio('assets/audio.mp3')

let snake = [{x: 270, y: 270}]

const size = 30
  
let direction, loopId  

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}
  
const drawGrid = () => {
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.strokeStyle = '#191919'
        ctx.lineTo(i, 0)   
        ctx.lineTo(i, 600)
        ctx.stroke()
          
        ctx.beginPath()
        ctx.strokeStyle = '#191919'
        ctx.lineTo(0, i)   
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}
        
const drawSnake = () => {
    ctx.fillStyle = '#ddd'

    snake.forEach((element, index) => {
        if(index == snake.length - 1) {
            ctx.fillStyle = 'white'
        }
                
        ctx.fillRect(snake[index].x, snake[index].y, size, size)
        });
}
        
const moveSnake = () => {

    if (!direction) return
      
    const head = snake[snake.length - 1]

    if (direction == 'right') {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == 'left') {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == 'up') {
        snake.push({ x: head.x, y: head.y - size })
    }

    if (direction == 'down') {
        snake.push({ x: head.x, y: head.y + size })
    }

    snake.shift()
}

const randomNumber = (min, max) => {
   return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, 570)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    let red = randomNumber(0, 255)
    let green = randomNumber(0, 255)
    let blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowBlur = 6
    ctx.shadowColor = color
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)

    ctx.shadowBlur = 0
}

const checkEat = () => {

    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        let x = randomPosition()
        let y = randomPosition()

        incrementScore()
        snake.push(head)
        audio.play()

        while (snake.find((position) => position.x == x && position.y == y) ) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {

    const head = snake[snake.length - 1]

    const neckIndex = snake.length - 2

    const wallColision = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.width - size

    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    
    if (wallColision || selfColision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    
    menu.style.display = 'flex'
    canvas.style.filter = 'blur(2px)'
    finalScore.innerText = score.innerText

    document.removeEventListener('keydown', move)
}

const gameLoop = () => {

    document.addEventListener('keydown', function move (event) {
        
        if (event.key == 'ArrowRight' && direction != 'left') {
            direction = 'right'
        }
        
        if (event.key == 'ArrowLeft' && direction != 'right') {
            direction = 'left'
        }
        
        if (event.key == 'ArrowUp' && direction != 'down') {
            direction = 'up'
        }
        
        if (event.key == 'ArrowDown' && direction != 'up') {
            direction = 'down'
        }
    })
    
    ctx.clearRect(0, 0, 600, 600)
    
    clearInterval(loopId)
    
    drawGrid()
    moveSnake()
    drawSnake()
    drawFood()
    checkEat()
    checkCollision()
    
    loopId = setInterval(() => {
        gameLoop()
    }, 250);
}

gameLoop()


restartBtn.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    
    snake = [{x: 270, y: 270}]
    
    food.x = randomPosition()
    food.y = randomPosition()
    food.color = randomColor()

    direction = undefined

    gameLoop()
    
})