import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import analytics from '../../analytics';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : true);

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : true);

    if (track) {
      const setEnabled = () => {
        analytics('trackEnabled', `${track} enabled`);
        return setIsEnabled(true);
      };
      const setDisabled = () => {
        analytics('trackDisabled', `${track} disabled`);
        return setIsEnabled(false);
      };
      track.on('enabled', setEnabled);
      track.on('disabled', setDisabled);
      return () => {
        track.off('enabled', setEnabled);
        track.off('disabled', setDisabled);
      };
    }
  }, [track]);

  return isEnabled;
}
