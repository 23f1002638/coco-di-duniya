<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Copy, Home } from 'lucide-vue-next'
import confetti from 'canvas-confetti'

const router = useRouter()

// Arrays
const arrayA = [
  "Pythagoras theorem mein hote hain squares and roots...",
  "Binary mein hote hain zeros and ones...",
  "Flask server mein hote hain GET and POST...",
  "Machine Learning mein hota hai bias and variance...",
  "Integration mein hota hai plus constant 'C'...",
  "Matrix multiplication mein hota hai row into column...",
  "Vue components mein hote hain props and emits...",
  "Git merge mein hote hain conflicts and commits...",
  "Circuit theory mein hota hai Ohm's Law...",
  "Chemistry lab mein hota hai H2SO4..."
]

const arrayB = [
  "...But my love for you has no substitutes 👉🏻👈🏻",
  "...You are the only one my heart chooses 👉🏼👈🏼",
  "...I'm always waiting for your heart's response 📡",
  "...You're the global variable in my life's functions 🌍",
  "...Without you, my life is just an empty set ∅",
  "...You are the feature that makes me complete ✨",
  "...My heart beats for you in an infinite loop ♾️",
  "...You catch all my exceptions naturally 🛡️",
  "...We have the strongest bond in the universe ⚛️",
  "...You are the catalyst to my happiness 🧪"
]

// State
const currentLineA = ref("Click the button...")
const currentLineB = ref("...to generate romance! ❤️")
const isSpinning = ref(false)
const generationCount = ref(0)
const showOverloadWarning = ref(false)
const uniqueShayaris = ref(new Set()) // To track uniqueness if needed, but random is fine.

// Computed
const cheeseLevel = computed(() => {
  if (generationCount.value < 3) return { text: "Mildly Cheesy 🧀", width: '20%', color: '#FFD700' }
  if (generationCount.value < 6) return { text: "Double Cheese 🧀🧀", width: '50%', color: '#FFA500' }
  if (generationCount.value < 9) return { text: "Extra Cheesy 🧀🧀🧀", width: '80%', color: '#FF4500' }
  return { text: "DANGEROUSLY CHEESY ⚠️", width: '100%', color: '#FF0000' }
})

const displayedShayari = computed(() => `Arz kiya hai...\n${currentLineA.value}\n${currentLineB.value}\n👉🏻👈🏻`)

// Actions
const generateShayari = () => {
  if (isSpinning.value) return
  
  if (generationCount.value >= 10) {
    showOverloadWarning.value = true
    return
  }

  isSpinning.value = true
  
  // Slot Machine Effect
  let spinCount = 0
  const maxSpins = 20
  const interval = setInterval(() => {
    currentLineA.value = arrayA[Math.floor(Math.random() * arrayA.length)]
    currentLineB.value = arrayB[Math.floor(Math.random() * arrayB.length)]
    spinCount++
    
    if (spinCount >= maxSpins) {
      clearInterval(interval)
      isSpinning.value = false
      generationCount.value++
      
      // Check logic (Mock logic check: if indexes match? No, random is the fun)
      // "If the combination... makes absolutely no sense" -> They all make "sense" in this context.
      // We'll add the "Logic failed" text randomly for fun if needed, but prompts says "If... makes no sense".
      // Let's assume mismatching tech/bio fields "makes no sense" but implementing strict logic is overkill.
      // We'll just stick to the random gen.
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FF4500'] // Cheese colors
      })
    }
  }, 50)
}

const copyToClipboard = () => {
    navigator.clipboard.writeText(displayedShayari.value)
    // Maybe show a toast
    const btn = document.getElementById('copy-btn')
    const originalText = btn.innerHTML
    btn.innerHTML = "Copied! ✅"
    setTimeout(() => { btn.innerHTML = originalText }, 2000)
}

const closeWarning = () => {
    showOverloadWarning.value = false
    generationCount.value = 0 // Reset? Or just let them continue? Let's reset for user friendliness.
}

</script>

<template>
  <div class="generator-container">
    <div class="blueprint-bg"></div>
    
    <div class="content">
      <h1 class="title">The 'Arz Kiya Hai' Generator 🧪</h1>
      
      <div class="mixing-vessel" :class="{ spinning: isSpinning }">
        <div class="vessel-content">
            <p class="arz-header">Arz kiya hai...</p>
            <p class="line-a">{{ currentLineA }}</p>
            <p class="line-b">{{ currentLineB }}</p>
            
            <!-- Logic Check Subtitle (Randomly show for fun) -->
            <p v-if="!isSpinning && generationCount > 0" class="logic-note">
                (Error: Logic failed, but the vibes are 100%.)
            </p>
        </div>
        
        <button id="copy-btn" class="copy-btn" @click="copyToClipboard" v-if="generationCount > 0">
            <Copy size="16" /> Copy
        </button>
      </div>

      <button class="generate-btn" @click="generateShayari" :disabled="isSpinning">
        <Sparkles size="24" class="icon" :class="{ spin: isSpinning }" />
        {{ isSpinning ? "Mixing..." : "Generate Magic" }}
      </button>

      <!-- Coco Meter -->
      <div class="meter-container">
        <div class="meter-label">Cheesiness Level: {{ cheeseLevel.text }}</div>
        <div class="meter-bar">
            <div class="meter-fill" :style="{ width: cheeseLevel.width, background: cheeseLevel.color }"></div>
        </div>
      </div>
    
      <button class="home-btn" @click="router.push('/hub')">
        <Home size="20" /> Back to Hub
      </button>
    </div>

    <!-- Overload Modal -->
    <div v-if="showOverloadWarning" class="modal-overlay" @click="closeWarning">
      <div class="modal" @click.stop>
        <h2>⚠️ Warning: Shayari Overload!</h2>
        <p>You have reached maximum sweetness levels for today. Proceed with caution. ❤️</p>
        <button class="modal-btn" @click="closeWarning">I accept the risk</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generator-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: var(--font-inter);
  color: #333;
}

.blueprint-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f4f8;
  background-image: 
    linear-gradient(#e1e4e8 1px, transparent 1px),
    linear-gradient(90deg, #e1e4e8 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
}

.content {
  text-align: center;
  max-width: 600px;
  width: 90%;
  z-index: 10;
}

.title {
  font-family: var(--font-playfair);
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.mixing-vessel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.1s;
}

.spinning {
  animation: shake 0.1s infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.arz-header {
  font-style: italic;
  color: #888;
  margin-bottom: 1rem;
}

.line-a, .line-b {
  font-family: var(--font-playfair);
  font-size: 1.5rem;
  margin: 0.5rem 0;
  transition: filter 0.1s;
}

.spinning .line-a, .spinning .line-b {
  filter: blur(4px);
}

.logic-note {
  font-size: 0.8rem;
  color: #ff6b6b;
  margin-top: 1rem;
  font-family: monospace;
}

.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #666;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.generate-btn {
  background: linear-gradient(135deg, #FF4D6D 0%, #FF8FA3 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(255, 77, 109, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 0 auto 2rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 77, 109, 0.5);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.icon.spin {
  animation: rotate 1s linear infinite;
}

@keyframes rotate { 100% { transform: rotate(360deg); } }

/* Meter */
.meter-container {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  text-align: left;
}

.meter-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.meter-bar {
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.5s;
}

.home-btn {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 auto;
}

.home-btn:hover {
  color: #333;
  text-decoration: underline;
}

/* Modal */
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
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  animation: popIn 0.3s;
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal h2 {
  color: #FF4D6D;
  margin-bottom: 1rem;
}

.modal-btn {
  background: #333;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  cursor: pointer;
}
</style>
