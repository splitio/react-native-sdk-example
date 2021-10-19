# Split React Native SDK example application.

This project was bootstrapped with [React Native CLI](https://reactnative.dev/docs/getting-started) .

```sh
$ npx react-native init ReactNativeExample
$ cd ReactNativeExample/
$ npm install --save @splitsoftware/splitio-react-native # or 'yarn add @splitsoftware/splitio-react-native' if using yarn dependency manager
```

## Table of Contents
* [Setup](#prerrequisites)
* [Available Scripts](#available-scripts)
  * [npm start](#npm-start)
  * [npm test](#npm-test)
  * [npm run ios](#npm-run-ios)
  * [npm run android](#npm-run-android)

## Setup

You'll need [NodeJS](https://nodejs.org/en/download/). We recommend that you use the latest LTS version.

Second thing you'll need is to install Android Studio and Xcode for Android and iOS development respectively. See [React Native - Setting up the development environment](https://reactnative.dev/docs/environment-setup) for more details.

To run the app, first change the `'<API-KEY>'` string in the App.js file with the browser key of your Split environment. Optionally, you can try a localhost configuration as the example below:

```javascript
const factory = SplitFactory({
    core: {
        authorizationKey: 'localhost',
        key: 'some_key'
    },
    features: {
        'Test_Split': 'on',
        'Test_Another_Split': 'dark',
        'Test_Something_Else': 'off'
    }
});
```

Then install the project dependencies and run the server that communicates with connected devices:

```sh
npm install
cd ios/ && pod install && cd .. # for iOS only
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

If you're looking for how to test with Split SDK, you can mock the module import (see [Jest documentation](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options)) using the [localhost mode](https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode) of the SDK, which is what we're doing here.

### `npm run ios`

Builds your app and starts it on iOS simulator.

### `npm run android`

Builds your app and starts it on a connected Android emulator or device.
