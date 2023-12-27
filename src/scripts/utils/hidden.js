// @ts-check

import { createHandler, createMutationHandler } from "./DOM";

document.querySelectorAll('input[aria-disabled="true"],select[aria-disabled="true"]').forEach((el) => {
  if (!(el instanceof HTMLInputElement)) return;

  let inputValue = el.value;

  createHandler(el, "input", (e) => {
      e.preventDefault();
      if (!(e.target instanceof HTMLInputElement)) return;

      if (e.target.getAttribute("aria-disabled") === "true") {
        e.target.value = inputValue;
      } else {
        inputValue = e.target.value;
      }
    },
    true,
  );
});
