const list = document.querySelector(".tabs")

document.querySelectorAll(".tabs__close").forEach(el => {
  if (!list) return

  el.addEventListener("click", () => {
    list.classList.toggle('tabs--open')
  })
})
