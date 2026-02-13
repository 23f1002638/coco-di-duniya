<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { useMouse } from '@vueuse/core'

const coupons = ref([
  { id: 1, title: 'Merge Master', desc: 'I’ll handle the next 5 Git merge conflicts in our projects.', color: '#FFD700', claimed: false },
  { id: 2, title: 'Code-De-Bug', desc: 'One night of me debugging your Flask/Vue code while you relax.', color: '#00FF00', claimed: false },
  { id: 3, title: 'Documentation Slayer', desc: 'I will write the WBS, README, and Gantt charts for our BDM project.', color: '#FF00FF', claimed: false },
  { id: 4, title: 'IITM Proxy', desc: 'I will attend the boring parts of our next meeting and take notes for you.', color: '#00FFFF', claimed: false },
  { id: 5, title: 'Shayari API', desc: 'Unlimited access to my cheesy puns for 24 hours without complaint.', color: '#FFA500', claimed: false },
  { id: 6, title: 'Gorakhpur Treat', desc: 'Valid for a dinner date at your favorite local spot, my treat.', color: '#FF4D6D', claimed: false }
])

// Floating Animation
onMounted(() => {
  coupons.value.forEach((coupon, index) => {
    const el = document.getElementById(`coupon-${index}`)
    if (el) {
      // Random float
      gsap.to(el, {
        y: 'random(-20, 20)',
        x: 'random(-20, 20)',
        rotation: 'random(-5, 5)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  })
})

const handleDoubleClick = (coupon) => {
  if (!coupon.claimed) {
    coupon.claimed = true
    // Trigger confetti or sound?
  }
}

// Sparkle Cursor
const { x, y } = useMouse()
const sparkles = ref([])
let sparkleId = 0

const addSparkle = () => {
    // Limit sparkles
    if (sparkles.value.length > 20) sparkles.value.shift()
    
    sparkles.value.push({
        id: sparkleId++,
        x: x.value,
        y: y.value,
        size: Math.random() * 10 + 5
    })
    
    setTimeout(() => {
       // remove old sparkles logically if needed, but array shift handles limit
    }, 1000)
}

// Add sparkles on mouse move interval
let interval
onMounted(() => {
    interval = setInterval(addSparkle, 100)
})
onUnmounted(() => {
    clearInterval(interval)
})

</script>

<template>
  <div class="coupons-container">
    <h1 class="title">The Floating Perks of Being Coco</h1>
    <p class="subtitle">Double-click to claim your gift</p>

    <div class="cards-wrapper">
      <div 
        v-for="(coupon, index) in coupons" 
        :key="coupon.id"
        :id="`coupon-${index}`"
        class="coupon-card"
        :style="{ borderColor: coupon.color, boxShadow: `0 0 15px ${coupon.color}40` }"
        @dblclick="handleDoubleClick(coupon)"
      >
        <h3 :style="{ color: coupon.color }">{{ coupon.title }}</h3>
        <p>{{ coupon.desc }}</p>
        
        <div v-if="coupon.claimed" class="claimed-stamp">
            CLAIMED
        </div>
      </div>
    </div>

    <!-- Sparkles -->
    <div 
        v-for="s in sparkles" 
        :key="s.id"
        class="sparkle"
        :style="{ top: s.y + 'px', left: s.x + 'px', width: s.size + 'px', height: s.size + 'px' }"
    ></div>
  </div>
</template>

<style scoped>
.coupons-container {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  cursor: crosshair; /* Custom cursor style */
}

.title {
  font-family: var(--font-playfair);
  color: white;
  margin-top: 2rem;
  font-size: 2.5rem;
  text-align: center;
  z-index: 10;
}

.subtitle {
  color: rgba(255,255,255,0.6);
  margin-bottom: 2rem;
  z-index: 10;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  max-width: 1200px;
  padding: 2rem;
  z-index: 10;
}

.coupon-card {
  background: rgba(255, 255, 255, 0.05); /* Glass dark */
  backdrop-filter: blur(10px);
  border: 2px solid transparent; /* Set via inline style */
  border-radius: 15px;
  padding: 2rem;
  width: 300px;
  color: white;
  position: relative;
  transition: transform 0.3s;
  user-select: none;
}

.coupon-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.1);
}

.coupon-card h3 {
  font-family: var(--font-playfair);
  margin-top: 0;
  font-size: 1.5rem;
}

.claimed-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  border: 4px solid #FF4D6D;
  color: #FF4D6D;
  font-weight: bold;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  opacity: 0.8;
  animation: stamp 0.3s ease-out;
  background: rgba(0,0,0,0.5);
  pointer-events: none;
}

@keyframes stamp {
  0% { transform: translate(-50%, -50%) scale(2) rotate(-15deg); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1) rotate(-15deg); opacity: 0.8; }
}

.sparkle {
  position: fixed;
  background: white;
  border-radius: 50%;
  pointer-events: none;
  animation: fadeOut 1s forwards;
  box-shadow: 0 0 10px white;
}

@keyframes fadeOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0); }
}
</style>
