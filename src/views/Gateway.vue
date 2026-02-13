<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'
import { useMouse, useWindowSize } from '@vueuse/core'

const router = useRouter()
const { x, y } = useMouse()
const { width, height } = useWindowSize()

// Parallax Logic
const cardTransform = computed(() => {
  const moveX = (x.value - width.value / 2) * 0.02
  const moveY = (y.value - height.value / 2) * 0.02
  return {
    transform: `translate(${moveX}px, ${moveY}px)`
  }
})

const showTimeButton = ref(true)
const timeButtonText = ref('I need time')
const noButtonStyle = ref({ top: 'auto', left: 'auto', position: 'static' })
const isNoButtonFleeing = ref(false)
const showModal = ref(false)

const handleYes = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FF4D6D', '#FFF5F7'] // Gold and Pink
  })
  setTimeout(() => {
    router.push('/hub')
  }, 1000)
}

const handleNoHover = (e) => {
  const button = e.target
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Calculate new position at least 100px from edges
  const minX = 100
  const maxX = viewportWidth - 200 
  const minY = 100
  const maxY = viewportHeight - 100 

  const newX = Math.random() * (maxX - minX) + minX
  const newY = Math.random() * (maxY - minY) + minY

  noButtonStyle.value = {
    position: 'fixed',
    left: `${newX}px`,
    top: `${newY}px`,
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
  }
  isNoButtonFleeing.value = true
}

const handleNoClick = () => {
  showModal.value = true
}

const handleTimeClick = () => {
  timeButtonText.value = "I knew you would select that! Classic Coco move. 😉 Now, let's try again..."
  setTimeout(() => {
    showTimeButton.value = false
  }, 2000)
}

// Sparkles Logic
const sparkles = ref([])
onMounted(() => {
    // Generate sparkles
    sparkles.value = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
    }))
})
</script>

<template>
  <div class="gateway-container">
    <div class="princess-bg">
        <div class="gradient-mesh"></div>
        <div class="sparkles-layer">
            <div 
                v-for="s in sparkles" 
                :key="s.id" 
                class="sparkle"
                :style="{
                    left: s.x + '%',
                    top: s.y + '%',
                    width: s.size + 'px',
                    height: s.size + 'px',
                    animationDelay: s.delay + 's',
                    animationDuration: s.duration + 's'
                }"
            ></div>
        </div>
    </div>
    
    <div class="content glass-card" :style="cardTransform">
      <h1 class="header-text">
        <span class="arz-kiya">Arz kiya hai...</span> <br/>
        <span class="glow">Romans ka empire tha<br/> <span class="highlight-gold">Byzantine</span>... <br/><br/> Will you be my<br/> <span class="highlight-pink">Valentine?</span> 👉🏻👈🏻</span>
      </h1>

      <div class="button-group">
        <button class="btn yes-btn" @click="handleYes">
            <span class="btn-shine"></span>
            YES 💖
        </button>
        
        <button 
          class="btn no-btn" 
          :style="noButtonStyle"
          @mouseenter="handleNoHover"
          @click="handleNoClick"
        >
          NO 🏃‍♂️
        </button>

        <button 
          v-if="showTimeButton"
          class="btn time-btn" 
          @click="handleTimeClick"
        >
          {{ timeButtonText }}
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal">
        <h2>Error 404: Logic Not Found</h2>
        <p>Try again. (You really thought you could click no?)</p>
        <button class="modal-btn" @click="showModal = false">Okay...</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gateway-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
  font-family: var(--font-playfair);
}

/* Princess Background */
.princess-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #fad0c4, #ffd1ff);
	background-size: 400% 400%;
	animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

.sparkles-layer {
    position: absolute;
    width: 100%;
    height: 100%;
}

.sparkle {
    position: absolute;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
    opacity: 0;
    animation: twinkle linear infinite;
}

@keyframes twinkle {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
}

/* Content & UI */
.content {
  z-index: 10;
  transition: transform 0.1s ease-out;
  padding: 3rem;
  border-radius: 30px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}

.header-text {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 3rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.arz-kiya {
    font-size: 1.5rem;
    font-style: italic;
    opacity: 0.9;
}

.glow {
  text-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
}

.highlight-gold {
    color: #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.highlight-pink {
    color: #FF69B4;
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.6);
}

.button-group {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
}

.btn {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-family: var(--font-inter);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.yes-btn {
  background: linear-gradient(135deg, #FF4D6D 0%, #FF8FA3 100%);
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 25px rgba(255, 77, 109, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.yes-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 35px rgba(255, 77, 109, 0.6);
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% { left: -100%; }
    20% { left: 100%; }
    100% { left: 100%; }
}

.no-btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  position: relative; /* Initial position */
  z-index: 10;
  backdrop-filter: blur(5px);
}

.time-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
}

.time-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.modal {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  text-align: center;
}

.modal h2 {
    color: #FF4D6D;
    margin-bottom: 1rem;
}

.modal-btn {
    margin-top: 1.5rem;
    padding: 0.8rem 2rem;
    background: #FF4D6D;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
</style>
