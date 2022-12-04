import React, {ChangeEvent, ComponentPropsWithoutRef, ComponentType, MouseEvent, useCallback} from 'react';
import styled from 'styled-components';
import {isMatchSpecialKey} from '@util/extend/keyboard-event';
import classNames from 'classnames';

export interface CheckBoxLabelLeftProps {
  checked: boolean;
  disabled?: boolean;
}

export interface CheckBoxProps extends ComponentPropsWithoutRef<'label'>, Pick<ComponentPropsWithoutRef<'input'>, 'disabled' | 'checked'> {
  onChangeChecked: (checked: boolean) => void;
  onShiftChecked?: (event: MouseEvent<HTMLInputElement>) => void; //shift 누른상태로 클릭함과 동시에 checked값이 true일때에만 호출됨.
  label?: string;
  checked: boolean;
  labelLeft?: ComponentType<CheckBoxLabelLeftProps>;
}

export default function CheckBox({onChangeChecked, label = '', checked, className, disabled, labelLeft: LabelLeft, onShiftChecked, ...rest}: CheckBoxProps) {
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChangeChecked(event.target.checked);
  }, [onChangeChecked]);
  
  const onClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
    if (onShiftChecked && isMatchSpecialKey(event, ['shiftKey'])) {
      onShiftChecked(event);
    }
  }, [onShiftChecked]);
  
  return (
      <Label className={classNames({checked: disabled ? false : checked, disabled}, className)} {...rest}>
        {LabelLeft && <LabelLeft checked={checked} disabled={disabled}/>}
        <input type="checkbox" onChange={onChange} checked={checked} disabled={disabled} onClick={onClick}/>
        {label}
      </Label>
  );
}

const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  
  input {
    margin-right: 3px;
  }
`;
