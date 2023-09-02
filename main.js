let startBtn = document.getElementById("start")
let pauseBtn = document.querySelector('.pause-btn')
let resetBtn = document.querySelector('.reset-btn')

let timer = document.querySelector('.timer')

let startEvent = new Event('starttimer', {bubbles: true})
let pauseEvent = new Event('pausetimer', {bubbles: true})
let resetEvent = new Event('resettimer', {bubbles: true})

startBtn.addEventListener('click', () => {
    timer.dispatchEvent(startEvent)
    startBtn.style.pointerEvents = 'none'
    startBtn.style.opacity = '0.5'
})

pauseBtn.addEventListener('click', () => {
    timer.dispatchEvent(pauseEvent)
    startBtn.style.pointerEvents = 'all'
    startBtn.style.opacity = '1'
})

resetBtn.addEventListener('click', () => {
    timer.dispatchEvent(resetEvent)
    startBtn.style.pointerEvents = 'all'
    startBtn.style.opacity = '1'
})