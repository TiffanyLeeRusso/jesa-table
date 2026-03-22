<template>
  <div class="game-container">
    <header class="kitchen-area" aria-live="polite">
      <div v-if="currentHint" class="speech-bubble" role="status">
        <span class="sr-only">Mom says: </span>
        {{ currentHint }}
      </div>
    </header>

    <p class="gameplay-description">Drag plates from the ready area to their correct place on the table. When all plates are placed click the button below the table to make the offering to your ancestor.</p>

    <main class="gameplay-area">
      <section class="table-section" aria-label="Jesa Offering Table">
        <div class="table-with-screen">
          <img :src="byeongpungUrl" class="byeongpung" alt="" aria-hidden="true"/>
          <div class="table-scroll-wrap">
            <div class="jesa-table" role="grid" aria-label="Food placement grid">
              <div class="table-row" :class="{ 'drink-divider': row.isDrinkDivider }" v-for="row in tableRows" :key="row.row">
                <div 
                  v-for="slot in row.slots" 
                  :key="slot.id"
                  class="table-slot"
                  :class="{ 'drag-over': dragOverSlot === slot.id }"
                  :data-slot-id="slot.id"
                  @dragover.prevent="dragOverSlot = slot.id"
                  @dragleave="dragOverSlot = null"
                  @drop.prevent="onDrop(slot.id)"
                  >
                  <Plate
                    v-if="tablePlacements[slot.id]"
                    :item="tablePlacements[slot.id]"
                    @touchstart="onTouchStart($event, tablePlacements[slot.id])"
                    @touchmove="onTouchMove($event)"
                    @touchend="onTouchEnd($event)"
                    @touchcancel="onTouchCancel()"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="done">
          <button 
            v-if="allPlatesPlaced" 
            class="done-btn" 
            @click="store.submitTable()"
            aria-label="Finish and submit table"
            >
            차례 드리기 🙏
          </button>
        </div>
      </section>

      <aside class="ready-area" aria-labelledby="ready-title">
        <h3 id="ready-title">Ready Plates</h3>
        <div class="plate-queue" ref="readyAreaRef" role="list">
          <div v-if="readyQueue.length === 0" class="empty-msg">Waiting for kitchen...</div>
          <!-- Ready queue plates -->
          <Plate
            v-for="item in readyQueue"
            :key="item.id"
            :item="item"
            @touchstart="onTouchStart($event, item)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd($event)"
            @touchcancel="onTouchCancel()"
            />
        </div>
      </aside>
    </main>

    <AncestorOverlay />

    <div 
      class="tips-drawer"
      :class="{ expanded: isTipsExpanded }"
      role="complementary"
      aria-label="Mom's tips"
      >
      <button 
        @click="store.toggleTips()"
        class="tips-toggle"
        :aria-expanded="isTipsExpanded"
        aria-controls="tips-list"
        >
        {{ isTipsExpanded ? '✕ Close' : '💬 Mom\'s Tips' }}
      </button>
      <div id="tips-list" class="tips-content" :aria-hidden="!isTipsExpanded">
        <ul v-if="tipsHistory.length">
          <li v-for="(tip, index) in tipsHistory" :key="index">{{ tip }}</li>
        </ul>
        <p v-else>No tips yet. Pay attention to Mom!</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGameStore } from './stores/game';
import { storeToRefs } from 'pinia';
import { tableSlots } from './data/foodItems';
import { useTouchDrag } from './composables/useTouchDrag';
import Plate from './components/Plate.vue';
import AncestorOverlay from './components/AncestorOverlay.vue';
import byeongpungUrl from './assets/images/byeongpung_screen.svg'

const store = useGameStore();
const { 
  currentHint, 
  tipsHistory, 
  isTipsExpanded, 
  readyQueue, 
  allPlatesPlaced, 
  tablePlacements 
} = storeToRefs(store);

const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } = useTouchDrag(store);
const readyAreaRef = ref(null);
const slotRefs = ref({}); // Store refs like { 'slot-1-1': HTMLElement }

const dragOverSlot = ref(null);

const tableRows = computed(() => {
  const rows = {};
  tableSlots.forEach(slot => {
    const parts = slot.id.split('-');
    const rowNum = parseInt(parts[1]);
    if (!rows[rowNum]) rows[rowNum] = { row: rowNum, slots: [], isDrinkDivider: rowNum === 6 };
    rows[rowNum].slots.push(slot);
  });
  // row 1 is back/top, etc.
  return Object.values(rows).sort((a, b) => a.row - b.row);
});

