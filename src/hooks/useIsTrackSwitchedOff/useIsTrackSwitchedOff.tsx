import { useState, useEffect } from 'react';
import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';
import analytics from '../../analytics';

type TrackType = RemoteVideoTrack | LocalVideoTrack | undefined | null;

// The 'switchedOff' event is emitted when there is not enough bandwidth to support
// a track. See: https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api#understanding-track-switch-offs

export default function useIsTrackSwitchedOff(track: TrackType) {
  const [isSwitchedOff, setIsSwitchedOff] = useState(track && track.isSwitchedOff);

  useEffect(() => {
    // Reset the value if the 'track' variable changes
    setIsSwitchedOff(track && track.isSwitchedOff);

    if (track) {
      const handleSwitchedOff = () => {
        analytics('trackSwitchedOff', `${track} switched off`);
        return setIsSwitchedOff(true);
      };
      const handleSwitchedOn = () => {
        analytics('trackSwitchedOn', `${track} switched on`);
        return setIsSwitchedOff(false);
      };
      track.on('switchedOff', handleSwitchedOff);
      track.on('switchedOn', handleSwitchedOn);
      return () => {
        track.off('switchedOff', handleSwitchedOff);
        track.off('switchedOn', handleSwitchedOn);
      };
    }
  }, [track]);

  return !!isSwitchedOff;
}
