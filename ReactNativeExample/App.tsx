/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, LogBox } from 'react-native';

import { SplitFactory, DebugLogger } from '@splitsoftware/splitio-react-native';

// Ignore timers warning when debugging in Android. No need to worry about it: https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
LogBox.ignoreLogs(['Setting a timer']);

export default function App(): JSX.Element {

  // We'll set some data on the component state to be used on the demo view.
  const [evaluatedFeatureFlag, setEvaluatedFeatureFlag] = React.useState<string>('');
  const [featureFlagNames, setFeatureFlagNames] = React.useState<string[]>([]);
  const [treatment, setTreatment] = React.useState<string>('not ready');

  const [factory, setFactory] = React.useState<SplitIO.ISDK>();

  // Instantiate Split SDK factory on component mount.
  React.useEffect(() => {
    const factory = SplitFactory({
      core: {
        // Get your SDK key of client-side type, see https://docs.split.io/docs/understanding-api-keys
        authorizationKey: '<SDK-KEY>',
        // Replace with the key you want to evaluate against
        key: 'react_native_example',
      },
      // Remove if you want to disable logs. See https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#logging
      debug: DebugLogger(),
    });

    // Get the client and manager instances.
    const client = factory.client();
    const manager = factory.manager();
    let intervalId: ReturnType<typeof setInterval>;

    // We'll set an interval to run every three seconds and call getTreatment on
    // a randomly selected feature flag, taking advantage of the SDK manager.
    client.on(client.Event.SDK_READY, () => {
      const evaluateFeatureFlag = () => {
        const featureFlagNames = manager.names();
        const evaluatedFeatureFlag = featureFlagNames[Math.floor(Math.random() * featureFlagNames.length)];

        setEvaluatedFeatureFlag(evaluatedFeatureFlag);
        setFeatureFlagNames(featureFlagNames);
        setTreatment(client.getTreatment(evaluatedFeatureFlag));
      };

      evaluateFeatureFlag();

      // store id for cleanup on unmount.
      intervalId = setInterval(evaluateFeatureFlag, 3000);
    });

    // On component unmount, we clear the interval and destroy the SDK to flush stored information as well as free resources.
    // See https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#shutdown
    return () => {
      clearInterval(intervalId);
      client.destroy();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.smallSection}>
        <Image resizeMode="contain" source={require('./assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.smallSection}>
        <Text>
          Using SDK Version: <Text style={{ fontWeight: 'bold' }}>{factory?.settings.version.split('-')[1]}</Text>.
        </Text>
        <Text>Every three seconds we will evaluate a random feature flag.</Text>
      </View>
      <View style={styles.smallSection}>
        <Text style={styles.bold}>
          Evaluated feature flag: <Text style={{ color: '#4286f4' }}>{evaluatedFeatureFlag}</Text>
        </Text>
        <Text style={styles.bold}>
          Treatment: <Text style={{ color: '#4286f4' }}>{treatment}</Text>
        </Text>
      </View>
      <View style={styles.section}>
        <Text>Configured names for the environment matching the authorization key:</Text>
        <FlatList
          style={{ marginTop: 10 }}
          data={featureFlagNames}
          keyExtractor={item => item}
          renderItem={({ item }) => <Text style={styles.listItem}>&#9679; {item}</Text>}
        />
      </View>
    </View>
  );
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
