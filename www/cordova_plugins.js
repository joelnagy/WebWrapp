cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-hostedwebapp.hostedwebapp",
        "file": "plugins/cordova-plugin-hostedwebapp/www/hostedWebApp.js",
        "pluginId": "cordova-plugin-hostedwebapp",
        "clobbers": [
            "hostedwebapp"
        ]
    },
    {
        "id": "cordova-universal-links-plugin.universalLinks",
        "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
        "pluginId": "cordova-universal-links-plugin",
        "clobbers": [
            "universalLinks"
        ]
    },
    {
        "id": "cordova-plugin-themeablebrowser.themeablebrowser",
        "file": "plugins/cordova-plugin-themeablebrowser/www/themeablebrowser.js",
        "pluginId": "cordova-plugin-themeablebrowser",
        "clobbers": [
            "cordova.ThemeableBrowser"
        ]
    },
    {
        "id": "urbanairship-cordova.UrbanAirship",
        "file": "plugins/urbanairship-cordova/www/UrbanAirship.js",
        "pluginId": "urbanairship-cordova",
        "clobbers": [
            "UAirship"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-statusbar": "2.2.0",
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-network-information": "1.3.1",
    "cordova-plugin-hostedwebapp": "0.3.1",
    "cordova-universal-links-plugin": "1.2.1",
    "cordova-plugin-themeablebrowser": "0.2.17",
    "urbanairship-cordova": "6.3.0"
};
// BOTTOM OF METADATA
});