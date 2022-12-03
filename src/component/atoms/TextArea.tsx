import React, {ComponentProps, forwardRef, KeyboardEvent, Ref, useCallback} from "react";
import {isMatchKeyboardEvent} from "@util/extend/keyboard-event";
import {useCustomOnChange} from '@component/atoms/InputText';

export interface TextAreaProp extends ComponentProps<'textarea'> {
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
      <textarea
          ref={ref}
          onChange={customOnChange}
          onKeyDown={customOnKeyDown}
          {...rest}
      />
  );
});
