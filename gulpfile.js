/* core */
var gulp = require( 'gulp' );

/* plugins */
var htmlmin = require( 'gulp-htmlmin' );
var uglify = require( 'gulp-uglify' );
var concat = require( 'gulp-concat' );
var pump = require( 'pump' );
var rename = require( 'gulp-rename' );
var argv = require( 'yargs' ).argv;
var replace = require( 'gulp-replace' );
var cleanCSS = require( 'gulp-clean-css' );
var clean = require( 'gulp-clean' );
var gm = require( 'gulp-gm' );

/* config */
if ( argv.config !== undefined ) {
	var config = require( './.webwrapp/apps/' + argv.config + '.json' );
} else {
	var config = require( './.webwrapp/config.json' );
}

if ( argv.production !== undefined ) {
    console.log( 'Gulp for PRODUCTION: '+ config.name );
} else {
    console.log( 'Gulp for DEVELOPMENT: '+ config.name );
}

// CLEAN UP ALL TEMPORARY FOLDERS
gulp.task( 'clean', function() {

	config.amp = config.amp.replace( /www-/, '*-' );

	var x = config.url;
	config._protocol = x.replace( /(https?):\/\/.+/, '$1' );
	config._domain = x.replace( /https?:\/\/([^/]+)\/?.*/, '$1' );
	config._domain_wildcard = config._domain.replace( /www\./, '*.' );
	var y = explode( '.', config._domain );
	config._domain_invert = implode( '.', y.reverse() );
	config._path = x.replace( /https?:\/\/[^/]+\/(.+)?/, '$1' );
	if ( config._path == x ) config._path = '';
console.log( 'PROTOCOL: ' + config._protocol );
console.log( 'www.DOMAIN.com: ' + config._domain );
console.log( '*.DOMAIN.com: ' + config._domain_wildcard );
console.log( 'com.DOMAIN.www: ' + config._domain_invert );
console.log( 'PATH: ' + config._path );

	config.customJS = config.customJS || '*.nojsfileshere';

	return gulp.src( [
        './temp'
		,'./.webwrapp/.original/.temp/'
		,'./www/js/.original/.temp/'
		,'./www/css/.original/.temp/'
    ] )
	.pipe( clean( {
		read: false
		,force: false
	} ) )
} );

gulp.task( 'final', [ 'logo-three', 'htmlmin', 'concat-js', 'cssmin' ], function() {
	return gulp.src( [
        './temp'
		,'./.webwrapp/.original/.temp/'
		,'./www/js/.original/.temp/'
		,'./www/css/.original/.temp/'
    ] )
	.pipe( clean( {
		read: false
		,force: false
	} ) )
} );

// MIN CSS
gulp.task( 'cssmin', [ 'clean' ], function() {
	return gulp.src( 'www/css/.original/*.css' )
		.pipe( cleanCSS() )
		.pipe( concat( 'index.css', {
		    newLine: '/*_*/'
        } ) )
		.pipe( gulp.dest( './www/css/' ) );
} );

// MIN HTML
gulp.task( 'htmlmin', [ 'clean' ], function( callback ) {
	return gulp.src( './www/.original/webwrapp.html' )
		.pipe( replace( /https:\/\/www\.example\.com/g, config._protocol + '://' + config._domain + '/' + config._path ) )
		.pipe( htmlmin( {
			collapseWhitespace: true
			,removeComments: true
			,collapseInlineTagWhitespace: true
			,collapseBooleanAttributes: true
			,minifyCSS: true
			,removeAttributeQuotes: true
			,removeEmptyAttributes: true
			,removeEmptyElements: true
		} ) )

		.pipe( rename( { basename: 'index' } ) )
		.pipe( gulp.dest( './www/' ) );
} );

