# WebWrapp

Currently this is configured for Android only at the moment. iOS will be coming shortly, and maybe even OS X and Windows 10. And along with each of the platforms additional features for each.

Next update for Android will be to add home screen shortcuts.

**ANDROID BUILD**

To start, make sure you have **cordova**, **composer**, **npm**, and **gulp** installed.

 1. Run composer for all required dependencies
 2. Edit **config.json** in **.original** folder with details of your app
 3. If you want to setup multiple apps create additional copies of config.json and place in **.original/apps** folder with a new name like example.json
 4. In **.webwrapp** run:

    $ keytool -genkey -v -keystore webwrapp.jks -keyalg RSA -keysize 2048 -validity 10000 -alias webwrapp

 5. Place the new passwords you created in **.webwrapp/release-signing.properties**
 6. Run **gulp** to prepare dev app
 7. For additional apps you created in  the **apps** folder run:

    $ gulp --config APPNAME

8. For production preparation run one of:

    $ gulp --production
    $ gulp --production --config APPNAME

9. Finally like any Cordova Android build run one of:

    $ cordova run android
    $ cordova build android
    $ cordova build --release android
