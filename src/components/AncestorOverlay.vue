<template>
  <Transition name="fade">
    <div v-if="gamePhase === 'judging' || gamePhase === 'result'" class="overlay" role="dialog" aria-modal="true" aria-labelledby="overlay-msg">

      <!-- Judging phase: incense waiting animation -->
      <div v-if="gamePhase === 'judging'" class="judging-view">
        <div class="incense-wrap" aria-hidden="true">
          <div class="incense-stick"></div>
          <div class="smoke" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.4}s` }"></div>
        </div>
        <p class="waiting-text">조상님들이 살펴보고 계십니다...</p>
      </div>

      <!-- Result phase: feedback + replay -->
      <div v-else class="result-view">
        <div class="result-card" :class="feedbackResult?.tier">
          <div class="tier-icon" aria-hidden="true">
            {{ tierIcon }}
          </div>
          <p id="overlay-msg" class="feedback-msg">{{ feedbackResult?.message }}</p>
          <p class="score-line">{{ scoreResults.correct }} / {{ scoreResults.total }} 정확</p>
          <button class="replay-btn" @click="store.replayGame()">
            다시 하기 🔄
          </button>
        </div>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const { gamePhase, feedbackResult, scoreResults } = storeToRefs(store);

const tierIcon = computed(() => ({
  perfect: '🏮',
  okay:    '🙏',
  wth:     '😤',
}[feedbackResult.value?.tier] ?? ''));
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* --- Judging phase --- */
.judging-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.waiting-text {
  color: #e0c89a;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  animation: pulse 2s ease-in-out infinite;
}

.incense-wrap {
  position: relative;
  width: 60px;
  height: 140px;
  display: flex;
  justify-content: center;
}

.incense-stick {
  position: absolute;
  bottom: 0;
  width: 4px;
  height: 100px;
  background: linear-gradient(to top, #6b3a1f, #a0522d);
  border-radius: 2px;
}

.smoke {
  position: absolute;
  bottom: 100px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(220, 200, 170, 0.7);
  animation: rise 3s ease-in infinite;
  filter: blur(3px);
}

@keyframes rise {
  0%   { transform: translateY(0) scaleX(1);   opacity: 0.8; }
  50%  { transform: translateY(-40px) scaleX(2); opacity: 0.4; }
  100% { transform: translateY(-80px) scaleX(3); opacity: 0; }
}

/* --- Result phase --- */
.result-card {
  background: #1a1208;
  border: 2px solid #8b6914;
  border-radius: 12px;
  padding: 2.5rem 3rem;
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: descend 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.result-card.perfect { border-color: #ffd700; box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
.result-card.okay    { border-color: #8b6914; }
.result-card.wth     { border-color: #8b2020; box-shadow: 0 0 20px rgba(139, 32, 32, 0.3); }

.tier-icon {
  font-size: 3.5rem;
  animation: sway 2s ease-in-out infinite;
}

.feedback-msg {
  color: #e0c89a;
  font-size: 1.15rem;
  line-height: 1.7;
  font-style: italic;
}

.score-line {
  color: #9e8a6a;
  font-size: 0.9rem;
}

.replay-btn {
  margin-top: 0.5rem;
  padding: 0.7rem 2rem;
  background: #8b6914;
  border: none;
  color: #fff8e7;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  transition: background 0.2s, transform 0.1s;
}
.replay-btn:hover  { background: #a87d1a; }
.replay-btn:active { transform: scale(0.97); }

/* --- Shared animations --- */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

@keyframes sway {
  0%, 100% { transform: rotate(-3deg); }
  50%       { transform: rotate(3deg); }
}

@keyframes descend {
  from { opacity: 0; transform: translateY(-30px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* --- Vue transition --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
