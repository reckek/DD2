// @ts-check

const switcherElement = document.getElementById("switchTheme");
const themes = ["white", "black"];
let currentTheme = localStorage.getItem("theme") || themes[0];

const switchTheme = () => {
  const theme = currentTheme === themes[0]
    ? themes[1]
    : themes[0];

  document.body.classList.remove(currentTheme);
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme
};

for (const theme of document.body.classList) {
  if (currentTheme === theme) {
    continue
  }

  document.body.classList.remove(theme)
  document.body.classList.add(currentTheme)
}

switcherElement?.addEventListener("click", () => {
  switchTheme();
});
