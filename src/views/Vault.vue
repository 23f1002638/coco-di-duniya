<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import Matter from 'matter-js'

const router = useRouter()

// --- Security State ---
const isLocked = ref(true)
const inputCode = ref('')
const isShaking = ref(false)
const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']
// '161204'
const CORRECT_CODE = '161204'

const handleKeyPress = (key) => {
  if (key === '⌫') {
    inputCode.value = inputCode.value.slice(0, -1)
  } else if (key !== '') {
    if (inputCode.value.length < 6) {
      inputCode.value += key
    }
  }
}

watch(inputCode, (newVal) => {
  if (newVal.length === 6) {
    if (newVal === CORRECT_CODE) {
      unlockVault()
    } else {
      triggerShake()
    }
  }
})

const triggerShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
    inputCode.value = ''
  }, 500)
}

const unlockVault = () => {
  inputCode.value = '' // Clear code for visuals
  // Transition effect handled by CSS (fade out security, fade in gallery)
  // We'll set a short timeout to allow the final heart to render before transition
  setTimeout(() => {
    isLocked.value = false
    nextTick(() => {
      initPhysics()
    })
  }, 500)
}

// --- Gallery State ---
const galleryRef = ref(null)
const expandedItem = ref(null)
let engine = null
let render = null
let runner = null
let mouseConstraint = null

// Shayaris Data
const getImageUrl = (name) => {
  return new URL(`../assets/memories/${name}`, import.meta.url).href
}

// Shayaris Data
const polaroids = [
  { id: 1, img: getImageUrl('1.jpg'), text: '3 into seven hota hai twenty one... \nTere bina mera dil hai undone. 💔' },
  { id: 2, img: getImageUrl('2.jpg'), text: '2 + 2 hota hai 4... \nI love you more and more! 🌹' },
  { id: 3, img: getImageUrl('3.jpg'), text: 'Circle ka area hota hai pi r square... \nMere dil mein sirf tu hai everywhere. ✨' },
  { id: 4, img: getImageUrl('4.jpg'), text: 'Newton ne diya tha gravity ka law... \nPar teri attraction ne mujhe kheencha, oh wow! 🍏' },
  { id: 5, img: getImageUrl('5.jpg'), text: 'Triangle ke angles ka sum hai 180... \nMain hoon tera, kya tu banegi meri tea? ☕' },
  { id: 6, img: getImageUrl('6.jpg'), text: 'Roses are red, Violets are blue... \nMy debugging skills fail when I look at you. 🐛' },
  { id: 7, img: getImageUrl('7.jpg'), text: 'Java mein classes, Python mein code... \nTere saath chalna hai life ka har road. 🛣️' },
  { id: 8, img: getImageUrl('8.jpg'), text: 'Click here to find peace...', isSpecial: true } 
]

const initPhysics = () => {
  if (!galleryRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  // Create Engine
  engine = Matter.Engine.create()
  engine.world.gravity.y = 0 // Zero gravity
  
  // Create Renderer
  render = Matter.Render.create({
    element: galleryRef.value,
    engine: engine,
    options: {
      width,
      height,
      wireframes: false,
      background: 'transparent'
    }
  })

  // Boundaries
  const wallOptions = { isStatic: true, render: { visible: false }, restitution: 1 }
  Matter.World.add(engine.world, [
    Matter.Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // Top
    Matter.Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Bottom
    Matter.Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions), // Right
    Matter.Bodies.rectangle(-50, height / 2, 100, height, wallOptions) // Left
  ])

  // Create Polaroids
  const bodies = polaroids.map((item, index) => {
    const x = Math.random() * (width - 200) + 100
    const y = Math.random() * (height - 200) + 100
    
    // We use a rectangle for physics body
    const body = Matter.Bodies.rectangle(x, y, 160, 200, {
      restitution: 0.9, // Bouncy
      frictionAir: 0.05, // Slight drag
      angle: Math.random() * Math.PI * 2,
      render: {
        sprite: {
          texture: item.img, // Matter.js supports sprites but simple images might be tricky to style perfectly as polaroids.
          // Using a custom renderer approach or simple boxes with background images is easier.
          // For simplicity in this prompt, let's try mapping DOM elements to bodies? NO, prompt specifically mentions "2D engine".
          // Matter.js Render is canvas based. To have "Polaroid components" (Vue components) driven by Physics, we need to sync them.
        }
      },
      plugin: {
        data: item // Store data for mapping
      }
    })
    
    // Initial impulse
    Matter.Body.setVelocity(body, { 
      x: (Math.random() - 0.5) * 5, 
      y: (Math.random() - 0.5) * 5 
    })

    return body
  })

  Matter.World.add(engine.world, bodies)

  // Mouse Control
  const mouse = Matter.Mouse.create(render.canvas)
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })
  Matter.World.add(engine.world, mouseConstraint)

  // Run
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)
  Matter.Render.run(render)

  // Sync Vue Components with Physics Bodies
  // Since we want interactive Vue components (flip, text), using Canvas render is limiting.
  // Better Approach: Run physics invisible, update Vue element positions.
  
  // Disable Matter Render to avoid canvas overlay
  Matter.Render.stop(render)
  render.canvas.remove()
  
  // Custom Loop to update positions
  const updateLoop = () => {
    bodies.forEach((body, index) => {
      const el = document.getElementById(`polaroid-${index}`)
      if (el) {
        const { x, y } = body.position
        const angle = body.angle
        el.style.transform = `translate(${x - 80}px, ${y - 100}px) rotate(${angle}rad)`
      }
    })
    requestAnimationFrame(updateLoop)
  }
  updateLoop()
  
  // Click detection from Matter.js event vs Vue event?
  // We can use Vue @click on the elements, but we need to check if it was a drag or click.
  // Simple check: if mouse coords haven't moved much.
}

