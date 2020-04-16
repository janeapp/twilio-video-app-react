import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';

import ReactGA from 'react-ga';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

// Bugsnag
Bugsnag.start({
  apiKey: process.env.REACT_APP_BUGSNAG_KEY || '',
  plugins: [new BugsnagPluginReact(React)],
});
const ErrorBoundary = Bugsnag.getPlugin('react');

// GA
const trackingId = process.env.REACT_APP_GA_KEY || ''; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.
const connectionOptions: ConnectOptions = {
  bandwidthProfile: {
    video: {
      mode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 720, width: 1280 },
        low: { height: 90, width: 160 },
      },
    },
  },
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoApp = () => {
  const { error, setError } = useAppState();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <ErrorBoundary>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppStateProvider>
          <Switch>
            <PrivateRoute path="/jwt/:jwt/host/:jwtHost">
              <VideoApp />
            </PrivateRoute>
          </Switch>
        </AppStateProvider>
      </Router>
    </MuiThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
