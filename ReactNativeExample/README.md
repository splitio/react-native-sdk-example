# Split React Native SDK example application.

This project was bootstrapped with [React Native CLI](https://reactnative.dev/docs/getting-started).

```sh
$ npx react-native init ReactNativeExample
$ cd ReactNativeExample/
$ npm install @splitsoftware/splitio-react-native # or 'yarn add @splitsoftware/splitio-react-native' if using yarn dependency manager
$ cd ios/ && pod install # required to have the SDK streaming feature working on iOS
```

## Table of Contents
* [Setup](#prerrequisites)
* [Available Scripts](#available-scripts)
  * [npm start](#npm-start)
  * [npm test](#npm-test)
  * [npm run ios](#npm-run-ios)
  * [npm run android](#npm-run-android)

## Setup

You'll need [Node.js](https://nodejs.org/en/download/). This project was created with an old version of Node.js (v18.17.0) and we **recommend using the same version** to avoid any issues. So consider installing [Node.js Version Manager](https://github.com/nvm-sh/nvm) to manage different versions of Node.js, and running the commands `nvm install` and `nvm use` in the project's root directory to set the correct version before following the next steps.

Second thing you'll need is to install Android Studio and Xcode for Android and iOS development respectively. See [React Native - Setting up the development environment](https://reactnative.dev/docs/environment-setup) for more details.

To run the app, first replace the `'<SDK-KEY>'` string in the App.js file with the SDK key of client-side type of your Split environment.

Optionally, you can try a [localhost configuration](https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode) as the example below:

```javascript
// Localhost mode is simpler to set by importing the SplitFactory from the `full` entrypoint of the SDK
import { SplitFactory } from '@splitsoftware/splitio-react-native/full';

const factory = SplitFactory({
  core: {
    authorizationKey: 'localhost',
    key: 'some_key',
  },
  features: {
    test_feature_flag: 'on',
    test_another_feature_flag: 'dark',
    test_something_else: 'off',
  },
});
```

Then install the project dependencies and run the server that communicates with connected devices:

```sh
npm install
cd ios/ && pod install && cd .. # required to have the SDK streaming feature working on iOS
npm start # init Metro bundler server
```

Finally run either `npm run android` or `npm run ios` in a separete terminal to build and launch the app in a connected device or emulator.

When running you should see a screen like the image below (taken from an Android device).

![Running instance screenshot](../docs/mobile_screenshot.png)

More information on the available scripts below.

## Available Scripts

### `npm start`

Starts the Metro bundler server that communicates with connected devices.

### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

If you're looking for how to test with Split SDK, you can mock the module import (see [Jest documentation](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options)) using the [localhost mode](https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode) of the SDK, which is what we're doing [here](./__tests__/App.test.js).

### `npm run ios`

Builds your app and starts it on iOS simulator.

### `npm run android`

Builds your app and starts it on a connected Android emulator or device.
