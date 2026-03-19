<template>
  <div class="game-container">
    <header class="kitchen-area" aria-live="polite">
      <div v-if="currentHint" class="speech-bubble" role="status">
        <span class="sr-only">Mom says: </span>
        {{ currentHint }}
      </div>
    </header>

    <main class="gameplay-area">
      <section class="table-section" aria-label="Jesa Offering Table">
        <div class="jesa-table" role="grid" aria-label="Food placement grid">
          <div 
            v-for="slot in tableSlots" 
            :key="slot.id"
            class="table-slot"
            :class="{ 'drag-over': dragOverSlot === slot.id }"
            @dragover.prevent="dragOverSlot = slot.id"
            @dragleave="dragOverSlot = null"
            @drop.prevent="onDrop(slot.id)"
            >
            <Plate v-if="tablePlacements[slot.id]" :item="tablePlacements[slot.id]" />
          </div>
        </div>

        <button 
          v-if="allPlatesPlaced" 
          class="done-btn" 
          @click="store.submitTable()"
          aria-label="Finish and submit table"
          >
          차례 드리기 🙏
        </button>
      </section>

      <aside class="ready-area" aria-labelledby="ready-title">
        <h3 id="ready-title">Ready Plates</h3>
        <div class="plate-queue" ref="readyAreaRef" role="list">
          <div v-if="readyQueue.length === 0" class="empty-msg">Waiting for kitchen...</div>
          <Plate 
            v-for="item in readyQueue" 
            :key="item.id" 
            :item="item"
            />
        </div>
      </aside>
    </main>

    <AncestorOverlay />

    <footer 
      class="tips-accordion" 
      :class="{ expanded: isTipsExpanded }"
      role="complementary"
    >
      <button 
        @click="isTipsExpanded = !isTipsExpanded" 
        class="tips-toggle"
        :aria-expanded="isTipsExpanded"
        aria-controls="tips-list"
      >
        {{ isTipsExpanded ? '▼ Close Tips' : '▲ View Mom\'s Tips' }}
      </button>
      <div id="tips-list" class="tips-content" :aria-hidden="!isTipsExpanded">
        <ul v-if="tipsHistory.length">
          <li v-for="(tip, index) in tipsHistory" :key="index">{{ tip }}</li>
        </ul>
        <p v-else>No tips yet. Pay attention to Mom!</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useGameStore } from './stores/game';
import { storeToRefs } from 'pinia';
import { tableSlots } from './data/foodItems';
import Plate from './components/Plate.vue';
import AncestorOverlay from './components/AncestorOverlay.vue';

const store = useGameStore();
const { 
  currentHint, 
  tipsHistory, 
  isTipsExpanded, 
  readyQueue, 
  allPlatesPlaced, 
  tablePlacements 
} = storeToRefs(store);

const readyAreaRef = ref(null);
const slotRefs = ref({}); // Store refs like { 'slot-1-1': HTMLElement }

const dragOverSlot = ref(null);

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
}

/* Responsive Grid */
.gameplay-area {
  display: grid;
  grid-template-columns: 1fr; /* Default to 1 column for mobile */
  flex-grow: 1;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 900px) {
  .gameplay-area {
    grid-template-columns: 1fr 300px;
  }
}

.table-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.jesa-table {
  width: 100%;
  aspect-ratio: 4 / 3;
  max-width: 800px;
  background: var(--table-wood);
  border: 8px solid #3e2723;
  border-radius: 4px;
  display: grid; 
  /* Create 3 columns */
  grid-template-columns: repeat(3, 1fr);
  /* Create 3 rows */
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.table-slot {
  width: 100%; /* Fill the grid cell */
  max-width: 120px;
  aspect-ratio: 1 / 1;
  margin: auto; /* Center in the grid cell */
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: auto;
  min-height: 100px;
  min-width: 100px;
}

/* Visual cue when hovering a draggable item over a slot */
.table-slot [data-drag-over="true"] {
  background: rgba(230, 126, 34, 0.2); /* Light orange highlight */
  border-color: var(--accent);
  border-style: solid;
  transform: scale(1.05);
}

/* Ensure plates inside the table fit the slot */
.table-slot .plate-item {
  width: 100%;
  height: 100%;
  box-shadow: 0 8px 15px rgba(0,0,0,0.4); /* Extra shadow when on table */
}

/* Ready Area: Swaps between sidebar and bottom row */
.ready-area {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
}

.plate-queue {
  display: flex;
  flex-direction: row; /* Horizontal on mobile */
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

@media (min-width: 900px) {
  .plate-queue {
    flex-direction: column; /* Vertical on desktop */
  }
}

/* Buttons and Interactivity */
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

.tips-accordion {
  position: sticky;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  margin-left: 1rem;
  background: #f4f4f4;
  color: #222;
  border-radius: 8px 8px 0 0;
  z-index: 10;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(calc(100% - 40px));
}

.tips-accordion.expanded {
  transform: translateY(0);
}

.tips-toggle {
  width: 100%;
  height: 40px;
  background: #444;
  color: white;
  border: none;
  border-radius: 8px 8px 0 0;
}
</style>
