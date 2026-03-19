import { defineStore } from 'pinia';
import { foodItems } from '../data/foodItems';
import { getFeedback } from '../data/ancestorFeedback';

export const useGameStore = defineStore('game', {
  state: () => ({
    // Items waiting to be placed
    readyQueue: [], 
    // Items currently on the table { 'slot-1-1': { id: 'apple', ... } }
    tablePlacements: {}, 
    // Items that haven't appeared yet
    remainingPool: [...foodItems],
    tipsHistory: [],
    currentHint: null,
    isGameActive: false,
    gamePhase: 'playing',   // 'playing' | 'judging' | 'result'
    feedbackResult: null,   // { tier, message }
    draggingItem: null,
    isTipsExpanded: false
  }),

  getters: {
    allPlatesPlaced(state) {
      return Object.keys(state.tablePlacements).length === foodItems.length;
    },
    // Logic to calculate the final score
    scoreResults(state) {
      let correct = 0;
      Object.entries(state.tablePlacements).forEach(([slotId, item]) => {
        if (item.targetSlot === slotId) correct++;
      });
      return {
        correct,
        total: foodItems.length,
        percentage: Math.round((correct / foodItems.length) * 100)
      };
    }
  },

  actions: {
    startGame() {
      if (this.isGameActive) return;
      this.isGameActive = true;
      
      // Spawn the first 3 plates immediately so the user isn't waiting
      for(let i = 0; i < 3; i++) this.spawnPlate();

      this.scheduleNextPlate();
      this.scheduleNextTip();
    },

    spawnPlate() {
      if (this.remainingPool.length > 0 && this.readyQueue.length < 4) {
        const randomIndex = Math.floor(Math.random() * this.remainingPool.length);
        const item = this.remainingPool.splice(randomIndex, 1)[0];
        this.readyQueue.push(item);
      }
    },

    scheduleNextPlate() {
      const wait = Math.floor(Math.random() * 5000) + 5000; // 5-10s
      setTimeout(() => {
        this.spawnPlate();
        if (this.remainingPool.length > 0) this.scheduleNextPlate();
      }, wait);
    },

    scheduleNextTip() {
      const wait = Math.floor(Math.random() * 8000) + 7000; // Mom talks every 7-15s
      setTimeout(() => {
        // Pick a random tip from the items still in the pool or on the table
        const allItems = [...foodItems];
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        
        // Use the description we added to foodItems.js earlier
        const tipText = randomItem.description || `Remember where the ${randomItem.name} goes!`;
        
        this.addTip(tipText);
        this.scheduleNextTip();
      }, wait);
    },

    setDraggingItem(item) {
      this.draggingItem = item;
    },

    // This handles moving an item to a slot
    placeItem(slotId, item) {
      //  Remove item from wherever it was (Ready Queue or another Slot)
      this.readyQueue = this.readyQueue.filter(i => i.id !== item.id);
      
      // Remove from any other slot it might have been in (for swapping)
      for (const key in this.tablePlacements) {
        if (this.tablePlacements[key]?.id === item.id) {
          delete this.tablePlacements[key];
        }
      }

      // Place it in the new slot
      this.tablePlacements[slotId] = item;
    },

    addTip(text) {
      this.currentHint = text;
      if (!this.tipsHistory.includes(text)) {
        this.tipsHistory.push(text);
      }
      // Auto-hide speech bubble after 5s
      setTimeout(() => {
        if (this.currentHint === text) this.currentHint = null;
      }, 5000);
    },

    toggleTips() {
      this.isTipsExpanded = !this.isTipsExpanded;
    },

    submitTable() {
      if (this.gamePhase !== 'playing') return;
      this.gamePhase = 'judging';

      setTimeout(() => {
        const { percentage } = this.scoreResults;
        this.feedbackResult = getFeedback(percentage);
        this.gamePhase = 'result';
      }, 6000); // 6s wait — gives you room for animation
    },

    replayGame() {
      this.$reset(); // Pinia built-in — resets to initial state
      this.startGame();
    }
  }
});
