// DOM
const muie = document.querySelector('.muie')
const head = document.querySelector('.head')
const body = document.querySelector('.body')
const sniper = document.querySelector('.sniper')
const arma = document.querySelector('.arma')
const carregador = document.querySelector('.carregador img')
const numbala = document.querySelector('.numbala')
const boya = document.querySelector('.boya')
const stats = document.querySelector('.stats p')

// AUDIO
const sndPow = new Audio('./assets/audio/shot.mp3')
const sndNobru = new Audio('./assets/audio/nobru.mp3')
const sndDamage = new Audio('./assets/audio/uf.mp3')
const sndDeath = new Audio('./assets/audio/oof.mp3')
const sndReload = new Audio('./assets/audio/reload.mp3')
const sndClick = new Audio('./assets/audio/click.mp3')
const sndMetal = new Audio('./assets/audio/metal.mp3')

// VARIABLES
let hp = 5
let ammo = 3
let shooting = false
let reloading = false
reloadWait = false
let alive = (Math.random() * (3) + 2).toFixed()

// FUNCTIONS
function kill() {
    playAudio(sndDeath)
    
    addRemove(muie, 'morto', 1500)
    addRemove(muie, 'sumido', 2000, 1000)
    addRemove(muie, 'walk', 2000, 3000)
    
    attStats()
    hp = 5
}

function attStats() {
    alive--
    if (alive > 0) { stats.innerHTML = `Restam ${alive} vivos` }
    else {
        boya.style.visibility = 'visible'
        playAudio(sndNobru)
    }
}

function shoot(damage) {
    if (shooting || reloading) return

    shooting = true
    setTimeout(e => { 
        shooting = false 
        if (reloadWait) reload()
    }, 500)
    
    if (ammo > 0) {
        ammo -= 1
        numbala.innerText = ammo

        hit(damage)
        playAudio(sndPow)
        addRemove(arma, 'recoil', 100)
    } 
    else {
        playAudio(sndClick)
        addRemove(arma, 'nobalas', 100)
    }
}

function hit(damage) {
    playAudio(sndPow)
    hp -= damage

    if (damage == 0) return
    if (hp <= 0) return kill() 
    playAudio(sndDamage)
}

function reload() {
    if (shooting) return reloadWait = true
    reloadWait = false
    reloading = true
    playAudio(sndReload)
    setTimeout(e => { reloading = false }, 1500)

    addRemove(arma, 'reload', 1400)
    addRemove(carregador, 'reload', 200)
    setTimeout(() => { numbala.innerHTML = '0' }, 200)
    setTimeout(() => { addRemove(arma, 'pulo', 300) }, 600)
    setTimeout(e => {
        ammo = 3
        numbala.innerHTML = ammo
    }, 1400)
}

function addRemove(dom, _class, time, delay = 0) {
    setTimeout(e => {
        dom.classList.add(_class)
        setTimeout(e => { dom.classList.remove(_class) }, time)
    }, delay)
}

function mapResizer() {
    areas = document.querySelectorAll('area')

    for (area of areas) { area.coordArr = area.coords.split(',') }
    
    function resizeMaps() {
        scale = muie.offsetWidth / 472
        for (area of areas) { area.coords = area.coordArr.map(coord => Math.round(coord * scale)).join(',') }
    }
    window.addEventListener('resize', () => resizeMaps())
    resizeMaps()
}

function playAudio(audio) {
    audio.currentTime = 0
    audio.play()
}

// EVENT LISTENER
carregador.addEventListener('click', e => reload(), false)
document.addEventListener('keypress', e => { if (e.key == 'r') reload() })
document.addEventListener('mousemove', e => { arma.style.left = `${e.x - arma.offsetWidth / 2}px`})

document.addEventListener('click', e => { if (e.target == document.body) shoot(0) }, false)
head.addEventListener('click', e => { shoot(5) }, false)
body.addEventListener('click', e => { shoot(1) }, false)
sniper.addEventListener('click', e => { sndMetal.play(); shoot(0) }, false)

window.addEventListener('load', e => mapResizer(), false)

// GERAL
stats.innerHTML = `Restam ${alive} vivos`