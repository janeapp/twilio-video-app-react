import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import analytics from '../../analytics';

export default function useParticipantIsReconnecting(participant: Participant) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleReconnecting = () => {
      analytics('reconnecting', 'particpant reconnecting');
      return setIsReconnecting(true);
    };
    const handleReconnected = () => {
      analytics('reconnected', 'particpant reconnected');
      return setIsReconnecting(false);
    };

    participant.on('reconnecting', handleReconnecting);
    participant.on('reconnected', handleReconnected);
    return () => {
      participant.off('reconnecting', handleReconnecting);
      participant.off('reconnected', handleReconnected);
    };
  }, [participant]);

  return isReconnecting;
}
