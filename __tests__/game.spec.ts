import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../src/stores/game'
import { foodItems } from '../src/data/foodItems'

vi.useFakeTimers()

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllTimers() // prevent recursive timer bleed between tests
  })

  // ------------------------------------------------------------------ startup
  describe('startGame', () => {
    it('populates readyQueue with 3 plates on start', () => {
      const store = useGameStore()
      store.startGame()
      expect(store.readyQueue).toHaveLength(3)
    })

    it('does not start twice if called again', () => {
      const store = useGameStore()
      store.startGame()
      store.startGame()
      expect(store.readyQueue).toHaveLength(3)
    })

    it('removes spawned items from remainingPool', () => {
      const store = useGameStore()
      store.startGame()
      expect(store.remainingPool).toHaveLength(foodItems.length - 3)
    })
  })

  // ------------------------------------------------------------------ spawning
  describe('spawnPlate', () => {
    it('adds a plate to readyQueue', () => {
      const store = useGameStore()
      store.spawnPlate()
      expect(store.readyQueue).toHaveLength(1)
    })

    it('does not exceed 4 plates in the queue', () => {
      const store = useGameStore()
      for (let i = 0; i < 10; i++) store.spawnPlate()
      expect(store.readyQueue.length).toBeLessThanOrEqual(4)
    })

    it('does nothing when remainingPool is empty', () => {
      const store = useGameStore()
      store.remainingPool = []
      store.spawnPlate()
      expect(store.readyQueue).toHaveLength(0)
    })
  })

  // ------------------------------------------------------------------ placing
  describe('placeItem', () => {
    it('moves an item from readyQueue to a table slot', () => {
      const store = useGameStore()
      store.spawnPlate()
      const item = store.readyQueue[0]
      store.placeItem('slot-1-1', item)
      expect(store.tablePlacements['slot-1-1']).toEqual(item)
      expect(store.readyQueue.find(i => i.id === item.id)).toBeUndefined()
    })

    it('swaps items when dropping onto an occupied slot from another slot', () => {
      const store = useGameStore()
      const [itemA, itemB] = foodItems
      store.tablePlacements['slot-1-1'] = itemA
      store.tablePlacements['slot-1-2'] = itemB
      store.placeItem('slot-1-2', itemA)
      expect(store.tablePlacements['slot-1-2']).toEqual(itemA)
      expect(store.tablePlacements['slot-1-1']).toEqual(itemB)
    })

    it('sends displaced item to readyQueue when dragging from queue to occupied slot', () => {
      const store = useGameStore()
      const [itemA, itemB] = foodItems
      store.tablePlacements['slot-1-1'] = itemA
      store.readyQueue.push(itemB)
      store.placeItem('slot-1-1', itemB)
      expect(store.tablePlacements['slot-1-1']).toEqual(itemB)
      expect(store.readyQueue.find(i => i.id === itemA.id)).toBeDefined()
    })

    it('allows moving a plate from one slot to an empty slot', () => {
      const store = useGameStore()
      const item = foodItems[0]
      store.tablePlacements['slot-1-1'] = item
      store.placeItem('slot-2-1', item)
      expect(store.tablePlacements['slot-2-1']).toEqual(item)
      expect(store.tablePlacements['slot-1-1']).toBeUndefined()
    })
  })

  // ------------------------------------------------------------------ scoring
  describe('scoreResults', () => {
    it('returns 0 correct when nothing is placed', () => {
      const store = useGameStore()
      expect(store.scoreResults.correct).toBe(0)
    })

    it('counts a correct placement', () => {
      const store = useGameStore()
      const item = foodItems[0]
      store.tablePlacements[item.targetSlot] = item
      expect(store.scoreResults.correct).toBe(1)
    })

    it('does not count a wrong placement', () => {
      const store = useGameStore()
      const item = foodItems[0]
      const wrongSlot = item.targetSlot === 'slot-1-1' ? 'slot-1-2' : 'slot-1-1'
      store.tablePlacements[wrongSlot] = item
      expect(store.scoreResults.correct).toBe(0)
    })

    it('calculates percentage correctly for a perfect table', () => {
      const store = useGameStore()
      foodItems.forEach(item => { store.tablePlacements[item.targetSlot] = item })
      expect(store.scoreResults.percentage).toBe(100)
      expect(store.scoreResults.correct).toBe(foodItems.length)
    })
  })

  // ------------------------------------------------------------------ allPlatesPlaced
  describe('allPlatesPlaced', () => {
    it('is false when table is empty', () => {
      const store = useGameStore()
      expect(store.allPlatesPlaced).toBe(false)
    })

    it('is true when every food item has been placed', () => {
      const store = useGameStore()
      foodItems.forEach(item => { store.tablePlacements[item.targetSlot] = item })
      expect(store.allPlatesPlaced).toBe(true)
    })
  })

  // ------------------------------------------------------------------ submitTable
  describe('submitTable', () => {
    it('transitions to judging phase on submit', () => {
      const store = useGameStore()
      store.submitTable()
      expect(store.gamePhase).toBe('judging')
    })

    it('transitions to result phase after timeout', () => {
      const store = useGameStore()
      store.submitTable()
      // Advance past the 6s judging delay only — don't runAllTimers (infinite loop)
      vi.advanceTimersByTime(7000)
      expect(store.gamePhase).toBe('result')
    })

    it('does not re-submit if already judging', () => {
      const store = useGameStore()
      store.submitTable()
      store.submitTable()
      expect(store.gamePhase).toBe('judging')
    })

    it('populates feedbackResult after timeout', () => {
      const store = useGameStore()
      store.submitTable()
      vi.advanceTimersByTime(7000)
      expect(store.feedbackResult).not.toBeNull()
      expect(store.feedbackResult).toHaveProperty('tier')
      expect(store.feedbackResult).toHaveProperty('message')
    })
  })

  // ------------------------------------------------------------------ tips
  describe('addTip', () => {
    it('sets currentHint', () => {
      const store = useGameStore()
      store.addTip('Put the rice on the right!')
      expect(store.currentHint).toBe('Put the rice on the right!')
    })

    it('adds tip to tipsHistory', () => {
      const store = useGameStore()
      store.addTip('Remember the candles.')
      expect(store.tipsHistory).toContain('Remember the candles.')
    })

    it('does not add duplicate tips to history', () => {
      const store = useGameStore()
      store.addTip('Same tip.')
      store.addTip('Same tip.')
      expect(store.tipsHistory.filter(t => t === 'Same tip.')).toHaveLength(1)
    })

    it('clears currentHint after 5 seconds', () => {
      const store = useGameStore()
      store.addTip('Fading tip.')
      vi.advanceTimersByTime(5001)
      expect(store.currentHint).toBeNull()
    })
  })

  // ------------------------------------------------------------------ replay
  describe('replayGame', () => {
    it('resets game state and restarts', () => {
      const store = useGameStore()
      store.startGame()
      foodItems.forEach(item => { store.tablePlacements[item.targetSlot] = item })
      store.submitTable()
      vi.advanceTimersByTime(7000)

      vi.clearAllTimers() // stop recursive timers before $reset
      store.replayGame()

      expect(store.gamePhase).toBe('playing')
      expect(store.tablePlacements).toEqual({})
      expect(store.feedbackResult).toBeNull()
      expect(store.readyQueue).toHaveLength(3)
    })
  })
})
