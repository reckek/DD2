// @ts-check
import {
  createElement,
  createHandler,
  createMutationHandler,
} from "../../scripts/utils/DOM";
import { device, getPointer } from "../../scripts/utils/device";

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
    Math.floor(width),
  );

  const percent = (mouseX / Math.floor(width)) * 100;

  return percent;
};

/**
 * Находит процентное значение из максимального и обычного числа
 *
 * @param {number} number
 * @param {number} max
 * @returns
 */
const getPercent = (number, max) => (number / max) * 100;

/**
 * Находит число из процентного значения
 *
 * @param {number} percent
 * @param {number} max
 * @returns
 */
const getNumberFromPercent = (percent, max) => max * (percent / 100);

/**
 * Устанавливает значения для CSS
 *
 * @param {HTMLElement} el
 * @param {{min?: string, max?: string}} percents
 */
const setMaxMinVariables = (el, { min, max }) => {
  if (max) el.style.setProperty("--max-value", max);
  if (min) el.style.setProperty("--min-value", min);
};

/**
 * @param {HTMLElement} rangeEl
 * @param {{
 *  minRange: number,
 *  maxRange: number,
 *  minValue: number,
 *  maxValue: number,
 * }} obj
 */
const createElementsForRange = (
  rangeEl,
  { minRange, maxRange, minValue, maxValue },
) => {
  const rangeId = rangeEl.id;
  const isShowMinValue = !!rangeEl.getAttribute("data-min-value");

  /** @type {HTMLElement | null} */
  const lineEl = rangeEl.querySelector(".range__line");
  /** @type {HTMLElement | null} */
  const pointersWrapperEl = rangeEl.querySelector(".range__pointers");
  /** @type {HTMLElement | null} */
  const inputWrapperEl = rangeEl.querySelector(".range__inputs");

  if (!lineEl || !pointersWrapperEl || !inputWrapperEl) {
    return;
  }

  /** @type {HTMLInputElement | null} */
  let inputMinSync = document.querySelector(`[data-bind="${rangeId}"][data-bind-type="min"]`)
  /** @type {HTMLInputElement | null} */
  let inputMaxSync = document.querySelector(`[data-bind="${rangeId}"][data-bind-type="max"]`)
  console.log(document.querySelector(`[data-bind="${rangeId}"]`))

  if (!inputMinSync) {
    const inputMinEl = createElement("input", {
      id: `range-${rangeId}-min`,
      type: "range",
      min: minRange,
      max: maxRange,
      value: minValue,
    });

    inputMinSync = inputMinEl

    inputWrapperEl.append(inputMinEl)
  } else {
    inputMinSync.setAttribute("id", `range-${rangeId}-min`)
    inputMinSync.setAttribute("min", String(minRange))
    inputMinSync.setAttribute("max", String(maxRange))
    inputMinSync.setAttribute("value", String(minValue))
  }

  if (!inputMaxSync) {
    const inputMaxEl = createElement("input", {
      id: `range-${rangeId}-max`,
      type: "range",
      min: minRange,
      max: maxRange,
      value: maxValue,
    });

    inputMaxSync = inputMaxEl

    inputWrapperEl.append(inputMaxEl)
  } else {
    inputMaxSync.setAttribute("id", `range-${rangeId}-max`)
    inputMaxSync.setAttribute("min", String(minRange))
    inputMaxSync.setAttribute("max", String(maxRange))
    inputMaxSync.setAttribute("value", String(maxValue))
  }

  const pointerMaxEl = createElement("div", {
    class: "range__pointer-max",
  });

  const pointerMinEl = createElement("div", {
    class: `range__pointer-min${isShowMinValue ? " show" : ""}`,
  });

  pointersWrapperEl.append(pointerMinEl, pointerMaxEl);

  return {
    inputMaxEl: inputMaxSync,
    inputMinEl: inputMinSync,
    pointerMaxEl,
    pointerMinEl,
  };
};

export const initRanges = () => {
  /** @type {NodeListOf<HTMLElement>} */
  const ranges = document.querySelectorAll(".range");

  ranges.forEach((/** @type {HTMLElement} */ rangeEl) => {
    const maxRange = parseInt(rangeEl.getAttribute("data-max") || "0");
    const minRange = parseInt(rangeEl.getAttribute("data-min") || "0");

    let maxValue = parseInt(rangeEl.getAttribute("data-max-value") || "0");
    let minValue = parseInt(rangeEl.getAttribute("data-min-value") || "0");

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

    const elements = createElementsForRange(rangeEl, {
      minRange,
      maxRange,
      minValue,
      maxValue,
    });

    if (!elements) {
      return
    }

    const {inputMaxEl, inputMinEl, pointerMaxEl, pointerMinEl} = elements

    let isChangeMaxValue = false;
    let isChangeMinValue = false;

    const [addHandlerMouseMove, removeHandlerMouseMove] = createHandler(
      document.body,
      getPointer().type === "mouse" ? "mousemove" : "touchmove",
      (e) => {
        const clientX =
          e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        const { left, width } = rangeEl.getBoundingClientRect();
        const percent = getPercentForRange({ clientX, left, width });

        if (isChangeMinValue && percent <= maxPointer) {
          inputMinEl.setAttribute(
            "value",
            String(Math.floor(getNumberFromPercent(percent, maxRange))),
          );
        } else if (isChangeMaxValue && percent >= minPointer) {
          inputMaxEl.setAttribute(
            "value",
            String(Math.floor(getNumberFromPercent(percent, maxRange))),
          );
        }
      },
    );

    const [addHandlerMouseUpOnPointer, removeHandlerMouseUpOnMaxPointer] =
      createHandler(
        document.body,
        getPointer().type === "mouse" ? "mouseup" : "touchend",
        () => {
          removeHandlerMouseMove();
          removeHandlerMouseUpOnMaxPointer();
          isChangeMaxValue = false;
          isChangeMinValue = false;
        },
      );

    createHandler(
      pointerMaxEl,
      getPointer().type === "mouse" ? "mousedown" : "touchstart",
      () => {
        isChangeMaxValue = true;
        addHandlerMouseMove();
        addHandlerMouseUpOnPointer();
      },
      true,
    );

    createHandler(
      pointerMinEl,
      getPointer().type === "mouse" ? "mousedown" : "touchstart",
      () => {
        isChangeMinValue = true;
        addHandlerMouseMove();
        addHandlerMouseUpOnPointer();
      },
      true,
    );

    // Связка с инпутами

    const [observe] = createMutationHandler((mutationList) => {
      for (const mutation of mutationList) {
        if (
          mutation.type !== "attributes" ||
          !(mutation.target instanceof HTMLInputElement)
        )
          return;

        const percent = getPercent(parseInt(mutation.target.value), maxRange);

        if (mutation.target === inputMinEl && percent <= maxPointer) {
          minPointer = percent;
          setMaxMinVariables(rangeEl, { min: `${percent}%` });
          rangeEl.setAttribute(
            "data-min-value",
            String(Math.floor(getNumberFromPercent(percent, maxRange))),
          );
        } else if (mutation.target === inputMaxEl && percent >= minPointer) {
          maxPointer = percent;
          setMaxMinVariables(rangeEl, { max: `${percent}%` });
          rangeEl.setAttribute(
            "data-max-value",
            String(Math.floor(getNumberFromPercent(percent, maxRange))),
          );
        }
      }
    });

    observe(inputMaxEl);
    observe(inputMinEl);
  });
};
