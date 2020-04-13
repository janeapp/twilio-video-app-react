import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import LocalAudioLevelIndicator from './LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { URLRoomName, jwt, jwtHost } = useParams();
  const { user, getToken, getTokenWithJwt, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [leaveUrl, setLeaveUrl] = useState<string>('');

  useEffect(() => {
    if (!jwt) {
      return undefined;
    }

    // @ts-ignore
    getTokenWithJwt(jwt, jwtHost).then(data => {
      console.log('info from rails', data);
      const { token, leave_url, survey_url } = data;

      setLeaveUrl(leave_url);

      return connect(token);
    });
  }, [jwt]);

  useEffect(() => {
    if (leaveUrl.length) {
      const startedAt = new Date().toISOString();

      const unload = () => {
        const obj = {
          jwt: jwt,
          started_at: startedAt,
        };
        const beaconData = new Blob([JSON.stringify(obj, null, 2)], { type: 'text/plain; charset=UTF-8' });
        navigator.sendBeacon(leaveUrl, beaconData);
      };

      window.addEventListener('unload', unload);

      return () => {
        window.removeEventListener('unload', unload);
      };
    }
  }, [leaveUrl]);

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
  }, [URLRoomName]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL beacuse routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    getToken(name, roomName).then(token => connect(token));
  };

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        {roomState === 'disconnected' ? <h3>Loading...</h3> : <h3>{roomName}</h3>}
        <div className={classes.rightButtonContainer}>
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
