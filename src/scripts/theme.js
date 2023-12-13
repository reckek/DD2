// @ts-check

const switcherElement = document.getElementById("switchTheme");
const themes = ["white", "black"];
let currentTheme = localStorage.getItem("theme") || themes[0];

const switchTheme = () => {
  const theme = document.body.classList.contains(themes[0])
    ? themes[1]
    : themes[0];

  document.body.classList.remove(currentTheme);
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme
};

if (!document.body.classList.contains(currentTheme)) {
  switchTheme();
}

switcherElement?.addEventListener("click", () => {
  switchTheme();
});
