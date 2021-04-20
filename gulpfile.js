const gulp = require('gulp');

const sass = require('gulp-sass');          // plugin used to convert sass to css
const cssnano = require('gulp-cssnano');   // plugin used to minify css
const rev = require('gulp-rev');           // plugin used to revise the names
const uglify = require('gulp-uglify-es').default; // plugin used to minify js
const imagemin = require('gulp-imagemin');   // plugin used to minify images
const del = require('del');

 
// minifying css using gulp
    // gulp-sass converts sass to css
    // gulp-cssnano compressess that css into one line
    // gulp-rev would rename the file with hash alongside its name. ex home.css gets renamed to home-12345.css

// we need to create some tasks while using gulp..one of ours is minifying the css and renaming it. we will name the task as css
// in order to run this task type gulp css command in terminal
gulp.task('css', function(done){
    console.log('minifying the css...');

    // ** means any subfolder or every subfolder inside scss folder, * means every file inside . ALl of these files needs to be compressed 
    // pipe() is a function which is calling all the sub middlewares which are there with the gulp
    // passing the files thorugh gulp-sass module. These are now converted form sass to css
    // passing the files thorugh gulp-cssnano module. These files are now compressed    
    // minifying css files while sending it from the server to the browser
    gulp.src('./assets/scss/**/*.scss')  
    .pipe(sass())  
    .pipe(cssnano()) 
    .pipe(gulp.dest('./assets.css'))
                                            // minification complete
                                            // passing the minified files through rev for renaming it
                                            // once renamed save it into another folder public/assets
                                            // create a manifest(passing the currrent working directory) that will basically map a file name to its updated/new file name
                                            // and then again store the files in public/assets                                            
     // renaming any folder or subfolder inside assets which contains a css file
     gulp.src('./assets/**/*.css')
     .pipe(rev())
     .pipe(gulp.dest('./public/assets'))
     .pipe(rev.manifest({
         cwd: 'public',
         merge: true  // if the name already exists it will not change. It will merge it with the originally exixting file
     }))
     .pipe(gulp.dest('./public/assets'))
      done();

});


// MINIFYING JS
gulp.task('js', function(done){
    console.log('minifying js...');

    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();
});

// MINIFYING IMAGES
gulp.task('images', function(done){
    console.log('minifying images...');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();

});

// empty the public/assets directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
})

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('building assets...');
    done();
})