function onDrop(slotId) {
  const item = store.draggingItem;
  if (item) {
    store.placeItem(slotId, item);
    store.setDraggingItem(null);
  }
  dragOverSlot.value = null;
}

// Start the game loop when the component loads
onMounted(async () => {
  store.startGame();
});
</script>

<style>
/* Basic Page Reset */
:root {
  --bg-color: #2c2c2c;
  --table-wood: #5d4037;
  --dark-wood: #3e2723;
  --accent: #e67e22;
}

body {
  margin: 0;
  background-color: var(--bg-color);
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
}

.sr-only {
  position: absolute;
  width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}

.game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* Accessible Kitchen Area */
.kitchen-area {
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.speech-bubble {
  background: white;
  color: #333;
  padding: 1rem;
  border-radius: 12px;
  border-left: 5px solid var(--accent);
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  max-width: 90%;
  position: relative;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: -12px;
  left: 2rem;          /* how far from left edge — adjust to taste */
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 12px solid white;
}

/* Gameplay description */
.gameplay-description {
  text-align: center;
  color: #c9a97a;
  font-size: 1.1rem;
  padding: 0 1rem 0.5rem;
  margin: 0 auto;
  font-style: italic;
  max-width: 500px;
}

/* Responsive Grid */
.gameplay-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 50px;
  box-sizing: border-box;
}

@media (min-width: 900px) {
  .gameplay-area {
    display: grid;
    grid-template-columns: 1fr 200px;
  }
}

.table-with-screen {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.byeongpung {
  width: 100%;
  display: block;
  margin-bottom: -70px;   /* pull the table up to overlap the screen's feet */
  position: relative;
  z-index: 0;
}

.table-scroll-wrap {
  position: relative;
  z-index: 1;             /* table sits in front of the screen */
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.jesa-table {
  width: 100%;
  min-width: 560px;  /* 7 slots × 70px + 6 gaps × 8px = 538px, round up */
  background: var(--table-wood);
  border: 8px solid var(--dark-wood);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  box-sizing: border-box;
}

.table-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
}

.table-row.drink-divider {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  position: relative;
  border-top: 8px solid var(--dark-wood);
}

.table-row.drink-divider::after {
  content: '차례주 (Drink Offering)';
  position: absolute;
  top: -0.65rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--table-wood);
  padding: 0 0.6rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  font-style: italic;
}

.table-slot {
  width: 70px;
  height: 70px;
  flex-shrink: 0;          /* never compress below 70px */
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

@media (min-width: 600px) {
  .table-slot {
    width: 90px;
    height: 90px;
  }
}

@media (min-width: 900px) {
  .table-slot {
    width: 100px;
    height: 100px;
  }
}

/* Visual cue when hovering a draggable item over a slot */
.table-slot.drag-over,
.table-slot.touch-drag-over {
  background: rgba(230, 126, 34, 0.2);
  border-color: var(--accent);
  border-style: solid;
  transform: scale(1.05);
}

.table-slot .plate-item {
  width: 100%;
  height: 100%;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
}

/* Ready Area: Swaps between sidebar and bottom row */
.ready-area {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
}

.plate-queue {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;
}

@media (min-width: 900px) {
  .plate-queue {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
  }
}

/* Buttons and Interactivity */
.done {
  text-align: center;
}

button {
  cursor: pointer;
  font-family: inherit;
}

.done-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: var(--accent);
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 4px;
}

.tips-drawer {
  position: fixed;
  bottom: 0;
  left: 1rem;
  width: 280px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  /* Sits off-screen below, tab pokes up */
  transform: translateY(calc(100% - 36px));
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tips-drawer.expanded {
  transform: translateY(0);
}

.tips-toggle {
  width:100%;
  align-self: flex-start;
  padding: 0 1rem;
  height: 36px;
  background: #444;
  color: white;
  border: none;
  border-radius: 8px 8px 0 0;
  font-size: 0.85rem;
  white-space: nowrap;
}

.tips-toggle:hover {
  background: #555;
}

.tips-content {
  background: #f4f4f4;
  color: #222;
  padding: 1rem;
  border-radius: 0 8px 0 0;
  max-height: 240px;
  overflow-y: auto;
  font-size: 0.85rem;
  line-height: 1.5;
}

.tips-content ul {
  margin: 0;
  padding-left: 1.2rem;
}

.tips-content li + li {
  margin-top: 0.5rem;
}
</style>