// MIN JS
gulp.task( 'prep-js', [ 'clean' ], function( callback ) {
	gulp.src( './.webwrapp/.original/webwrapp-config.js' )
	// Reason for working with the value as a string rather than boolean is less error
	.pipe( replace( /Config\.clearData\s*=\s*false\;/g, 'Config.clearData="' + config.clearData.toString().toLowerCase() + '";' ) ) // protocol first
	.pipe( replace( /https:\/\/www\.example\.com/g, config._protocol + '://' + config._domain + '/' + config._path ) )
	.pipe( rename( { basename: '_webwrapp' } ) ) // this will make sure this file is before the prime webwrapp.js file
	.pipe( gulp.dest( './www/js/.original/.temp/' ) );

	gulp.src( './.webwrapp/' + config.customJS )
	.pipe( rename( { basename: 'webwrappZZZ' } ) ) // this will make sure this file is after the prime webwrapp.js file
	.pipe( gulp.dest( './www/js/.original/.temp/' ) );

	callback();
} );
gulp.task( 'uglify-js', [ 'prep-js' ], function( callback ) {
	if ( argv.production !== undefined ) {
		pump( [
            gulp.src( './www/js/.original/*.js' )
            ,uglify( {
				mangle: true
			} )
            ,gulp.dest( './www/js/.original/.temp/' )
      ], callback );
	} else {
		return gulp.src( "./www/js/.original/*.js" )
		.pipe( gulp.dest( "./www/js/.original/.temp/" ) );
	}
} );
gulp.task( 'concat-js', [ 'uglify-js' ], function( callback ) {
	if ( argv.production !== undefined ) {
		return gulp.src( "./www/js/.original/.temp/*.js" )
			.pipe( concat( 'index.js', {
				newLine: ';'
			} ) )
			.pipe( gulp.dest( "./www/js/" ) );
	} else {
		return gulp.src( "./www/js/.original/.temp/*.js" )
			// Combine all into the cordova.js and place inside the www root -- then the injectview plugin will load both cordova and the webwrapp js in one!
			.pipe( concat( 'index.js', {
				newLine: ';'
			} ) )
			.pipe( gulp.dest( "./www/js" ) );
	}
} );

