# Starter

## Особенности

+ Использование классов по [БЭМ](https://ru.bem.info/) 
+ используется препроцессор [SCSS](https://sass-lang.com/)
+ используется препроцессор для html [kit](https://codekitapp.com/help/kit/)
+ используется транспайлер [Babel](https://babeljs.io/) для поддержки современного JavaScript (ES6) в браузерах

## Установка
- установите [NodeJS](https://nodejs.org/en/) ***12-ой версии*** (на новых версиях NodeJS имеются проблемы с установкой некоторых пакетов) и [Yarn](https://yarnpkg.com/en/docs/install)
- скачайте сборку с помощью [Git](https://git-scm.com/downloads): `git clone https://github.com/reckek/Starter.git`
- установите `gulp` глобально: `yarn global add gulp-cli`
- перейдите в скачанную папку со сборкой: `cd Starter`
- скачайте необходимые зависимости: `yarn`
- чтобы начать работу, введите команду: `yarn run dev` (режим разработки)

## Файловая структура ##

```yacas
Файлы разработки:
├─ build
├─ gulp
├─ src
│  ├─ assets
│  │  ├─ audio
│  │  ├─ fonts
│  │  ├─ icons
│  │  │  ├─ favicon
│  │  │  └─ svg
│  │  ├─ images
│  │  └─ video
│  ├─ bem
│  │  ├─ modules
│  │  │  ├─ components
│  │  │  │  ├─ header
│  │  │  │  └─ footer
│  │  │  └─ modules
│  │  └─ _blocks.scss
│  ├─ js
│  │  ├─ imports
│  │  └─ main.js
│  ├─ styles
│  │  ├─ base
│  │  │  ├─ module
│  │  │  ├─ _fonts.scss
│  │  │  ├─ _general.scss
│  │  │  └─ _modules.scss
│  │  ├─ helpers
│  │  │  ├─ _functions.scss
│  │  │  ├─ _mixins.scss
│  │  │  └─ _varibles.scss
│  │  ├─ vendor
│  │  │  ├─ import
│  │  │  └─ _libs.scss
│  │  ├─ main.scss
│  ├─ views
│  │  ├─ 404.kit
│  └  └─ index.kit
├─ zip
├─ .babelrc
├─ .editorconfig
├─ .eslintrc
├─ .gitignore
├─ gulpfile.babel.js
└─ package.json
```

- Корень папки:

  - `.babelrc` — настройки Babel
  - `.eslintrc` — настройки ESLint
  - `.gitignore` – запрет на отслеживание файлов Git'ом
  - `gulpfile.babel.js` — настройки Gulp
  - `package.json` — список зависимостей

- Папка

  ```yacas
  src/
  ```

- используется во время разработки:
  + assets для сайта: `src/assets` 
  - БЭМ-блоки: `src/bem`
  - JS-файлы: `src/js`
  - SCSS-файлы: `src/styles`
  - HTML-файлы: `src/views`
  - страницы сайта: `src/views/pages`

- Папка `build` - папка, из которой запускается локальный сервер для разработки (при запуске `yarn run dev`)

- Папка `gulp` - папка с Gulp-тасками

## Команды

- `yarn run dev` - запуск сервера для разработки проекта
- `yarn run build` - собрать проект для разработки, но только без запуска сервера
- `yarn run build:prod` - собрать проект с оптимизацией без запуска сервера
- `yarn run build:webp` - Конвертирует картинки в формат webp
- `yarn run build:gzip` - Архивирует готовую сборку
- `yarn run bem-c` - создать BEM компонент
- `yarn run bem-m` - создать BEM модификатор

## Рекомендации по использованию

### Компонентный подход к разработке сайтов

- каждый БЭМ-блок имеет свою папку внутри `src/blocks/modules`
- папка одного БЭМ-блока содержит в себе один HTML-файл, один SCSS-файл и один JS-файл (если у блока используется скрипт)
  - HTML-файл блока импортируется в файл `src/views/index.kit` (или в необходимый файл страницы, откуда будет вызываться блок)
  - SCSS-файл блока импортируется в файл `src/bem/_blocks.scss`
    - JS-файл блока импортируется в `src/js/import/modules.js`

Пример структуры папки с БЭМ-блоком:

```yacas
bem
├── blocks
│   ├──header
│   │   ├── header.html
│   │   ├── header.js 
│   │   ├── header.scss
```

### Страницы проекта

- страницы проекта находятся в папке

  ```yacas
  src/views/pages
  ```

  - главная страница: `src/views/index.html`

### Шрифты

- шрифты находятся в папке

  ```yacas
  src/fonts
  ```

  - используйте [форматы](https://caniuse.com/#search=woff) `.woff`, `.woff2`, `ttf` 
  - шрифты подключаются в файл `src/styles/base/_fonts.scss`
  - сконвертировать локальные шрифты можно с помощью [данного сервиса](https://onlinefontconverter.com/)

### Изображения

- изображения находятся в папке

  ```
  src/img
  ```

  - изображения автоматически конвертируются в формат `.webp`. Подробная информация по использованию [тут](https://vk.com/@vk_it-webp).
