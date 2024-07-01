# scraxsystemclient

## Android Installation

Either Build it yourself or download it from the Release page of this repository.

### Build it yourself

Create an APK with the following command (i believe it's running locally, but i am not sure about it yet).

`npx expo run:android --variant release`

the apk file will be at `./android/app/build/outputs/apk/release/app-release.apk`

### Install the APK

Download the APK on your phone and open it.
Your phone should display an install dialog.

## Web Export

Use following command to create a web export.
`npx expo export --platform web`

Upload the `dist` folder afterwards to your server and start the script with the `npx serve dist -p <port>` command.

## DEV

- Install the packages with `npm i`
- start the client with `npm run start` and follow the instructions of expo

Other options:

- `npm run web` for web dev
- `npm run dev` for android dev (ensure that you have a working virtual machine for android and android studio installed)

## Prerequisites

- Installed Java17
- Installed expo globally `npm i -g expo`
