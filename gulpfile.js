import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from "postcss-csso";
import autoprefixer from 'autoprefixer';
import del from 'del';
import browser from 'browser-sync';
import htmlmin from 'gulp-html-minifier';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import { config } from 'process';
import rename from 'gulp-rename';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//HTML

export const html = () => {
  return gulp.src('sourse/*.html')
  .pipe(htmlmin({collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//IMAGES
export const images = () => {
  return gulp.src('sourse/img/**/*.(jpg,png')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
  }


//WebP
export const createWebp = () => {
  return gulp.src('sourse/img/**/*.(jpg,png')
  .pipe(squoosh({
    webp: {},
  }))
  .pipe(gulp.dest('build/img'));
}

//SVG
const svg = () => {
  gulp.src('sourse/img/**/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build.img'));
}

const sprite = () => {
  return gulp.src("source/img/*.svg")
  .pipe(svgo())
  .pipe(svgstore({
    inlinesvg:true
}))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
  }


// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

const clean = () => {
  return del('build')
}

const copy = (done) => {
  return gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/img/**/*.webp',
    'source/*.html'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
}


export default gulp.series(
  html, styles, server, watcher
);

//export const build = gulp.series(
  //clean,
  //copy,
  //надо добавить
  //optomizeImages,
  //gulp.parallel (
    //styles,
    //надо добавить в идеале
    //scripts,
    //createWebp,
    //spriteSvg,
    //optimizeSvg
  //),
//);
