import React from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';

import useFullScreenToggle from '../../../hooks/useFullScreenToggle/useFullScreenToggle';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  if (matches) {
    return null;
  }

  return (
    <IconButton aria-label={`full screen`} onClick={toggleFullScreen}>
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  );
}
