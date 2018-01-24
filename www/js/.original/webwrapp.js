// For collecting variables during app running that don't need permanent storage
///(function () {

var Active = {
	ThemeableBrowser: null,
	UrbanAirshipEvent: null,
};//:Active

var WebWrapp = {
    // Application Constructor
    initialize: function() {
console.log( 'initialize Cordova!' );
        document.addEventListener( 'deviceready', window.WebWrapp.onDeviceReady.bind( this ), false );
    }

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    ,onDeviceReady: function() {
console.log( 'device ready cordova' );
        // Init the Log
//        window.WebWrapp.log();
//				window.WebWrapp.log( navigator.userAgent );

console.log( navigator.userAgent );

				var clearData = window.WebWrappConfig.clearData.toString().toLowerCase();
				if ( null != clearData && "true" == clearData ) {
					setInterval( function () { window.WebWrapp.clearData(); }, 3000 );
				}

        /* cordova plugin add cordova-universal-links-plugin */
				// This allows links from Email and other websites to open the app
				if ( null != universalLinks )
	        universalLinks.subscribe( null, function ( eventData ) {
						console.log( eventData.url );
						window.location.href = eventData.url;
	        } );

/*
				if ( null != window.UAirship ) {
					UAirship.getChannelID( function ( channelID ) {
						console.log("Channel: " + channelID);
						UAirship.setUserNotificationsEnabled( true );

						// Register for any Urban Airship events
						document.addEventListener( "urbanairship.registration", function ( event ) {
						    if (event.error) {
						        console.log( 'There was an error registering for push notifications' );
						    } else {
						        console.log( "Registered with ID: " + event.channelID );
console.log( event );
						    }
						})

						// Register for any Urban Airship push events
						document.addEventListener( "urbanairship.push", function ( event ) {
							Active.UrbanAirshipEvent = event; // store the most recent event
						    console.log( "Incoming push: " + event.message +" : "+ event.extras.deeplink );
console.log( event );
							window.location.href = event.extras.deeplink;
						})
					} );
				}
*/

		setTimeout( function () {
console.log( 'GoTime' )

			// Remove the highlights/focus when you tap on links
			for( var i = 0, els = document.querySelectorAll('*'); i < els.length; i++ ) {
				els[ i ].style[ '-webkit-tap-highlight-color' ] = 'rgba(0, 0, 0, 0)';
				els[ i ].style[ '-webkit-tap-highlight-color' ] = 'transparent';
				els[ i ].style[ '-webkit-focus-ring-color' ] = 'rgba(255, 255, 255, 0)';
				els[ i ].style[ 'outline' ] = 'none';
			}

			// Set CSS class to help the site make styling changes that can be set on the server CSS based on the class: cordova-webwrapp
			var body = document.getElementsByTagName( 'body' );
			if ( body.length >= 1 )
				body[ 0 ].setAttribute( 'class', body[ 0 ].getAttribute( 'class' ) + ' cordova-webwrapp' );

			// Execute Custom JS declared in the config
			try {
				// The customJS declared in the config.json file needs the a function called onPageLoad
				if ( window.WebWrapp.onPageLoad )
					window.WebWrapp.onPageLoad();
			} catch ( e ) {
				console.log( '%c customJS ERRROR:' + err.message, 'color: red' );
			}

		}, 500 ); //:GoTime()

		// If we are using ThemeableBrowser/InAppBrowser
		if ( true === window.WebWrappConfig.ThemeableBrowser.active ) {
			///window.open = cordova.InAppBrowser.open;
			/// ??? !!! May need to keep window.open as default and define Themable when we need it
			window.Open = window.open; // Keep a hold on the old window.open
			window.open = function (open) { // Override with our new function
			    return function (url, name, features) {
					console.log('window.open: '+name+': '+url);
					/*
						Might need to catch some special URLs like twitter.com to allow it to go to the app
					*/
					if (name == '' || name == '_self') {
						window.location.href = url;
	//					window.Open(url, name, features);
					} else {
						return window.WebWrapp.ThemeableBrowser( url );
					}
			    };
			}( window.open );//:window.open

			// Reset all A tags that use http(s) to use ThemeableBrowser
			// Use setTimeout to make sure that A tags by ads get hit -- but if any use iframes then what???
			var resetAtags = setTimeout( function () {
				var $A = document.getElementsByTagName( 'a' );
				var a = 0;
				for ( var i = 0, l = $A.length; i < l; i++ ) {
					if ( $A[i].target == '_blank' && $A[i].href.indexOf('http') == 0 ) {
						$A[i].href = "javascript:window.WebWrapp.ThemeableBrowser(\'"+ $A[i].href +"\')";
						a++;
					}
				}
				console.log( 'Updated '+ a +' of '+ $A.length +' A tags.' );
			}, 200 );//:resetAtags
		}

		// Extend your app underneath the status bar (Android 4.4+ only)
		AndroidFullScreen.showUnderStatusBar( function() { console.log( 'showUnderStatusBar' ); }, errorFunction );
		// Extend your app underneath the system UI (Android 4.4+ only)
		///AndroidFullScreen.showUnderSystemUI(successFunction, errorFunction);
		// Hide system UI and keep it hidden (Android 4.4+ only)
		///AndroidFullScreen.immersiveMode(successFunction, errorFunction);
  } //: onDeviceReady()

	,ThemeableBrowser: function ( url ) {
		console.log('ThemeableBrowser: '+url);

		// Close any previous sessions
		if ( null != Active.ThemeableBrowser ) {
			Active.ThemeableBrowser.close();
			Active.ThemeableBrowser = null;
		}

		Active.ThemeableBrowser = cordova.ThemeableBrowser.open(url, '_blank', window.WebWrappConfig.ThemeableBrowser)
		.addEventListener('openInBrowser', function( e ) {
		    console.log( 'openInBrowser: ' + e.url );
			window.Open( e.url, '_system' ); // use original window.open saved as window.Open
			Active.ThemeableBrowser.close();
		})
		.addEventListener('loadstop', function(e) {
		    console.log('ThemeableBrowser: loadstop: '+ e.url);
		})
		.addEventListener(cordova.ThemeableBrowser.EVT_ERR, function( e ) {
		    console.log( 'ThemeableBrowser: ERROR: ' + e.message );
		})
		.addEventListener(cordova.ThemeableBrowser.EVT_WRN, function( e ) {
		    console.log( 'ThemeableBrowser: WARNING: ' + e.message );
		});//:cordova.ThemeableBrowser.open

		return false;
	}

    ,doubleTimer: 0
    ,log: function ( message ) {
			if ( window.WebWrappConfig.log == null ) {
				// if log is turned off - kill console and alerts
		    var method;
		    var noop = function () {};
		    var methods = [
		      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		      'timeStamp', 'trace', 'warn'
		    ];
		    var length = methods.length;
		    var console = ( window.console = window.console || {} );

			    var alert = noop;

		    while (length--) {
		      method = methods[length];
		      console[method] = noop;
		    }

				return false;
			} else if ( window.WebWrappConfig.log === false ) {
				console.log( message );
				return false;
			}

      var $log = document.getElementById( 'CordovaLog' );
      var $debug = document.getElementById( 'CordovaDebug' );
      var storage = window.localStorage;

      if ( null == $log ) {
        var div = document.createElement( "div" );
        div.id = 'CordovaDebug';
        div.style.position = 'fixed';
        div.style.overflow = 'auto';
        div.style.bottom = '0';
        div.style.left = '0';
        div.style.height = '15%';
        div.style.width = '100%';
        div.style.zIndex = '9876543210';
        div.innerHTML = '<div id="CordovaLog" style="background:rgba(255,255,255,0.9); border-top:1px solid #999; color:#900; width:1000%; height:100%; overflow:hidden;">...<br></div>';

        document.body.appendChild(div);
        $log = document.getElementById( 'CordovaLog' );
        $debug = document.getElementById( 'CordovaDebug' );
      }

      if ( !message || null == message || undefined == message ) {
        var log = storage.getItem( 'CordovaLog' );

        $log.innerHTML = log;
      } else {
        message = Math.floor(Date.now() / 1000).toString().slice(6) +": "+ message;
console.log( message ); // also echo the same message to the console
        var log = message +'<br>'+ $log.innerHTML;
        $log.innerHTML = log;

        storage.setItem( 'CordovaLog' , log );
      }

      $debug.addEventListener( 'touchstart', function (ev) {
console.log(ev);
        var getTime = ev.timeStamp; //Date.now();
console.log( getTime +' ? '+ window.WebWrapp.doubleTimer );
        if ( window.WebWrapp.doubleTimer > 0 && getTime != window.WebWrapp.doubleTimer && getTime < ( window.WebWrapp.doubleTimer + 400 ) ) {
console.log( 'double?' );
          document.getElementById( 'CordovaDebug' ).style.display = 'none';
          window.WebWrapp.doubleTimer = 0;
        } else {
          window.WebWrapp.doubleTimer = getTime;
        }
        ev.stopPropagation();
        return false;
      }, false );
    } //: log()

		,deleteAllCookies: function() {
			var cookies = document.cookie.split(";");

			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		}

		,clearData: function() {
			// Via plugin for cache
			if ( null != window.CacheClear )
				window.CacheClear( function() { /* console.log('CacheClear Success') */ }, function() { console.log('CacheClear FAILED') } );
			// Via plugin for Cookies
			if ( null != window.cookies )
				window.cookies.clear( function() { /* console.log('Cookies cleared!') */ } );

			// Via native methods for testing/backup
			try {
				if ( null != cookies && 0 < cookies.length ) {
					for ( var key in cookies )
						cookies[ key ].remove();
					cookies.remove();
///console.log( 'cookies.remove()' );
				} else {
///console.log( 'cookies already empty' );
				}
			} catch ( e ) {
				window.WebWrapp.deleteAllCookies();
///console.log( 'NO cookies.remove() -> using generic method.' );
			}

	/*
			try {
	//						history.go( -( history.length - 1) );
console.log( 'history.go()' );
			} catch ( e ) {
console.log( 'NO history.go()' );
			}
	*/

			try {
				if ( 0 < caches.length ) {
					for ( var key in caches )
						( caches[ key ] ).delete();
///console.log( 'cache.delete()' );
				}
///console.log( 'caches already empty' );
			} catch ( e ) {
///console.log( 'NO cache.delete()' );
			}

			try {
				if ( 0 < localStorage.length ) {
					localStorage.clear();
///console.log( 'localStorage.clear()' );
				}
			} catch ( e ) {
///console.log( 'NO localStorage.clear()' );
			}
		}
}; //: WebWrapp{}

window.WebWrapp = WebWrapp;
window.WebWrapp.initialize();

/* cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=joelnagy  */
/*
function handleOpenURL(url) {
  console.log("received url: " + url);
  window.location.href = url.slice('joelnagy:'.length+1);
//  setTimeout(function() {
//    alert("received url: " + url);
//  }, 0);
}
*/
///});
