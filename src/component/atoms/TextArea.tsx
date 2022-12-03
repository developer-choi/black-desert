import React, {ComponentPropsWithoutRef, forwardRef, KeyboardEvent, Ref, useCallback} from 'react';
import {isMatchKeyboardEvent} from '@util/extend/keyboard-event';
import {useCustomOnChange} from '@component/atoms/InputText';
import styled from 'styled-components';

export interface TextAreaProp extends ComponentPropsWithoutRef<'textarea'> {
  onChangeText?: (value: string) => void;
  onCtrlEnter?: (event: KeyboardEvent) => void;
}

export default forwardRef(function TextArea(props: TextAreaProp, ref: Ref<HTMLTextAreaElement>) {
  const {onKeyDown, onChangeText, onChange, onCtrlEnter, maxLength = 100000, ...rest} = props;

  const customOnChange = useCustomOnChange({onChange, onChangeText, maxLength});

  const customOnKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMatchKeyboardEvent(event, {key: 'Enter', specialKeys: ['ctrlKey']})) {
      onCtrlEnter?.(event);
    }

    onKeyDown?.(event);
  }, [onKeyDown, onCtrlEnter]);

  return (
    <StyledTextArea
      ref={ref}
      onChange={customOnChange}
      onKeyDown={customOnKeyDown}
      {...rest}
    />
  );
});

const StyledTextArea = styled.textarea`
  border: 2px solid ${props => props.theme.main};
  border-radius: 10px;
  padding: 8px;
  width: 100%;
  min-height: 300px;
  resize: none;
`;
