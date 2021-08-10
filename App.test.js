import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

/**
 * @TODO update this test to use Jest mock of `@splitsoftware/splitio-react-native`
 */

// Using this naming convention so jest.mock allows me to use it on mock factory.
import mockSplitSDK from '@splitsoftware/splitio';

// Note: No test cases have been modified since this is an example app.
// If you're looking for how to test with Split SDK, you can:
//    * mock the module import, see https://facebook.github.io/jest/docs/en/jest-object.html#jestmockmodulename-factory-options
//    * use the localhost (offline) mode of the JS SDK, which is what we're using here.
//      see https://docs.split.io/docs/javascript-sdk-overview#section-localhost-mode

describe('Our app renders without crashing', () => {
  beforeAll(() => {
    jest.mock('@splitsoftware/splitio', () => {
      return mockSplitSDK.SplitFactory({
        core: {
          authorizationKey: 'localhost'
        },
        features: {
          split_1: 'on',
          split_2: 'off'
        }
      });
    });
  });

  it('renders without crashing', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toBeTruthy();
  });
});


