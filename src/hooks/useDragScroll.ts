import { useEffect } from 'react';

// Distance avant de trancher : même seuil que le swipe horizontal du CV.
const GESTURE_LOCK_THRESHOLD_PX = 10;
const NON_DRAGGABLE_SELECTOR = 'button, input, textarea, select, label, [contenteditable]';
// Inertie volontairement légère : ~150 px au maximum après un lancer rapide.
const MAX_INERTIA_VELOCITY = 1.2; // px/ms
const MIN_INERTIA_VELOCITY = 0.02; // px/ms
const INERTIA_FRICTION_PER_FRAME = 0.88;
const FRAME_MS = 16;
// Au-delà de ce délai sans mouvement, le relâchement est considéré comme immobile.
const RELEASE_IDLE_MS = 80;

// Scroll vertical à la souris par glisser-déposer. Le tactile garde le scroll natif.
export function useDragScroll(element: HTMLElement | null) {
  useEffect(() => {
    if (!element) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScrollTop = 0;
    let isScrolling = false;
    let velocity = 0;
    let lastMoveTime = 0;
    let lastMoveY = 0;
    let inertiaFrame = 0;

    const stopInertia = () => cancelAnimationFrame(inertiaFrame);

    const startInertia = (initialVelocity: number) => {
      let currentVelocity = Math.max(-MAX_INERTIA_VELOCITY, Math.min(MAX_INERTIA_VELOCITY, initialVelocity));
      let position = element.scrollTop;
      let previousTime = performance.now();

      const step = (time: number) => {
        // Un écart de position signifie qu'un autre scroll a pris la main (molette, changement de slide).
        if (Math.abs(element.scrollTop - position) > 2) return;

        const elapsed = time - previousTime;
        previousTime = time;
        position += currentVelocity * elapsed;
        currentVelocity *= INERTIA_FRICTION_PER_FRAME ** (elapsed / FRAME_MS);

        const maxScrollTop = element.scrollHeight - element.clientHeight;
        position = Math.max(0, Math.min(maxScrollTop, position));
        element.scrollTop = position;

        if (Math.abs(currentVelocity) < MIN_INERTIA_VELOCITY || position === 0 || position === maxScrollTop) return;
        inertiaFrame = requestAnimationFrame(step);
      };

      inertiaFrame = requestAnimationFrame(step);
    };

    const isScrollable = () => element.scrollHeight > element.clientHeight;

    const handlePointerOver = () => {
      if (pointerId === null) element.style.cursor = isScrollable() ? 'grab' : '';
    };

    const handlePointerDown = (event: PointerEvent) => {
      stopInertia();
      if (event.pointerType !== 'mouse' || event.button !== 0 || !isScrollable()) return;
      if ((event.target as Element).closest(NON_DRAGGABLE_SELECTOR)) return;
      // Clic sur la barre de défilement : comportement natif.
      if (event.clientX >= element.getBoundingClientRect().left + element.clientWidth) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;

      if (isScrolling) {
        element.scrollTop = startScrollTop - (event.clientY - startY);
        const elapsed = event.timeStamp - lastMoveTime;
        if (elapsed > 0) {
          const instantVelocity = (lastMoveY - event.clientY) / elapsed;
          velocity = velocity * 0.7 + instantVelocity * 0.3;
          lastMoveTime = event.timeStamp;
          lastMoveY = event.clientY;
        }
        return;
      }

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.hypot(dx, dy) < GESTURE_LOCK_THRESHOLD_PX) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Geste horizontal : laissé au swipe du CV ou à la sélection de texte.
        pointerId = null;
        return;
      }

      isScrolling = true;
      startY = event.clientY;
      startScrollTop = element.scrollTop;
      velocity = 0;
      lastMoveTime = event.timeStamp;
      lastMoveY = event.clientY;
      element.setPointerCapture(event.pointerId);
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
      window.getSelection()?.removeAllRanges();
    };

    const suppressClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!isScrolling) return;

      isScrolling = false;
      element.style.cursor = 'grab';
      element.style.userSelect = '';
      // Évite d'ouvrir un lien sur lequel le glisser s'est terminé.
      element.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(() => element.removeEventListener('click', suppressClick, { capture: true }), 0);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isThrow = event.type === 'pointerup' && event.timeStamp - lastMoveTime < RELEASE_IDLE_MS;
      if (isThrow && !reducedMotion && Math.abs(velocity) >= MIN_INERTIA_VELOCITY) startInertia(velocity);
    };

    // Sinon le drag natif des images et liens interrompt les événements pointer.
    const preventNativeDrag = (event: DragEvent) => event.preventDefault();

    element.addEventListener('pointerover', handlePointerOver);
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', endDrag);
    element.addEventListener('pointercancel', endDrag);
    element.addEventListener('dragstart', preventNativeDrag);

    return () => {
      stopInertia();
      element.removeEventListener('pointerover', handlePointerOver);
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', endDrag);
      element.removeEventListener('pointercancel', endDrag);
      element.removeEventListener('dragstart', preventNativeDrag);
    };
  }, [element]);
}
