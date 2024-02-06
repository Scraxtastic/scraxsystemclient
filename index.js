import { registerRootComponent } from "expo";
// global.Buffer = require("buffer").Buffer;
// import { polyfillWebCrypto } from "expo-standard-web-crypto";
// polyfillWebCrypto();

// Object.assign(global, { WebSocket: require('ws') });

// import "./shim.js";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