// ANDROID BUILD
gulp.task( 'build-cordova', [ 'clean' ], function( callback ) { // make sure to declare callback and use return to ensure synchronous running
	// Copy release-signing.properties to platforms/android to allow for signing a release apk
	gulp.src( "./.webwrapp/release-signing.properties" )
		.pipe( gulp.dest( "platforms/android" ) );
	// Copy proguard-rules.pro to platforms to allow for shrinking and obfuscating a release apk
	gulp.src( "./.webwrapp/proguard-rules.pro" )
		.pipe( gulp.dest( "platforms/android/" ) );
	if ( argv.production !== undefined ) {
		// Look for signingConfig as first line under release, if there then add the new stuff
		// Then make sure to write to the same file
		gulp.src( [ "./platforms/android/build.gradle" ] )
			.pipe( replace( /buildTypes\s+{\s+release\s+{(\s+)signingConfig/, "buildTypes { release { shrinkResources true; minifyEnabled true; proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro' $1signingConfig" ) )
			.pipe( gulp.dest( "./platforms/android/" ) ); // shrinkResources true; minifyEnabled true; proguardFiles getDefaultProguardFile('proguard-android.txt'),'proguard-rules.pro' "}));
	}

	callback();
} );

gulp.task( 'logo-zero', [ 'clean' ],  function ( callback ) {
	return resize( 1196, 'webwrapp-temp', false, './temp' );
} );

// MAKE ICONS AND SPLASH BG
gulp.task( 'logo-one', [ 'logo-zero' ],  function ( callback ) {

	// ANDROID
  // Make all the icons -- then the splash screens
	resize( 192, 'icon-xxxhdpi', true, 'res/icon/android' );
	resize( 144, 'icon-xxhdpi', true, 'res/icon/android' );
	resize( 96, 'icon-xhdpi', true, 'res/icon/android' );
	resize( 72, 'icon-hdpi', true, 'res/icon/android' );
	resize( 48, 'icon-mdpi', true, 'res/icon/android' );
	resize( 36, 'icon-ldpi', true, 'res/icon/android' );

	// OSX
	resize( 512, 'icon-512x512', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );
	resize( 256, 'icon-256x256', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );
	resize( 128, 'icon-128x128', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );
	resize( 64, 'icon-64x64', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );
	resize( 32, 'icon-32x32', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );
	resize( 16, 'icon-16x16', false, 'platforms/osx/' + config.name + '/Images.xcassets/AppIcon.appiconset' );

	///config.splashBackgroundColor = '#eeeeee';
	///console.log( config.splashBackgroundColor );

	// create base for bg
  return gulp.src( './.webwrapp/' + config.logo )
  .pipe( gm( function ( gmfile ) {
      return gmfile
	.setFormat( 'png' ).noProfile()
	.resize( 1, 1 )
	.fill( config.splashBackgroundColor )
	.drawRectangle( 0, 0, 1, 1 )
	.flatten()
	.extent( 1200, 1200 ).crop( 1200, 1200, 0, 0 )
      .background( config.splashBackgroundColor )
	;
  } ) )
  .pipe( gm( function ( gmfile ) {
      return gmfile
	.background( 'none' )
	.gravity( 'Center' )
	.extent( 1202, 1202 ) /* scale to include extra 2px for 9 patch */
	;
  } ) )
	.pipe( rename( { basename: 'bg' } ) )
  .pipe( gulp.dest( './temp' ) );
} );

// ADD PATCH 9 TO BG
gulp.task( 'logo-two', [ 'logo-one' ],  function ( callback ) {
	// layer image on splash template
	return gulp.src('./.webwrapp/.original/splash-1200.9.png')
	.pipe( gm( function ( gmfile ) {
	    return gmfile
		.noProfile()
	    .background( 'transparent' )
	    .draw( 'image Over 1,1 0,0 temp/webwrapp-temp.png' )
		;
	} ) )
	.pipe( rename( { basename: 'temp' } ) )
	.pipe( gulp.dest( './temp/' ) );
} );

// ADD APP LOGO FOR FINAL SPLASH
gulp.task( 'logo-three', [ 'logo-one', 'logo-two' ],  function ( callback ) {
	// layer splash on bg
	return gulp.src('./temp/bg.png')
	.pipe( gm( function ( gmfile ) {
	    return gmfile
		.noProfile()
	    .background( 'none' )
	    .draw( 'image Over 0,0 0,0 temp/temp.png' )
		;
	} ) )
	.pipe( rename( { basename: 'splash.9' } ) )
	.pipe( gulp.dest( 'res/screen/android' ) ); // './.webwrapp/.original/.temp/' ) );
} );

// UPDATE MANIFEST
gulp.task( 'manifestjson', [ 'clean' ],  function ( callback ) {
	return gulp.src( './.webwrapp/.original/webwrapp-manifest.json' )
	//for domain need to parse in protocol, domain, domain_invert, and path:
	.pipe( replace( /amp\.example\.org/g, config.amp ) ) // amp domain
	.pipe( replace( /https:/g, config._protocol + ':' ) ) // protocol first
	.pipe( replace( /www\.example\.com\/path/g, 'www.example.com/' + config._path ) ) // path second
	.pipe( replace( /www\.example\.com/g, config._domain ) ) // then domain
	.pipe( replace( /com\.example\.www/g, config._domain_invert ) ) // then domain inverted, webwrapp should alread be set

	.pipe( replace( /\*\:\/\/www\./g, "*://*." ) ) // wildcard subdomains on wildcard protocols only

	.pipe( replace( /NAME/g, config.name ) )

	.pipe( rename( { basename: 'manifest' } ) )
	.pipe( gulp.dest( './' ) );
} );

// UPDATE CONFIG
gulp.task( 'configxml', [ 'clean' ],  function ( callback ) {
	return gulp.src( './.webwrapp/.original/webwrapp-config.xml' )
	//for domain need to parse in protocol, domain, domain_invert, and path:
	.pipe( replace( /hello@example.com/g, config.authorEmail ) )

	.pipe( replace( /host\s+name\=\"amp\.example\.org"\s+scheme\=\"https\"/g, 'host name="' + config.amp + '" scheme="' + config._protocol + '"' ) )
	.pipe( replace( /host\s+name\=\"www\.example\.com"\s+scheme\=\"https\"/g, 'host name="' + config._domain_wildcard + '" scheme="' + config._protocol + '"' ) )

	.pipe( replace( /https:\/\/www.example.com\/path/g, config._protocol + '://' + config._domain + '/' + config._path ) )
	.pipe( replace( /https:\/\/www.example.com\/\*/g, config._protocol + '://' + config._domain + '/*' ) )

	.pipe( replace( /www.example.com/g, config._domain ) )

	.pipe( replace( /AUTHOR/g, config.authorName ) )
	.pipe( replace( /DESCRIPTION/g, config.description ) )
	.pipe( replace( /NAME/g, config.name ) )
	.pipe( replace( /com.example.www/g, config._domain_invert ) )
	.pipe( replace( /\#STATUSBARBACKGROUNDCOLOR/g, config.statusBarColor ) )

	.pipe( replace( /"WebWrapp 1\.0"/g, '"WebWrapp ' + config.version + '"' ) )

	.pipe( rename( { basename: 'config' } ) )
	.pipe( gulp.dest( './' ) );
} );

// UPDATE HOOKS
gulp.task( 'hooks', [ 'clean' ],  function ( callback ) {
	return gulp.src( './.webwrapp/.original/webwrapp-android_web_hook.html' )
	.pipe( replace( /\/\/com.example.webwrapp\/https\/www.example.com/g, '//' + config._domain_invert + '.webwrapp/' + config._protocol + '/' + config._domain ) )

	.pipe( rename( { basename: 'android_web_hook' } ) )
	.pipe( gulp.dest( './ul_web_hooks/android/' ) );
} );

/*
	Helper functions
*/
function resize ( size, prefix, appendSize, dest, src ) {
	src = src || './.webwrapp/' + config.logo;
	size = size || 192;
	dest = dest || './.webwrapp/.original/.temp/';
	prefix = prefix || 'icon';
	appendSize = appendSize || false;

    return gulp.src( src )
    .pipe( gm( function ( gmfile ) {
        return gmfile
        .setFormat( 'png' ).noProfile().background( 'none' ).gravity( 'Center' )
		.extent( 1200, 1200 )
        .resize( size, size ).extent( size, size ).crop( size, size )
    } ) )
	.pipe( rename( { basename: prefix + ( true === appendSize ? '-' + size : '' ) } ) )
    .pipe( gulp.dest( dest ) );
}

function implode (glue, pieces) {
  //  discuss at: http://locutus.io/php/implode/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Waldo Malqui Silva (http://waldo.malqui.info)
  // improved by: Itsacon (http://www.itsacon.net/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
  //   returns 2: 'Kevin van Zonneveld'

  var i = ''
  var retVal = ''
  var tGlue = ''

  if (arguments.length === 1) {
    pieces = glue
    glue = ''
  }

  if (typeof pieces === 'object') {
    if (Object.prototype.toString.call(pieces) === '[object Array]') {
      return pieces.join(glue)
    }
    for (i in pieces) {
      retVal += tGlue + pieces[i]
      tGlue = glue
    }
    return retVal
  }

  return pieces
} //: implode()

function explode  ( delimiter, string, limit ) {
  //  discuss at: http://locutus.io/php/explode/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: explode(' ', 'Kevin van Zonneveld')
  //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]

  if (arguments.length < 2 ||
    typeof delimiter === 'undefined' ||
    typeof string === 'undefined') {
    return null
  }
  if (delimiter === '' ||
    delimiter === false ||
    delimiter === null) {
    return false
  }
  if (typeof delimiter === 'function' ||
    typeof delimiter === 'object' ||
    typeof string === 'function' ||
    typeof string === 'object') {
    return {
      0: ''
    }
  }
  if (delimiter === true) {
    delimiter = '1'
  }

  // Here we go...
  delimiter += ''
  string += ''

  var s = string.split(delimiter)

  if (typeof limit === 'undefined') return s

  // Support for limit
  if (limit === 0) limit = 1

  // Positive limit
  if (limit > 0) {
    if (limit >= s.length) {
      return s
    }
    return s
      .slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ])
  }

  // Negative limit
  if (-limit >= s.length) {
    return []
  }

  s.splice(s.length + limit)
  return s
} //: explode()

// INIT EVERYTHING
gulp.task( 'default', [
    'clean'
    ,'cssmin'
    ,'htmlmin'
    ,'prep-js', 'uglify-js', 'concat-js'
    ,'logo-zero', 'logo-one', 'logo-two', 'logo-three'
		,'manifestjson'
		,'configxml'
		,'hooks'
	  ,'build-cordova'
		,'final'
	]
	,function () {
	    console.log( "Success!" );
	}
 );
