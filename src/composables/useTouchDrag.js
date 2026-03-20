import { ref } from 'vue';

export function useTouchDrag(store) {
  const draggingItem = ref(null);
  let clone = null;
  let offsetX = 0;
  let offsetY = 0;

  function onTouchStart(e, item) {
    e.preventDefault(); // prevents scroll interfering with drag
    draggingItem.value = item;
    store.setDraggingItem(item);

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();

    // How far into the element the finger landed
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    // Build a floating clone that follows the finger
    clone = e.currentTarget.cloneNode(true);
    clone.style.cssText = `
      position: fixed;
      width: ${rect.width}px;
      height: ${rect.height}px;
      left: ${touch.clientX - offsetX}px;
      top: ${touch.clientY - offsetY}px;
      opacity: 0.85;
      pointer-events: none;
      z-index: 999;
      transform: scale(1.1);
      transition: transform 0.1s;
      border-radius: 50%;
    `;
    document.body.appendChild(clone);
  }

  function onTouchMove(e) {
    if (!clone) return;
    e.preventDefault(); // prevent page scroll while dragging

    const touch = e.touches[0];
    clone.style.left = `${touch.clientX - offsetX}px`;
    clone.style.top  = `${touch.clientY - offsetY}px`;

    // Highlight the slot currently under the finger
    clearSlotHighlights();
    const el = getElementUnderTouch(touch);
    const slot = el?.closest('.table-slot');
    if (slot) slot.classList.add('touch-drag-over');
  }

  function onTouchEnd(e) {
    if (!draggingItem.value) return;

    const touch = e.changedTouches[0];

    // Hide clone briefly so elementFromPoint can see what's beneath it
    if (clone) clone.style.display = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (clone) clone.style.display = '';

    const slot = el?.closest('.table-slot');
    if (slot?.dataset.slotId) {
      store.placeItem(slot.dataset.slotId, draggingItem.value);
    }

    cleanup();
  }

  function onTouchCancel() {
    cleanup();
  }

  function getElementUnderTouch(touch) {
    if (clone) clone.style.display = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (clone) clone.style.display = '';
    return el;
  }

  function clearSlotHighlights() {
    document.querySelectorAll('.table-slot.touch-drag-over')
      .forEach(el => el.classList.remove('touch-drag-over'));
  }

  function cleanup() {
    clone?.remove();
    clone = null;
    draggingItem.value = null;
    clearSlotHighlights();
  }

  return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel };
}
