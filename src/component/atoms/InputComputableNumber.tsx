import React, {useCallback, useMemo, ClipboardEvent, forwardRef, Ref} from 'react';
import InputText, {InputTextProp} from '@component/atoms/InputText';
import {count, numberWithComma} from '@util/extend/core';

export interface InputComputableNumberOption {
  maxIntegerLength?: number;
  maxDecimalLength?: number;
  max?: number;

  enableComma?: boolean;
  enableDecimal?: boolean;
}

export type InputComputableNumberProp = Omit<InputTextProp, 'type' | 'min'> & InputComputableNumberOption;

/**
 * Overview: Input component used when you want to receive only numbers that can be operated.
 * For example, you can use it when you input a price.
 *
 * onChangeText(text: string)에 매개변수로 전달되는 text는 숫자가 될 가능성이 있는 값입니다.
 * Case1. "." ==> ".0" ==> "0.0"
 * Case2. "000" ==> "1000"
 *
 * 그러므로 text값은 Number() 혹은 parseInt()로 형변환했을 때 의도하지않은 값(0 or NaN)이 될 수 있습니다.
 * This is the intended function.
 *
 * If the user does not enter a value that can never be numeric, it does not prevent the user from entering freely.
 * So when a user submits a value that you enter, you need to verify it in the case of "000" or "."
 */
export default forwardRef(function InputComputableNumber(props: InputComputableNumberProp, ref: Ref<HTMLInputElement>) {

  const {
    maxIntegerLength = DEFAULT_MAX_INTEGER_LENGTH,
    maxDecimalLength,
    enableComma = false,
    enableDecimal = true,
    preventEventKeys = EMPTY_ARRAY,
    onChangeText,
    max,
    value,
    onCopy,
    onCut,
    ...rest
  } = props;

  const _onChangeText = useCallback((text: string) => {
    const cleanedText = enableComma ? cleanText(text) : text;

    if (enableComma && !isPossibleToBeNumber(cleanedText, enableDecimal)) {
      return;
    }

    if (!validateNumber(cleanedText, {max, maxIntegerLength, maxDecimalLength})) {
      return;
    }

    onChangeText?.(cleanedText);

  }, [maxDecimalLength, maxIntegerLength, onChangeText, enableComma, enableDecimal, max]);

  const _preventEventKeys = useMemo(() => {
    const keys = preventEventKeys.concat(BASE_IGNORE_KEYS);

    if (!enableDecimal) {
      keys.push('.');
    }

    return keys;
  }, [preventEventKeys, enableDecimal]);

  //Only for input type is not number (When enableComma is true)
  const customOnCopy = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
    const {value} = event.target as HTMLInputElement;
    event.clipboardData.setData('text/plain', cleanText(value));
    event.preventDefault();
    onCopy?.(event);
  }, [onCopy]);

  //Only for input type is not number (When enableComma is true)
  const customOnCut = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
    const {value} = event.target as HTMLInputElement;
    event.clipboardData.setData('text/plain', cleanText(value));
    event.preventDefault();
    onChangeText?.('');
    onCut?.(event);
  }, [onChangeText, onCut]);

  const type = enableComma ? undefined : 'number';

  return (
    <InputText
      ref={ref}
      onChangeText={_onChangeText}
      type={type}
      inputMode={type === 'number' ? undefined : enableDecimal ? 'decimal' : 'numeric'}
      value={enableComma ? numberWithComma(value) : value}
      preventEventKeys={_preventEventKeys}
      onCopy={enableComma ? customOnCopy : onCopy}
      onCut={enableComma ? customOnCut : onCut}
      {...rest}
    />
  );
});

//Only for input type is not number (When enableComma is true)
function isPossibleToBeNumber(text: string, enableDecimal: boolean): boolean {

  const convertedNumber = Number(text);

  if (Number.isNaN(convertedNumber)) {
    return false;
  }

  const dotCount = count(text, '\\.');

  if (enableDecimal && dotCount > 1) {
    return false;
  }

  if (!enableDecimal && dotCount > 0) {
    return false;
  }

  return true;
}

function validateNumber(text: string, options: Pick<InputComputableNumberOption, 'max' | 'maxDecimalLength' | 'maxIntegerLength'>) {
  const {max, maxDecimalLength, maxIntegerLength} = options;
  const {decimal, integer} = splitNumberDot(text);

  if (maxDecimalLength !== undefined && decimal.length > maxDecimalLength) {
    return false;
  }

  if (maxIntegerLength !== undefined && integer.length > maxIntegerLength) {
    return false;
  }

  const convertedNumber = Number(text);

  if (max !== undefined && max < convertedNumber) {
    return false;
  }

  return true;
}

const DEFAULT_MAX_INTEGER_LENGTH = Number.MAX_SAFE_INTEGER.toString().length;
const EMPTY_ARRAY = [] as string[];

// https://stackoverflow.com/questions/64138536/react-input-type-number-fields-dont-trigger-onchange
const BASE_IGNORE_KEYS = ['e', 'E', '+', '-'];

/**
 * Only for input type is not number (When enableComma is true)
 *
 * This function is not required if enableComma is false and the input type is number.
 * This is because spaces cannot be entered or pasted by the input type number.
 *
 * However, if enableComma is true and becomes input type text,
 * it is possible to enter a space, so the left and right spaces and commas must be deleted.
 */
function cleanText(text: string) {
  return text.trim().replace(/,/g, '');
}

function splitNumberDot(value: string): {integer: string, decimal: string} {
  const integer = Math.floor(Math.abs(Number(value))).toString();
  const dotIndex = value.indexOf('.');
  const decimal = dotIndex === -1 ? '' : value.slice(dotIndex + 1, value.length);
  return {
    integer, decimal
  };
}
