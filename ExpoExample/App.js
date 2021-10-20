/**
 * Sample Expo App
 * https://docs.expo.dev/
 */

import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, LogBox } from 'react-native';

// Polyfill global EventSource to use Split SDK streaming feature in Expo
import RNEventSource from 'react-native-event-source';
globalThis.EventSource = RNEventSource;

import { SplitFactory, DebugLogger } from '@splitsoftware/splitio-react-native';

// Ignore timers warning when debugging in Android. No need to worry about it: https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
LogBox.ignoreLogs(['Setting a timer']);

export default class App extends React.Component {
  sdkVersion = '';

  constructor(props) {
    super(props);

    // We'll set some data on the component state to be used on the demo view.
    this.state = {
      treatment: 'not ready',
      evaluatedSplit: '',
      splitNames: [],
    };
  }

  _initSdk() {
    const factory = SplitFactory({
      core: {
        // Get your authorization key, you'll need browser type permissions, see https://docs.split.io/docs/understanding-api-keys
        authorizationKey: '<API-KEY>',
        // Replace with the key you want to evaluate against
        key: 'react_native_with_expo_example',
      },
      // Remove if you want to disable logs. See https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#logging
      debug: DebugLogger(),
    });

    // Get the client and manager instances.
    this.client = factory.client();
    this.manager = factory.manager();

    // Store the version, this won't change.
    this.sdkVersion = factory.settings.version.match(/(?:\.?\d{1,2}){3}/);

    // We'll set an interval to run every three seconds and call getTreatment on
    // a randomly selected Split, taking advantage of the SDK manager.
    this.client.on(this.client.Event.SDK_READY, () => {
      const evaluateSplit = () => {
        const splitNames = this.manager.names();
        const evaluatedSplit = splitNames[Math.floor(Math.random() * splitNames.length)];

        this.setState({
          treatment: this.client.getTreatment(evaluatedSplit),
          evaluatedSplit: evaluatedSplit,
          splitNames,
        });
      };

      evaluateSplit();

      // store id for cleanup on unmount.
      this.intervalId = setInterval(evaluateSplit, 3000);
    });
  }

  componentDidMount() {
    // Instantiate Split SDK factory
    this._initSdk();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    // Destroy the client to flush stored information as well as free resources.
    // See https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#shutdown
    this.client.destroy();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.smallSection}>
          <Image resizeMode="contain" source={require('./assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.smallSection}>
          <Text>
            Using SDK Version: <Text style={{ fontWeight: 'bold' }}>{this.sdkVersion}</Text>.
           </Text>
          <Text>Every three seconds we will evaluate a random Split.</Text>
        </View>
        <View style={styles.smallSection}>
          <Text style={styles.bold}>
            Evaluated Split: <Text style={{ color: '#4286f4' }}>{this.state.evaluatedSplit}</Text>.
           </Text>
          <Text style={styles.bold}>
            Treatment: <Text style={{ color: '#4286f4' }}>{this.state.treatment}</Text>.
           </Text>
        </View>
        <View style={styles.section}>
          <Text>Configured names for the environment matching the authorization key:</Text>
          <FlatList
            style={{ marginTop: 10 }}
            data={this.state.splitNames}
            keyExtractor={item => item}
            renderItem={({ item }) => <Text style={styles.listItem}>&#9679; {item}</Text>}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flex: 3,
    marginBottom: 20,
  },
  smallSection: {
    flex: 1,
    marginBottom: 20,
  },
  logo: {
    height: '100%',
    maxHeight: 100,
  },
  listItem: {
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