const handlePolaroidClick = (item) => {
  if (isDragging.value) return // Prevent click if dragging
  
  expandedItem.value = item
}

// Drag detection
const isDragging = ref(false)
let startX, startY

const startDrag = (e) => {
  isDragging.value = false
  startX = e.clientX
  startY = e.clientY
}

const endDrag = (e) => {
  const dist = Math.hypot(e.clientX - startX, e.clientY - startY)
  if (dist > 5) isDragging.value = true
}

const closeExpanded = () => {
    if (expandedItem.value?.isSpecial) {
        router.push('/poetry')
    } else {
        expandedItem.value = null
    }
}
</script>

<template>
  <div class="vault-container">
    <!-- Security Checkpoint -->
    <transition name="dissolve">
      <div v-if="isLocked" class="security-screen">
        <div class="input-display" :class="{ shake: isShaking }">
          <span v-for="(char, i) in inputCode" :key="i" class="heart-mask">❤️</span>
          <span v-if="inputCode.length === 0" class="placeholder">Enter Code</span>
        </div>
        
        <div class="keypad">
          <button 
            v-for="key in keypad" 
            :key="key" 
            class="key-btn" 
            :class="{ empty: key === '' }"
            @click="handleKeyPress(key)"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </transition>

    <!-- Gallery -->
    <div v-show="!isLocked" ref="galleryRef" class="gallery-screen">
      <div 
        v-for="(item, index) in polaroids" 
        :key="item.id"
        :id="`polaroid-${index}`"
        class="polaroid"
        @mousedown="startDrag"
        @mouseup="(e) => endDrag(e) || handlePolaroidClick(item)"
      >
        <div class="photo"></div> <!-- Abstract placeholder or image -->
        <img :src="item.img" class="photo-img" draggable="false" />
      </div>

      <!-- Expanded Overlay -->
      <div v-if="expandedItem" class="overlay" @click="closeExpanded">
        <div class="card-expanded" @click.stop="closeExpanded">
          <div class="card-front">
             <img :src="expandedItem.img" />
          </div>
          <div class="card-back">
            <p class="shayari-text">{{ expandedItem.text }}</p>
            <p v-if="expandedItem.isSpecial" class="tap-hint">(Tap to proceed)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vault-container {
  height: 100vh;
  width: 100vw;
  background: #333;
  overflow: hidden;
  position: relative;
}

/* Security Screen */
.security-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 245, 247, 0.4) 0%, rgba(255, 228, 232, 0.8) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.input-display {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1.5rem 2.5rem;
  font-size: 2.5rem;
  letter-spacing: 0.5rem;
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  width: 320px;
  color: #ff4d6d;
}

.placeholder {
  font-size: 1rem;
  color: #999;
  letter-spacing: normal;
}

.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.key-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  font-family: var(--font-inter);
  cursor: pointer;
  transition: background 0.2s;
}

.key-btn:hover:not(.empty) {
  background: rgba(255, 255, 255, 0.8);
}

.key-btn.empty {
  cursor: default;
  background: transparent;
}

/* Dissolve Transition */
.dissolve-enter-active,
.dissolve-leave-active {
  transition: opacity 1s ease;
}

.dissolve-enter-from,
.dissolve-leave-to {
  opacity: 0;
}

/* Gallery Screen */
.gallery-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #222; /* Dark bg for contrast with polariods */
}

.polaroid {
  position: absolute; /* Controlled by JS physics */
  width: 160px;
  height: 200px;
  background: white;
  padding: 10px 10px 40px 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  cursor: pointer; /* Drag cursor handled by custom logic? */
  top: 0; 
  left: 0;
  /* Optimization: will-change transform */
  will-change: transform;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #eee;
}

/* Expanded Card */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.card-expanded {
  width: 300px;
  height: 400px;
  background: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  animation: flip 0.8s forwards;
}

@keyframes flip {
  0% { transform: scale(0.1) rotateY(0); }
  50% { transform: scale(1.1) rotateY(90deg); } /* Halfway */
  100% { transform: scale(1) rotateY(180deg); }
}

.card-front, .card-back {
  /* Actually using a simple flip visual trick or just swapping content? 
     Let's do a proper 3D flip card structure if we have time, 
     but simpler: The expanding animation mimics the reveal. 
     Prompt says: "back' of the card should reveal a Math-Shayari".
     So we should show the back. 
  */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.card-front {
    display: none; /* We show back immediately on expand? Or animated flip? 
    Let's just show the back styling directly for simplicity in this artifact */
}

.card-back {
    transform: rotateY(180deg); /* Counteract the parent flip to make text readable */
}

.shayari-text {
  font-family: 'Nothing You Could Do', cursive; /* Need to import handwritten font? Or standard cursive */
  font-family: cursive;
  font-size: 1.2rem;
  color: #333;
  white-space: pre-line;
}

.tap-hint {
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #666;
}

</style>
