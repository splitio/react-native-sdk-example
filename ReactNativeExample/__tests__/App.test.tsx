// Note: import explicitly to use the types shiped with jest.
import {jest, it, expect} from '@jest/globals';

/**
 * If you're looking for how to test with Split SDK, you can mock the module import (see https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options)
 * using the localhost (offline) mode of the SDK (see https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode)
 * which is what we're doing here.
 *
 * It is not recommended to use the default (online) mode of the SDK in your tests because that will slow them down and increase their flakiness due to network latencies.
 *
 * Also, don't forget to destroy each created SDK instance, to free resources and clean pending async operations that might prevent Jest from exiting cleanly.
 * In this test, the App component itself creates and destroys the SDK on `componentDidMount` and `componentWillUnmount` respectively.
 */
jest.mock('@splitsoftware/splitio-react-native', () => {
  const splitio: any = jest.requireActual('@splitsoftware/splitio-react-native');
  return {
    ...splitio,
    SplitFactory: () => {
      return splitio.SplitFactory({
        core: {
          authorizationKey: 'localhost',
        },
        // Mock your feature flags here
        features: {
          feature_flag_1: 'on',
        },
        sync: {
          localhostMode: splitio.LocalhostFromObject(),
        },
      });
    },
  };
});

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const getEvaluation = (root: any) => {
  // eslint-disable-next-line prettier/prettier
  const [{ children: [, featureFlagName] }, { children: [, treatment] }] = root.toJSON().children[2].children;
  return {
    featureFlagName: featureFlagName.children ? featureFlagName.children[0] : '',
    treatment: treatment.children[0],
  };
};

it('App renders correctly', done => {
  // At initial render, the SDK is instantiated but not ready yet
  let root = renderer.create(<App />);

  let evaluation = getEvaluation(root);
  expect(evaluation.featureFlagName).toBe('');
  expect(evaluation.treatment).toBe('not ready');

  // Since we mocked the SDK to run in localhost mode, on next tick the SDK is ready
  // and the component is re-rendered with the mocked feature flag name and treatment
  setTimeout(() => {
    evaluation = getEvaluation(root);
    //
    expect(evaluation.featureFlagName).toBe('feature_flag_1');
    expect(evaluation.treatment).toBe('on');

    // Unmount component to stop asynchronous operations and exit jest immediately
    root.unmount();

    done();
  }, 0 /* next tick */);
});
