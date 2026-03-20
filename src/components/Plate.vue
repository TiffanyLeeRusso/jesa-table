<template>
  <div 
    class="plate-item" 
    :draggable="true"
    @dragstart="onDragStart"
    @touchstart.prevent="$emit('touchstart', $event)"
    @touchmove.prevent="$emit('touchmove', $event)"
    @touchend="$emit('touchend', $event)"
    @touchcancel="$emit('touchcancel', $event)"
    :aria-label="item.name"
  >
    <img :src="item.image" :alt="item.name" class="food-img" />
    <span class="food-label">{{ item.name }}</span>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game';

defineEmits(['dragstart', 'touchstart', 'touchmove', 'touchend', 'touchcancel']);

const props = defineProps({ item: Object });
const store = useGameStore();

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('itemId', props.item.id);
  store.setDraggingItem(props.item); // store the dragging item in Pinia
}
</script>

<style scoped>
.plate-item {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-width: 100px;
  max-height: 100px;
  /* remove the fixed 100px width/height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 5px;
  box-sizing: border-box;
  user-select: none;
  touch-action: none;
}

.plate-item:hover,
.plate-item:active {
  cursor: grabbing;
}

.food-img {
  width: 70%;
  height: auto;
  object-fit: contain;
  pointer-events: none; /* Prevents ghosting issues during drag */
}

.food-label {
  font-size: 0.6rem;
  color: #333;
  margin-top: 4px;
}
</style>
