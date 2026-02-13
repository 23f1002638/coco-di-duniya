<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useMouse, useWindowSize } from '@vueuse/core'

const router = useRouter()
const { width, height } = useWindowSize()
const { x: mouseX, y: mouseY } = useMouse()

// Poem Content
const poemStanzas = [
  [
    "I saw your face, a shadow in the light,",
    "A fleeting spark against the velvet night.",
    "I reached for you, but distance held its ground,",
    "A silent space where not a breath was found."
  ],
  [
    "They say the world is loud and built on greed,",
    "That hearts are lost in everything we need.",
    "But in the rush, I stopped and looked at you,",
    "And found a truth I never thought was true."
  ],
  [
    "It isn’t eyes that see the way we feel,",
    "For what is hidden is the most of real.",
    "Beyond the miles, beyond the reach of hands,",
    "My heart has found the place it understands."
  ],
  [
    "So let the noise of every city fade,",
    "Within this peace, I’m never more afraid.",
    "For in your light, the shadows cease to be,",
    "You are the home, the quiet soul of me."
  ]
]

// State
const activeStanza = ref(0)
const showFinale = ref(false)
const showHomeButton = ref(false)
const containerRef = ref(null)
const canvasRef = ref(null)

// --- Canvas Logic (Stars, Trails, Finale) ---
let ctx = null
let animationFrameId = null
let stars = []
let particles = [] // For cursor trail and clicks

// Star Class
class Star {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.size = Math.random() * 1.5
    this.baseAlpha = Math.random() * 0.8 + 0.2
    this.alpha = this.baseAlpha
    this.flickerSpeed = Math.random() * 0.02
    this.angle = Math.random() * Math.PI * 2
    
