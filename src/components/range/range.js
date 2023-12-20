// @ts-check
import { createElement, createHandler, createMutationHandler } from '../../scripts/utils/DOM'

/**
 *
 *
 *
 *
 *
 *
 *
 *
 * //
 *
 *
 *
 *
 *
 *
 *
 *
 **/

/**
 * @param {{clientX: number, left: number, width: number}} param0
 */
const getPercentForRange = ({ clientX, left, width }) => {
  const mouseX = Math.min(
    Math.max(0, Math.floor(clientX - left)),
    Math.floor(width)
  );

  const percent = (mouseX / Math.floor(width)) * 100;

  return percent;
}

/**
 * Находит процентное значение из максимального и обычного числа
 *
 * @param {number} number
 * @param {number} max
 * @returns
 */
const getPercent = (number, max) => (number / max) * 100

/**
 * Находит число из процентного значения
 *
 * @param {number} percent
 * @param {number} max
 * @returns
 */
const getNumberFromPercent = (percent, max) => max * (percent / 100)

/**
 * Устанавливает значения для CSS
 *
 * @param {HTMLElement} el
 * @param {{min?: string, max?: string}} percents
 */
const setMaxMinVariables = (el, { min, max }) => {
  if (max) el.style.setProperty("--max-value", max);
  if (min) el.style.setProperty("--min-value", min);
}

export const initRanges = () => {
  /** @type {NodeListOf<HTMLElement>} */
  const ranges = document.querySelectorAll(".range");

  ranges.forEach((/** @type {HTMLElement} */ rangeEl) => {
    /** @type {HTMLElement | null} */
    const lineEl = rangeEl.querySelector(".range__line");
    /** @type {HTMLElement | null} */
    const pointersWrapperEl = rangeEl.querySelector(".range__pointers");
    /** @type {HTMLElement | null} */
    const inputWrapperEl = rangeEl.querySelector(".range__inputs");

    if (!lineEl || !pointersWrapperEl || !inputWrapperEl) return;

    const { id } = rangeEl;
    const isShowMinValue = !!rangeEl.getAttribute("data-min-value");

    const maxRange = parseInt(rangeEl.getAttribute("data-max") || '0');
    const minRange = parseInt(rangeEl.getAttribute("data-min") || '0');

    let maxValue = parseInt(rangeEl.getAttribute("data-max-value") || '0');
    let minValue = parseInt(rangeEl.getAttribute("data-min-value") || '0');

    if (maxRange && maxValue > maxRange) {
      console.error(
        `Значение (${maxValue}) не может быть больше (${maxRange})`,
      );
      maxValue = maxRange;
    }

    if (minRange && maxValue < minRange) {
      console.error(
        `Значение (${maxValue}) не может быть меньше (${minRange})`,
      );
      maxValue = minRange;
    }

    let maxPointer = getPercent(maxValue, maxRange);
    let minPointer = getPercent(minValue, maxRange);

    setMaxMinVariables(rangeEl, {
      min: `${minPointer}%`,
      max: `${maxPointer}%`,
    });

    const inputMinEl = createElement("input", {
      id: `range-${id}-min`,
      type: "range",
      min: minRange,
      max: maxRange,
      value: minValue,
    });

    const inputMaxEl = createElement("input", {
      id: `range-${id}-max`,
      type: "range",
      min: minRange,
      max: maxRange,
      value: maxValue,
    });

    const pointerMaxEl = createElement("div", {
      class: "range__pointer-max",
    });

    const pointerMinEl = createElement("div", {
      class: `range__pointer-min${isShowMinValue ? " show" : ""}`,
    });

    inputWrapperEl.append(inputMinEl, inputMaxEl);
    pointersWrapperEl.append(pointerMinEl, pointerMaxEl);

    let isChangeMaxValue = false;
    let isChangeMinValue = false;

    const [addHandlerMouseMove, removeHandlerMouseMove] = createHandler(
      document.body,
      "mousemove",
      ({ clientX }) => {
        const { left, width } = rangeEl.getBoundingClientRect();
        const percent = getPercentForRange({ clientX, left, width });

        if (isChangeMinValue && percent <= maxPointer) {
          inputMinEl.setAttribute('value', String(Math.floor(getNumberFromPercent(percent, maxRange))));
        } else if (isChangeMaxValue && percent >= minPointer) {
          inputMaxEl.setAttribute('value', String(Math.floor(getNumberFromPercent(percent, maxRange))));
        }
      },
    );

    const [
      addHandlerMouseUpOnPointer,
      removeHandlerMouseUpOnMaxPointer
    ] = createHandler(document.body, "mouseup", () => {
      removeHandlerMouseMove()
      removeHandlerMouseUpOnMaxPointer()
      isChangeMaxValue = false;
      isChangeMinValue = false;
    });

    createHandler(pointerMaxEl, "mousedown", () => {
      isChangeMaxValue = true;
      addHandlerMouseMove()
      addHandlerMouseUpOnPointer()
    }, true);

    createHandler(pointerMinEl, "mousedown", () => {
      isChangeMinValue = true;
      addHandlerMouseMove()
      addHandlerMouseUpOnPointer()
    }, true);

    // Связка с инпутами

    const [ observe ] = createMutationHandler((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "attributes" || !(mutation.target instanceof HTMLInputElement)) return;

        const percent = getPercent(parseInt(mutation.target.value), maxRange);

        if (mutation.target === inputMinEl && percent <= maxPointer) {
          minPointer = percent;
          setMaxMinVariables(rangeEl, { min: `${percent}%` });
          rangeEl.setAttribute('data-min-value', String(Math.floor(getNumberFromPercent(percent, maxRange))));
        } else if (mutation.target === inputMaxEl && percent >= minPointer) {
          maxPointer = percent;
          setMaxMinVariables(rangeEl, { max: `${percent}%` });
          rangeEl.setAttribute('data-max-value', String(Math.floor(getNumberFromPercent(percent, maxRange))));
        }
      }
    })

    observe(inputMaxEl)
    observe(inputMinEl)
  });
};

