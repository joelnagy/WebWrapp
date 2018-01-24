var WebWrappConfig = {
	log: false // null = kill, true = use onscreen logging, false = off-screen logging only
	,clearData: false
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