    // Finale target
    this.targetX = null
    this.targetY = null
    this.isMovingToTarget = false
  }

  update() {
    // Flicker
    this.alpha += Math.sin(this.angle) * 0.01
    this.angle += this.flickerSpeed
    
    // Gentle float
    if (!this.isMovingToTarget) {
       this.y -= 0.05 // Slowly drift up
       if (this.y < 0) this.y = height.value
    }
  }

  draw(c) {
    c.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.alpha))})`
    c.beginPath()
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    c.fill()
  }
}

// Particle Class (Golden Dust)
class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = Math.random() * 2 + 1
        this.life = 100 // frames
        this.vx = (Math.random() - 0.5) * 1
        this.vy = (Math.random() - 0.5) * 1 + 0.5 // Fall down
        this.color = `255, 215, 0` // Gold
    }

    update() {
        this.x += this.vx
        this.y += this.vy
        this.life--
        this.size *= 0.95
    }

    draw(c) {
        c.fillStyle = `rgba(${this.color}, ${this.life / 100})`
        c.beginPath()
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        c.fill()
    }
}

// COCO Points Generator
const getCocoPoints = (w, h) => {
    // Generate simple points for "COCO" centered
    const points = []
    const cx = w / 2
    const cy = h / 2
    const radius = 60
    const spacing = 140
    
    // C (First)
    for(let a = 0.5; a < 5.8; a += 0.2) {
        points.push({x: cx - spacing * 1.5 + Math.cos(a) * radius, y: cy + Math.sin(a) * radius})
    }
    // O
    for(let a = 0; a < 6.3; a += 0.2) {
        points.push({x: cx - spacing * 0.5 + Math.cos(a) * radius, y: cy + Math.sin(a) * radius})
    }
    // C (Second)
    for(let a = 0.5; a < 5.8; a += 0.2) {
        points.push({x: cx + spacing * 0.5 + Math.cos(a) * radius, y: cy + Math.sin(a) * radius})
    }
    // O
    for(let a = 0; a < 6.3; a += 0.2) {
        points.push({x: cx + spacing * 1.5 + Math.cos(a) * radius, y: cy + Math.sin(a) * radius})
    }
    
    return points
}

const initCanvas = () => {
    const canvas = canvasRef.value
    if(!canvas) return

    canvas.width = width.value
    canvas.height = height.value
    ctx = canvas.getContext('2d')

    // Init Stars
    for(let i = 0; i < 400; i++) {
        stars.push(new Star(width.value, height.value))
    }

    animate()
}

const animate = () => {
    if(!ctx) return
    ctx.clearRect(0, 0, width.value, height.value)

    // Stars
    stars.forEach(star => {
        star.update()
        star.draw(ctx)
    })

    // Particles
    particles.forEach((p, index) => {
        p.update()
        p.draw(ctx)
        if(p.life <= 0) particles.splice(index, 1)
    })
    
    // Cursor Dust
    if(Math.random() > 0.5) { // Throttle
        particles.push(new Particle(mouseX.value, mouseY.value))
    }

    animationFrameId = requestAnimationFrame(animate)
}

// Scroll Intersection Logic
const stanzaRefs = ref([])
onMounted(() => {
    initCanvas()
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Determine which stanza is active based on index
                const index = parseInt(entry.target.dataset.index)
                activeStanza.value = index
                
                // If last stanza (3), wait and trigger finale
                if (index === 3 && !showFinale.value) {
                    setTimeout(triggerFinale, 4000) // Wait for them to read
                }
            }
        })
    }, {
        threshold: 0.6 // Trigger when 60% visible
    })
    
    stanzaRefs.value.forEach(el => observer.observe(el))
})

const handleScreenClick = (e) => {
    // Burst of particles
    for(let i=0; i<10; i++) {
        particles.push(new Particle(e.clientX, e.clientY))
    }
}

const triggerFinale = () => {
    showFinale.value = true
    
    // Converge stars to COCO
    const targetPoints = getCocoPoints(width.value, height.value)
    
    // Pick random stars to move
    // We might have more stars than points, or fewer.
    // If fewer, assume we use all stars for points (cycling). 
    // If more, excess stars stay/fade.
    
    stars.forEach((star, i) => {
        if(i < targetPoints.length) {
            star.isMovingToTarget = true
            gsap.to(star, {
                x: targetPoints[i].x,
                y: targetPoints[i].y,
                duration: 3,
                ease: "power2.inOut"
            })
        } else {
             gsap.to(star, {
                alpha: 0,
                duration: 2
            })
        }
    })
    
    setTimeout(() => {
        showHomeButton.value = true
    }, 4000)
}

onUnmounted(() => {
    if(animationFrameId) cancelAnimationFrame(animationFrameId)
})

</script>

<template>
  <div class="poetry-container" @click="handleScreenClick" ref="containerRef">
    <canvas ref="canvasRef" class="background-canvas"></canvas>
    
    <!-- Shooting Stars Layer (CSS) -->
    <div class="shooting-stars">
        <div v-for="n in 3" :key="n" class="shooting-star"></div>
    </div>

    <!-- Poetry Content -->
    <div class="content-scroller" :class="{ 'fade-out': showFinale }">
      <div class="spacer"></div> <!-- Push content down -->
      
      <div 
        v-for="(stanza, index) in poemStanzas" 
        :key="index"
        ref="stanzaRefs"
        :data-index="index"
        class="stanza-block"
        :class="{ active: activeStanza === index, blur: activeStanza !== index }"
      >
        <p v-for="(line, lineIndex) in stanza" :key="lineIndex" class="poem-line">
           {{ line }}
        </p>
      </div>

      <div class="spacer"></div> <!-- Allow scrolling past -->
    </div>

    <!-- Finale UI -->
    <transition name="fade">
        <div v-if="showHomeButton" class="home-container">
            <button class="pulse-btn" @click="router.push('/hub')">
                Back to Our World
            </button>
        </div>
    </transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

.poetry-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden; /* Hide scrollbar of main container, inner scroller handles content */
  color: #FFF9E5;
  font-family: 'Dancing Script', cursive;
  cursor: none; /* We use custom trail, maybe hide default cursor? Or keep it. 'golden dust follow her cursor' implies we see it/dust. Let's keep cursor or hide? Keep for usability. */
  cursor: default;
}

.background-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-scroller {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 1s;
}

.content-scroller.fade-out {
    opacity: 0;
    pointer-events: none;
}

/* Hide Scrollbar */
.content-scroller::-webkit-scrollbar {
  display: none;
}
.content-scroller {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.spacer {
  height: 50vh;
  width: 100%;
  flex-shrink: 0;
}

.stanza-block {
  min-height: 80vh; /* One stanza per screen loosely */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: all 1.5s ease;
  padding: 2rem;
  opacity: 0.2;
  transform: translateY(20px) scale(0.95);
  filter: blur(4px);
}

.stanza-block.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.poem-line {
  font-size: 2.5rem;
  line-height: 1.8;
  margin: 0.5rem 0;
  text-shadow: 0 0 15px rgba(255, 249, 229, 0.6);
  animation: float 6s ease-in-out infinite;
}

@media (max-width: 768px) {
  .poem-line {
    font-size: 1.5rem;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Shooting Stars */
.shooting-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

.shooting-star {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 2px;
    background: linear-gradient(-45deg, #5f91ff, rgba(0, 0, 255, 0));
    filter: drop-shadow(0 0 6px #699bff);
    animation: tail 3000ms ease-in-out infinite, shooting 3000ms ease-in-out infinite;
}

.shooting-star::before, .shooting-star::after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(-45deg, rgba(0, 0, 255, 0), #5f91ff, rgba(0, 0, 255, 0));
    border-radius: 100%;
    transform: translateX(50%) rotateZ(45deg);
    animation: shining 3000ms ease-in-out infinite;
}

.shooting-star::after {
    transform: translateX(50%) rotateZ(-45deg);
}

.shooting-star:nth-child(1) {
    top: calc(10% - 200px);
    left: calc(10% - 300px);
    animation-delay: 6500ms;
}
.shooting-star:nth-child(2) {
    top: calc(50% - -100px);
    left: calc(50% - 250px);
    animation-delay: 1500ms;
}
.shooting-star:nth-child(3) {
    top: calc(50% - -50px);
    left: calc(50% - 200px);
    animation-delay: 9000ms;
}

@keyframes tail {
    0% { width: 0; }
    30% { width: 100px; }
    100% { width: 0; }
}
@keyframes shooting {
    0% { transform: translateX(0); }
    100% { transform: translateX(300px); }
}

/* Home Button */
.home-container {
    position: absolute;
    bottom: 20%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 100;
}

.pulse-btn {
    background: transparent;
    border: 1px solid rgba(255, 249, 229, 0.3);
    color: #FFF9E5;
    font-family: var(--font-inter); /* Clean font for button */
    padding: 1rem 3rem;
    font-size: 1.2rem;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(255, 249, 229, 0.2);
    animation: pulse 3s infinite;
    transition: background 0.3s;
}

.pulse-btn:hover {
    background: rgba(255, 249, 229, 0.1);
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 249, 229, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(255, 249, 229, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 249, 229, 0); }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 2s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
