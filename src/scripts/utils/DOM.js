// @ts-check

/**
 * Создает HTML элемент с переданными свойствами.
 *
 * @template {keyof HTMLElementTagNameMap} [T = keyof HTMLElementTagNameMap] - The element tag name.
 * @param {T} typeElement - The tag name of the element to create.
 * @param {Record<string, string | number | boolean | null | undefined>} props - The properties of the element.
 * @returns {HTMLElementTagNameMap[T]} - The created HTML element.
 */
export const createElement = (typeElement, props) => {
  /**
   * @type {HTMLElementTagNameMap[T]}
   */
  const element = document.createElement(typeElement);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (value === true) {
      element.setAttribute(key, "");
      continue;
    }

    element.setAttribute(key, String(value));
  }

  return element;
};

/**
 * Обертка для создания обработчиков.
 *
 * @template {keyof HTMLElementEventMap} [EventName = keyof HTMLElementEventMap]
 * @param {HTMLElement} el
 * @param {EventName} type
 * @param {(ev: HTMLElementEventMap[EventName]) => void} cb
 * @param {boolean} [start]
 * @returns {[() => void, () => void, (ev: HTMLElementEventMap[EventName]) => void]}
 */
export const createHandler = (el, type, cb, start) => {
  let isEventSubscribed = false;

  if (start) {
    isEventSubscribed = true;
    el.addEventListener(type, cb);
  }

  return [
    () => {
      if (isEventSubscribed) return;
      el.addEventListener(type, cb);
      isEventSubscribed = true;
    },
    () => {
      isEventSubscribed = false;
      el.removeEventListener(type, cb);
    },
    cb,
  ];
};

/**
 * Создает обработчик мутации по атрибутам элемента.
 *
 * @param {MutationCallback} cb
 * @param {MutationObserverInit} [options]
 * @returns {[
 *  (el: HTMLElement) => void,
 *  () => void,
 *  MutationCallback
 * ]}
 */
export const createMutationHandler = (cb, options = {}) => {
  const mutation = new MutationObserver(cb);

  /** @type {(el: HTMLElement) => void} */
  const observe = (el) => mutation.observe(el, {
    attributes: true,
    attributeOldValue: true,
    ...options,
  })

  const unobserveAll = () => mutation.disconnect()

  return [
    observe,
    unobserveAll,
    cb,
  ]
};
