// @ts-check

export const initModalWindow = () => {
  const dialogs = document.querySelectorAll("dialog");

  if (dialogs.length === 0) {
    throw new Error('Dialogs not founds')
  }

  dialogs.forEach((dialog) => {
    const dialogId = dialog.getAttribute('id')

    /** @type {(e: HTMLElementEventMap[keyof HTMLElementEventMap]) => void} */
    const openDialog = (e) => {
      e.preventDefault();

      if (!(e.target instanceof HTMLElement)) return

      if (e.target.dataset['expandDialog'] !== `#${dialogId}`) return

      for (const dialog of dialogs) {
        dialog.close();
      }

      dialog.showModal();
      document.body.classList.add('disable-scroll')
    };

    /** @type {(e: HTMLElementEventMap[keyof HTMLElementEventMap]) => void} */
    const closeDialog = (e) => {
      e.preventDefault();
      dialog.close();
      document.body.classList.remove('disable-scroll')
    };

    if (typeof dialogId === 'string') {
      document.querySelectorAll(`[data-expand-dialog="#${dialogId}"]`).forEach(element => {
        element.addEventListener("click", openDialog)
      });
    }

    dialog
      .querySelector(".modal-window__close")
      ?.addEventListener("click", closeDialog);
    dialog
      .querySelector(".modal-window__background")
      ?.addEventListener("click", closeDialog);

      dialog.querySelectorAll(".modal-window__actions button[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closeDialog)
      });
  })
};
