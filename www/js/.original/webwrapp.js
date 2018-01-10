var Config = {
	log: false // null = kill, true = use onscreen logging, false = off-screen logging only
	,ThemeableBrowser: {
		active: false // true = Use ThemeableBrowser/InAppBrowser, false = use default/Chrome
	    ,statusbar: {
	        color: '#000000'
	    }
	    ,toolbar: {
	        height: 44,
	        color: '#000000'
	    }
	    ,title: {
	        color: '#000000',
	        showPageTitle: false
	    }
	    ,closeButton: {
			wwwImage: 'img/close.png',
    		wwwImagePressed: 'img/close.png',
			wwwImageDensity: 1,
	        align: 'left',
	        event: 'closePressed'
	    }
		,menu: {
			wwwImage: 'img/menu.png',
    		wwwImagePressed: 'img/menu.png',
			wwwImageDensity: 1,
	        title: 'Menu',
	        cancel: 'Cancel',
	        align: 'right',
	        items: [
	            {
	                event: 'openInBrowser',
	                label: 'Open in Browser'
	            }
	        ]
		}
		,backButtonCanClose: true
	}
};//:Config

// For collecting variables during app running that don't need permanent storage
var Active = {
	ThemeableBrowser: null,
	UrbanAirshipEvent: null,
};//:Active

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener( 'deviceready', this.onDeviceReady.bind( this ), false );
    }

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    ,onDeviceReady: function() {

        // Init the Log
        app.log();

		app.log( navigator.userAgent );

        /* cordova plugin add cordova-universal-links-plugin */
		// This allows links from Email and other websites to open the app
        universalLinks.subscribe( 'universalLink', function ( eventData ) {
			app.log( eventData.url );
			window.location.href = eventData.url;
        } );

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
		

		// Remove the highlights/focus when you tap on links
		var noFocus = setTimeout( function () {
			for( var i = 0, els = document.querySelectorAll('*'); i < els.length; i++ ) {
				els[ i ].style[ '-webkit-tap-highlight-color' ] = 'rgba(0, 0, 0, 0)';
				els[ i ].style[ '-webkit-tap-highlight-color' ] = 'transparent';
				els[ i ].style[ '-webkit-focus-ring-color' ] = 'rgba(255, 255, 255, 0)';
				els[ i ].style[ 'outline' ] = 'none';
			}
			
/*			
			jQuery( 'body' ).addClass( 'cordova' );
			
			jQuery( '#sub_categories_widget-3' )
			.css( { 'margin-top': '13vh'; } );
			
			jQuery( '#post-area post, #post-area .gridly-image, #post-area .gridly-image' )
			.css( { width: '95vw'; } );

			jQuery( '#post-area .gridly-copy' )
			.css( { width: '90vw'; } );
			
			$( '#post-area' )
			.css( { width: '95vw'; } )
			.masonry( {
				itemSelector: '.post'
				, isAnimated: true
				, animationOptions: {
					duration: 400
					, easing: 'linear'
					, queue: false
				}
			} );
		}
*/
		}, 123 );//:noFocus

		// If we are using ThemeableBrowser/InAppBrowser
		if ( true === Config.ThemeableBrowser.active ) {		
			///window.open = cordova.InAppBrowser.open;		
			/// ??? !!! May need to keep window.open as default and define Themable when we need it
			window.Open = window.open; // Keep a hold on the old window.open
			window.open = function (open) { // Override with our new function
			    return function (url, name, features) {
					app.log('window.open: '+name+': '+url);
					/*
						Might need to catch some special URLs like twitter.com to allow it to go to the app
					*/
					if (name == '' || name == '_self') {
						window.location.href = url;
	//					window.Open(url, name, features);
					} else {
						return app.ThemeableBrowser( url );
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
						$A[i].href = "javascript:app.ThemeableBrowser(\'"+ $A[i].href +"\')";
						a++;
					}
				}
				app.log( 'Updated '+ a +' of '+ $A.length +' A tags.' );
			}, 200 );//:resetAtags
		}

		// Extend your app underneath the status bar (Android 4.4+ only)
		AndroidFullScreen.showUnderStatusBar( function() { console.log( 'showUnderStatusBar' ); }, errorFunction );
		// Extend your app underneath the system UI (Android 4.4+ only)
		///AndroidFullScreen.showUnderSystemUI(successFunction, errorFunction);
		// Hide system UI and keep it hidden (Android 4.4+ only)
		///AndroidFullScreen.immersiveMode(successFunction, errorFunction);
    }//:onDeviceReady

	,ThemeableBrowser: function ( url ) {
		app.log('ThemeableBrowser: '+url);
		
		// Close any previous sessions
		if ( null != Active.ThemeableBrowser ) {
			Active.ThemeableBrowser.close();
			Active.ThemeableBrowser = null;
		}
		
		Active.ThemeableBrowser = cordova.ThemeableBrowser.open(url, '_blank', Config.ThemeableBrowser)
		.addEventListener('openInBrowser', function( e ) {
		    app.log( 'openInBrowser: ' + e.url );
			window.Open( e.url, '_system' ); // use original window.open saved as window.Open
			Active.ThemeableBrowser.close();
		})
		.addEventListener('loadstop', function(e) {
		    app.log('ThemeableBrowser: loadstop: '+ e.url);
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
		if ( Config.log == null ) {
			// if log is turned off - kill console and alerts
			
			(function() {
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
			}());
			
			return false;
		} else if ( Config.log === false ) {
			console.log( message );
			return false;
		}
		
        var $log = document.getElementById( 'CordovaLog' );
        var $debug = document.getElementById( 'CordovaDebug' );
        var storage = window.localStorage;

        if (null == $log) {
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
			console.log (message); // also echo the same message to the console
            var log = message +'<br>'+ $log.innerHTML;
            $log.innerHTML = log;

            storage.setItem( 'CordovaLog' , log );
        }

        $debug.addEventListener( 'touchstart', function (ev) {
console.log(ev);
            var getTime = ev.timeStamp; //Date.now();
console.log( getTime +' ? '+ app.doubleTimer );
            if ( app.doubleTimer > 0 && getTime != app.doubleTimer && getTime < ( app.doubleTimer + 400 ) ) {
console.log( 'double?' );
                document.getElementById( 'CordovaDebug' ).style.display = 'none';
                app.doubleTimer = 0;
            } else {
                app.doubleTimer = getTime;
            }
            ev.stopPropagation();
            return false;
        }, false);
    }//:log
};//:app

app.initialize();

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