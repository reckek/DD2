const srcPath = "src";
const destPath = "build";

const config = {
  src: {
    root: srcPath,
    public: `public`,
    styles: `${srcPath}/styles`,
    scripts: `${srcPath}/scripts`,
    components: `${srcPath}/components`,
    pages: `${srcPath}/pages`,

    fonts: `${srcPath}/assets/fonts/**/*`,
    images: `${srcPath}/assets/images/**/*`,
    webp: `${srcPath}/assets/images/**/*`,
    favicon: `${srcPath}/assets/icons/favicon/**/*`,
    icons: `${srcPath}/assets/icons/svg/**/*`,
    video: `${srcPath}/assets/video/**/*`,
    audio: `${srcPath}/assets/audio/**/*`,
  },
  dest: {
    root: destPath,
    public: `${destPath}/public`,
    styles: destPath,
    scripts: `${destPath}/main.js`,
    components: `${destPath}/components`,
    pages: `${destPath}/pages`,

    fonts: `${destPath}/assets/fonts`,
    images: `${destPath}/assets/images`,
    icons: `${destPath}/assets/icons`,
    video: `${destPath}/assets/video`,
    audio: `${destPath}/assets/audio`,

    gzip: `zip`,
  },

  setEnv() {
    this.isProd = process.argv.includes("--prod");
    this.isDev = !this.isProd;
  },
};

export default config;
