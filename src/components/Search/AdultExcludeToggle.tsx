import React, { useState } from 'react';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';

import { dodgerBlue40, slateGray20, slateGray60 } from '@ridi/colors';
import { useRouter } from 'next/router';
import { CHECK_ICON_URL } from 'src/constants/icons';

const Input = styled.input`
  width: 20px;
  height: 20px;
  border: 1px solid ${slateGray20};
  box-sizing: border-box;
  border-radius: 2px;
  background: white;
  :checked {
    border: 0;
    background: ${dodgerBlue40} no-repeat;
    background-image: url("${CHECK_ICON_URL.toString()}");
    background-position: center;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 4px 6px 6px;
  border-radius: 4px;
  * {
    cursor: pointer;
  }
  cursor: pointer;
  :active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Label = styled.label`
  margin-left: 6px;
  font-weight: bold;
  font-size: 13px;
  color: ${slateGray60};
`;

function Toggle(props: {
  initialValue: boolean;
  name: string;
  label: string;
  toggleHandler: (...args: any) => void | null;
}) {
  const {
    initialValue, name, label, toggleHandler,
  } = props;
  const [isChecked, setChecked] = useState(initialValue);

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setChecked(!isChecked);
    if (toggleHandler) {
      toggleHandler(!isChecked);
    }
  };
  return (
    <ToggleWrapper onClick={clickHandler}>
      <Input id={name} type="checkbox" name={name} checked={isChecked} />
      <Label htmlFor={name}>{label}</Label>
    </ToggleWrapper>
  );
}

export function AdultExcludeToggle(props: { adultExclude: boolean }) {
  const { adultExclude } = props;
  const router = useRouter();
  const searchParam = new URLSearchParams((router.query as Record<string, string>) || {});

  const toggle = (newValue: boolean) => {
    const value = newValue ? 'y' : 'n';
    searchParam.set('adult_exclude', value);
    const cookie = new Cookies();
    cookie.set('adult_exclude', value, {
      path: '/',
      sameSite: 'lax',
    });
    router.push(`/search?${searchParam.toString()}`);
  };
  return (
    <Toggle
      name="adult_exclude"
      label="성인 제외"
      toggleHandler={toggle}
      initialValue={adultExclude}
    />
  );
}
