<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'

const router = useRouter()
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
    colors: ['#FF4D6D', '#FFE4E8', '#FFF5F7']
  })
  setTimeout(() => {
    router.push('/hub')
  }, 1500)
}

const handleNoHover = (e) => {
  const button = e.target
  const rect = button.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Calculate new position at least 100px from edges
  const minX = 100
  const maxX = viewportWidth - 200 // button width approx
  const minY = 100
  const maxY = viewportHeight - 100 // button height approx

  const newX = Math.random() * (maxX - minX) + minX
  const newY = Math.random() * (maxY - minY) + minY

  noButtonStyle.value = {
    position: 'fixed',
    left: `${newX}px`,
    top: `${newY}px`,
    transition: 'none' // Instant movement
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
</script>

<template>
  <div class="gateway-container">
    <div class="content">
      <h1 class="header-text">
        Arz kiya hai... <br/>
        <span class="glow">Romans ka empire tha byzantine, Romans ka empire tha byzantine... <br/> Will you be my valentine? 👉🏻👈🏻</span>
      </h1>

      <div class="button-group">
        <button class="btn yes-btn" @click="handleYes">YES 💖</button>
        
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
        <button @click="showModal = false">Okay...</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gateway-container {
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle, var(--color-rose) 0%, var(--color-blush) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
}

.header-text {
  font-family: var(--font-playfair);
  font-size: 2.5rem;
  color: #d6336c;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.glow {
  text-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
}

.button-group {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  /* Ensure relative positioning context for the No button initially, 
     though it switches to fixed when fleeing */
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-family: var(--font-inter);
  transition: transform 0.2s;
}

.yes-btn {
  background-color: var(--color-crimson);
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(255, 77, 109, 0.3);
  animation: heartbeat 1.5s infinite;
}

.yes-btn:hover {
  transform: scale(1.1);
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.1); }
  30% { transform: scale(1); }
  45% { transform: scale(1.1); }
  60% { transform: scale(1); }
  100% { transform: scale(1); }
}

.no-btn {
  background-color: #333;
  color: white;
  position: relative; /* Initial position */
  z-index: 10;
}

.time-btn {
  background: transparent;
  border: 2px solid #aaa;
  color: #666;
}

.time-btn:hover {
  background: rgba(0,0,0,0.05);
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
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}
</style>
