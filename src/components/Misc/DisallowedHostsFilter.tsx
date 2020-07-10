import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { localStorage } from 'src/utils/storages';
import styled from '@emotion/styled';

const Badge = styled.div`
  width: 150px;
  background: #8c9dad;
  color: white;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  line-height: 16px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 999;
  position: fixed;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  left: 50%;
  transform: translateX(-50%);
  display: block;
`;

const DisallowedHostsFilter: React.FC = () => {
  const [stage, setStage] = useState('');

  useEffect(() => {
    const cookies = new Cookies();
    setStage(cookies.get('stage'));

    const bypass = JSON.parse(localStorage.getItem('disallowed-hosts-filter/bypass') || 'false');
    if (!stage && location.host === 'books.ridibooks.com' && !bypass) {
      const url = new URL(location.href);
      url.host = 'ridibooks.com';
      location.replace(url.href);
    }
  }, []);

  return !stage ? <></> : (
    <Badge>{stage}</Badge>
  );
};

export default DisallowedHostsFilter;
