import React from 'react';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';

import { dodgerBlue40, slateGray20, slateGray60 } from '@ridi/colors';
import { CHECK_ICON_URL } from 'src/constants/icons';
import { useSearchQueries } from 'src/hooks/useSearchQueries';

const Input = styled.input`
  width: 20px;
  height: 20px;
  border: 1px solid ${slateGray20};
  box-sizing: border-box;
  border-radius: 2px;
  background: white;
  margin-right: 6px;
  :checked {
    border: 0;
    background: ${dodgerBlue40} no-repeat center;
    background-image: url("${CHECK_ICON_URL}");
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  padding: 6px 4px 6px 6px;
  border-radius: 4px;
  &, * {
    cursor: pointer;
  }
  :active {
    background: rgba(0, 0, 0, 0.05);
  }

  font-weight: bold;
  font-size: 13px;
  color: ${slateGray60};
`;

function Toggle(props: {
  isChecked: boolean;
  name: string;
  label: string;
  toggleHandler: (isChecked: boolean) => void;
}) {
  const {
    isChecked, name, label, toggleHandler,
  } = props;

  const clickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (toggleHandler) {
      toggleHandler(e.target.checked);
    }
  };
  return (
    <Label>
      <Input onChange={clickHandler} id={name} type="checkbox" name={name} checked={isChecked} />
      {label}
    </Label>
  );
}

export function AdultExcludeToggle(props: { adultExclude: boolean }) {
  const { adultExclude } = props;
  const { updateQuery } = useSearchQueries();
  const toggle = React.useCallback((newValue: boolean) => {
    const cookieValue = newValue ? 'y' : 'n';
    const cookie = new Cookies();
    cookie.set(
      'adult_exclude',
      cookieValue,
      {
        path: '/',
        sameSite: 'lax',
      },
    );
    updateQuery({ isAdultExclude: newValue });
  }, [updateQuery]);
  return (
    <Toggle
      name="adult_exclude"
      label="성인 제외"
      toggleHandler={toggle}
      isChecked={adultExclude}
    />
  );
}
