import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../src/stores/game'
import { useTouchDrag } from '../src/composables/useTouchDrag'
import { foodItems } from '../src/data/foodItems'

function makeElement(className: string): HTMLElement {
  const el = document.createElement('div')
  el.className = className
  document.body.appendChild(el)
  return el
}

function makeTouchEvent(type: string, x: number, y: number, target: HTMLElement): TouchEvent {
  const touch = {
    clientX: x, clientY: y, identifier: 1, target,
    pageX: x, pageY: y, screenX: x, screenY: y,
    force: 1, radiusX: 1, radiusY: 1, rotationAngle: 0
  } as unknown as Touch

  return new TouchEvent(type, {
    touches: type === 'touchend' ? [] : [touch],
    changedTouches: [touch],
    cancelable: true, bubbles: true,
  })
}

// jsdom doesn't implement elementFromPoint — define it manually first
function stubElementFromPoint(returnValue: Element | null) {
  if (!('elementFromPoint' in document)) {
    Object.defineProperty(document, 'elementFromPoint', {
      value: () => returnValue,
      writable: true,
      configurable: true,
    })
  } else {
    vi.spyOn(document, 'elementFromPoint').mockReturnValue(returnValue)
  }
}

describe('useTouchDrag', () => {
  let store: ReturnType<typeof useGameStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameStore()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('sets draggingItem in store on touchstart', () => {
    const { onTouchStart } = useTouchDrag(store)
    const el = makeElement('plate-item')
    const item = foodItems[0]
    const event = makeTouchEvent('touchstart', 50, 50, el)
    Object.defineProperty(event, 'currentTarget', { value: el })
    onTouchStart(event, item)
    expect(store.draggingItem).toEqual(item)
  })

  it('clears draggingItem on touchcancel', () => {
    const { onTouchStart, onTouchCancel } = useTouchDrag(store)
    const el = makeElement('plate-item')
    const item = foodItems[0]
    const event = makeTouchEvent('touchstart', 50, 50, el)
    Object.defineProperty(event, 'currentTarget', { value: el })
    onTouchStart(event, item)
    expect(store.draggingItem).toEqual(item) // sanity check
    onTouchCancel()
    expect(store.draggingItem).toBeNull()
  })

  it('calls placeItem when touchend lands on a slot', () => {
    const { onTouchStart, onTouchEnd } = useTouchDrag(store)
    const plateEl = makeElement('plate-item')
    const slotEl = makeElement('table-slot')
    slotEl.dataset.slotId = 'slot-1-1'
    const item = foodItems[0]
    store.setDraggingItem(item)
    const startEvent = makeTouchEvent('touchstart', 50, 50, plateEl)
    Object.defineProperty(startEvent, 'currentTarget', { value: plateEl })
    onTouchStart(startEvent, item)
    const spy = vi.spyOn(store, 'placeItem')
    stubElementFromPoint(slotEl)
    onTouchEnd(makeTouchEvent('touchend', 150, 150, plateEl))
    expect(spy).toHaveBeenCalledWith('slot-1-1', item)
  })

  it('does not call placeItem when touchend lands on empty space', () => {
    const { onTouchStart, onTouchEnd } = useTouchDrag(store)
    const plateEl = makeElement('plate-item')
    const item = foodItems[0]
    const startEvent = makeTouchEvent('touchstart', 50, 50, plateEl)
    Object.defineProperty(startEvent, 'currentTarget', { value: plateEl })
    onTouchStart(startEvent, item)
    const spy = vi.spyOn(store, 'placeItem')
    stubElementFromPoint(document.body)
    onTouchEnd(makeTouchEvent('touchend', 999, 999, plateEl))
    expect(spy).not.toHaveBeenCalled()
  })
})
