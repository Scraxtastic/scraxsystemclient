# scraxsystemclient

## How to install it on my android device?

### Create an APK with the following command (i believe it's running locally, but i am not sure about it yet)

`npx expo run:android --variant release`

file will be at `./android/app/build/outputs/apk/release/app-release.apk`

### Search the APK

android/app/outputs/[debug|release]/[*].apk

### Install the APK

Download the APK on your phone and open it.
Your phone should display an install dialog.

### Profit!

## DEV

`npm run android:tunnel`

## Prerequisites

- Installed Java17
