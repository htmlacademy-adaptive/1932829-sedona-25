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

// Reload
const reload = (done) => {
  browser.reload();
  done();
}

//HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

//IMAGES
const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(gulp.dest('build/img'))
}

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

//WebP
export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp: {},
    }))
    .pipe(gulp.dest('build/img'));
}

//SVG
const svg = (done) => {
  gulp.src('source/img/**/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'))
  done()
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

const clean = () => {
  return del('build')
}

const copy = (done) => {
  return gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.html',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles, reload));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/img/**/*.*', gulp.series(copyImages, reload));
}


export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));


export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    svg,
    sprite,
    createWebp
  ),
);
