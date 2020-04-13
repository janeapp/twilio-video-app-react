import React, { ChangeEvent, FormEvent, useMemo, useState, useEffect } from 'react';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';

const ConnectWhenReady = () => {
  const { user, getToken, getTokenWithJwt, isFetching } = useAppState();
  const { URLRoomName, jwt, jwtHost } = useParams();
  const { isConnecting, connect } = useVideoContext();
  const [leaveUrl, setLeaveUrl] = useState<string>('');

  // Exchange JWT for Twilio Token
  // Only do this if we have a JWT from the url params and the user has granted video permissions
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

    return undefined;
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

  return null;
};

const NotReady = () => <p>Please give permission to access your camera.</p>;

export default function Connect() {
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();

  useMemo(() => {
    if (isVideoEnabled) {
      setCameraReady(true);
    }
  }, [isVideoEnabled]);

  return <>{cameraReady ? <ConnectWhenReady /> : <NotReady />}</>;
}