// /**
//  * @param {string} selectorInputMax
//  * @param {string} [selectorInputMin]
//  */
// const bindRange = (selectorInputMax, selectorInputMin) => {
//   /** @type {HTMLInputElement | null} */
//   const inputMax = document.querySelector(selectorInputMax);
//   /** @type {HTMLInputElement | null} */
//   const inputMin = selectorInputMin ? document.querySelector(selectorInputMin) : null;

//   const rangeId = inputMax?.getAttribute("data-bind-range-max");

//   /** @type {HTMLElement | null} */
//   const range = document.getElementById(`${rangeId}`);
//   /** @type {HTMLInputElement | null | undefined} */
//   const rangeInputMax = range?.querySelector(`#range-${rangeId}-max`);
//   /** @type {HTMLInputElement | null | undefined} */
//   const rangeInputMin = range?.querySelector(`#range-${rangeId}-min`);
//   const isElementsNotFound = !inputMax || !rangeId || !rangeInputMax;

//   if (isElementsNotFound || !rangeInputMax?.hasAttribute('max')) return

//   const maxRange = parseInt(rangeInputMax.getAttribute('max') || '-100');
//   const minRange = parseInt(rangeInputMin?.getAttribute('min') || '0');


// }

// export const runBindRanges = () => {
//   /** @type {NodeListOf<HTMLInputElement>} */
//   const inputsMin = document.querySelectorAll("[data-bind-range-min]");
//   /** @type {NodeListOf<HTMLInputElement>} */
//   const inputsMax = document.querySelectorAll("[data-bind-range-max]");

//   if (!inputsMin.length && !inputsMax.length) return;


//   // for (const inputMax of inputsMax) {

//   //   const range = document.getElementById(`${rangeId}`);
//   //   /** @type {HTMLInputElement | null | undefined} */
//   //   const rangeInputMax = range?.querySelector(`#range-${rangeId}-max`);

//   //   if (!range || !rangeInputMax) continue;


//   //   const [observe] = createMutationHandler((mutations) => {
//   //     for (const mutation of mutations) {
//   //       if (mutation.type !== "attributes" || !(mutation.target instanceof HTMLInputElement)) return;
//   //     }
//   //   })

//   //   observe(rangeInputMax)

//   //   createHandler(inputMax, "input", (e) => {
//   //     if (e.isTrusted || !(e.target instanceof HTMLInputElement)) return;
//   //     const percent = getPercent(parseInt(e.target.value), maxRange);
//   //     rangeInputMax.setAttribute('value', String(Math.floor(getNumberFromPercent(percent, maxRange))));
//   //   })
//   // }
// }
