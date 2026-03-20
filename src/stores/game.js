import { defineStore } from 'pinia';
import { foodItems, tableSlots } from '../data/foodItems';
import { getFeedback } from '../data/ancestorFeedback';

export const useGameStore = defineStore('game', {
  state: () => ({
    // Items waiting to be placed
    readyQueue: [],
    // Items currently on the table { 'slot-1-1': { id: 'apple', ... } }
    tablePlacements: {},
    tableSlotIds: Object.fromEntries(tableSlots.map(s => [s.id, true])),
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
      const wait = Math.floor(Math.random() * 11000) + 7000; // Mom talks every 10-15s
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

    // This handles moving an item to a slot (and re-homing anything current in that slot)
    placeItem(slotId, item) {
        // Find where the dragged item is coming from
        const fromSlot = Object.keys(this.tablePlacements)
              .find(key => this.tablePlacements[key]?.id === item.id);

        // Find what's currently in the target slot (if anything)
        const displaced = this.tablePlacements[slotId] ?? null;

        // Remove dragged item from its source
        this.readyQueue = this.readyQueue.filter(i => i.id !== item.id);
        if (fromSlot) delete this.tablePlacements[fromSlot];

        // Place dragged item in target slot
        this.tablePlacements[slotId] = item;

        // Rehome the displaced item
        if (displaced) {
            if (fromSlot) {
                // Came from another slot — swap
                this.tablePlacements[fromSlot] = displaced;
            } else {
                // Came from ready queue — send displaced back to queue if room
                if (this.readyQueue.length < 4) {
                    this.readyQueue.push(displaced);
                } else {
                    // Queue is full — find any empty slot on the table and park it there
                    const emptySlot = Object.keys(this.tableSlotIds ?? {})
                          .find(key => !this.tablePlacements[key]);
                    if (emptySlot) {
                        this.tablePlacements[emptySlot] = displaced;
                    } else {
                        // Last resort — bump it to queue anyway
                        this.readyQueue.push(displaced);
                    }
                }
            }
        }
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
