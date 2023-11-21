// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import config from "../config";
import { fontsBuild } from "./assets/fonts";
import { imagesBuild } from "./assets/images";
import { svgBuild } from "./assets/svg";
import { videoBuild } from "./assets/video";
import { audioBuild } from "./assets/audio";
// <=================================================>

// <=================================================>
// BUILD FILES
export const assetsBuild = () => {
  // fontsBuild();
  // imagesBuild();
  // svgBuild();
  // videoBuild();
  // audioBuild();
};
// <=================================================>

// <=================================================>
// WATCH FILES
export const assetsWatch = () => {
  // gulp.watch(`${config.watch.fonts}`, fontsBuild);
  // gulp.watch(`${config.watch.images}`, imagesBuild);
  // gulp.watch(`${config.watch.icons}`, svgBuild);
  // gulp.watch(`${config.watch.video}`, videoBuild);
  // gulp.watch(`${config.watch.audio}`, audioBuild);
};
// <=================================================>
