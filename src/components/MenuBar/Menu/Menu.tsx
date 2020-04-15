import React, { useState, useRef, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import MoreIcon from '@material-ui/icons/MoreVert';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function Menu() {
  const { room, localTracks } = useVideoContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setMenuOpen(state => !state)}>
        <MoreIcon />
      </IconButton>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        <MenuItem>
          <Link
            style={{ color: '#fff' }}
            href="https://jane.app/guide/telehealth/how-to-join-your-online-appointment-for-patients"
            target="_blank"
            rel="nofollow"
          >
            Help
          </Link>
        </MenuItem>
      </MenuContainer>
    </div>
  );
}
