<script setup>
import { useRouter } from 'vue-router'
import { Lock, Ticket, Feather, Sparkles } from 'lucide-vue-next'

const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="hub-container">
    <h1 class="hub-title">Welcome to Coco's World 🌍</h1>
    
    <div class="card-grid">
      <div class="card vault-card" @click="navigateTo('/vault')">
        <Lock size="48" color="#FF4D6D" />
        <h2>The Vault</h2>
        <p>161204 - Top Secret</p>
      </div>

      <div class="card coupons-card" @click="navigateTo('/coupons')">
        <Ticket size="48" color="#4D6DFF" />
        <h2>Coupon Center</h2>
        <p>Redeem your gifts</p>
      </div>

      <div class="card generator-card" @click="navigateTo('/shayari-generator')">
        <Sparkles size="48" color="#FF8FA3" />
        <h2>Shayari Gen</h2>
        <p>Infinite Cheesiness</p>
      </div>

      <div class="card poetry-card" @click="navigateTo('/poetry')">
        <Feather size="48" color="#FFD700" />
        <h2>Poetry Corner</h2>
        <p>Quiet reflection...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hub-container {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle, var(--color-rose) 0%, var(--color-blush) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hub-title {
  font-family: var(--font-playfair);
  color: #d6336c;
  margin-bottom: 3rem;
  font-size: 3rem;
  text-shadow: 0 2px 10px rgba(255, 77, 109, 0.2);
}

.card-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  width: 250px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 77, 109, 0.2);
}

.card h2 {
  margin: 1rem 0 0.5rem;
  color: #333;
  font-family: var(--font-playfair);
}

.card p {
  color: #666;
  font-size: 0.9rem;
}

.vault-card { border-bottom: 5px solid #FF4D6D; }
.coupons-card { border-bottom: 5px solid #4D6DFF; }
.generator-card { border-bottom: 5px solid #FF8FA3; }
.poetry-card { border-bottom: 5px solid #FFD700; }
</style>
