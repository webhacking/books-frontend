import React from 'react';
import styled from '@emotion/styled';
import { dodgerBlue40, slateGray30 } from '@ridi/colors';

const Label = styled.label<{isChecked?: boolean}>`
  position: relative;
  width: 46px;
  height: 26px;
  border-radius: 13px;
  transition: 0.2s;
  background: ${(props) => (props.isChecked ? dodgerBlue40 : slateGray30)};
`;

const Input = styled.input`
  width: 0;
  height: 0;
  appearance: none;
`;

const Dot = styled.span<{isChecked?: boolean}>`
  position: absolute;
  background: white;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
  width: 22px;
  height: 22px;
  border-radius: 13px;
  transition: 0.2s;

  top: 2px;
  left: 2px;

  ${(props) => props.isChecked && 'transform: translate(20px, 0);'}
`;

interface Props {
  checked?: boolean;
  callback?: (checked: boolean) => void;
}

export function Switch(props: Props) {
  const { checked, callback } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (callback) {
      callback(e.target.checked);
    }
  };

  return (
    <Label isChecked={checked}>
      <Input checked={checked} onChange={handleChange} />
      <Dot isChecked={checked} />
    </Label>
  );
}
