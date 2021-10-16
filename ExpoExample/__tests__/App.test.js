/**
 * If you're looking for how to test with Split SDK, you can mock the module import (see https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options)
 * using the localhost (offline) mode of the JS SDK (see https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode)
 * which is what we're doing here.
 *
 * It is not recommended to use the default (online) mode of the SDK in your tests to not slow them down and avoid test flakiness due to network latencies.
 * But if you want to do it anyway, be aware that you need to polyfill the 'fetch' API, which is used by the SDK but not provided by Jest (see https://www.npmjs.com/package/isomorphic-fetch).
 */
jest.mock('@splitsoftware/splitio-react-native', () => {
  const splitio = jest.requireActual('@splitsoftware/splitio-react-native');
  return {
    ...splitio,
    SplitFactory: () => {
      return splitio.SplitFactory({
        core: {
          authorizationKey: 'localhost',
        },
        // Mock your splits and treatments here
        features: {
          split_1: 'on',
        },
        sync: {
          localhostMode: splitio.LocalhostFromObject(),
        },
      });
    },
  };
});

import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

const getEvaluation = root => {
  // eslint-disable-next-line prettier/prettier
  const [{ children: [, splitName] }, { children: [, treatment] }] = root.toJSON().children[2].children;
  return {
    splitName: splitName.children[0],
    treatment: treatment.children[0],
  };
};

it('App renders correctly', done => {
  // At initial render, the SDK is instantiated but not ready yet
  let root = renderer.create(<App />);

  let evaluation = getEvaluation(root);
  expect(evaluation.splitName).toBe('');
  expect(evaluation.treatment).toBe('not ready');

  // Since we mocked the SDK to run in localhost mode, on next tick the SDK is ready
  // and the component is re-rendered with the mocked split name and treatment
  setImmediate(() => {
    evaluation = getEvaluation(root);
    //
    expect(evaluation.splitName).toBe('split_1');
    expect(evaluation.treatment).toBe('on');

    // Unmount component to stop asynchronous operations and exit jest inmediately
    root.unmount();

    done();
  }, 100);
});
