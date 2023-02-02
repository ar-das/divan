import React, { useRef, useState } from 'react';

import './cost-input.css';

const checkMinMaxValue = (
  min: number,
  max: number,
  isNegative: boolean,
  value: number
) => {
  const computed = isNegative ? value * -1 : value;
  if (computed <= max && computed >= min) return value;
  if (computed < min) return isNegative ? min * -1 : min;
  if (computed > max) return max;

  return value;
};

const checkNegative = (isNegative: boolean, value: string | number) =>
  isNegative ? `-${value}`.toString() : value.toString();

interface InputProps {
  placeholder?: string;
  max: number;
  min: number;
  size?: number;
  initialValue?: number;
  onBlur?: (value: number) => void;
}

export const CostInput: React.FC<InputProps> = ({
  placeholder = 'Плейсхолдер',
  max,
  min,
  initialValue = undefined,
  onBlur,
  size = 4,
  ...rest
}) => {
  const [value, setValue] = useState<number | undefined>(initialValue);

  const inputSize = Math.round(placeholder?.length * 0.5) || size;

  const inputRef = useRef<HTMLInputElement>(null);

  const formatData = () => {
    if (inputRef.current) {
      const isNegative =
        inputRef.current.value.trimStart()[0] === '-' ? true : false;

      const inputValue = inputRef.current.value.replace(/\D/g, '');

      const normalizedValue = checkMinMaxValue(
        min,
        max,
        isNegative,
        parseInt(inputValue)
      );

      if (normalizedValue && inputValue.toString().length > 4) {
        const result = new Intl.NumberFormat('ru-RU').format(normalizedValue);
        inputRef.current.value = checkNegative(isNegative, result);
      } else {
        inputRef.current.value = normalizedValue
          ? checkNegative(isNegative, normalizedValue)
          : inputValue.toString();
      }

      const numbers = parseInt(inputRef.current.value.replace(/(\D)/g, ''));
      const resultNumbers = isNegative ? numbers * -1 : numbers;
      setValue(resultNumbers);
      if (onBlur) onBlur(resultNumbers);
      updateWidth();
    }
  };

  const checkNumbers = () => {
    if (inputRef && inputRef?.current) {
      if (!/^([-0-9+\s])+$/.test(inputRef.current.value)) {
        const isNegative =
          inputRef.current.value.trimStart()[0] === '-' ? true : false;
        const resultNumbers = inputRef.current.value.replace(/(\D)/g, '');
        inputRef.current.value = checkNegative(isNegative, resultNumbers);
      }
    }
  };

  const updateWidth = () => {
    if (inputRef && inputRef?.current && inputRef.current.parentNode) {
      // @ts-ignore
      inputRef.current.parentNode.dataset.value = inputRef.current.value;
    }
  };

  const onChangeHandler = () => {
    checkNumbers();
    updateWidth();
  };

  return (
    <div className={`input-sizer`}>
      <input
        max={max}
        min={min}
        autoComplete={'off'}
        ref={inputRef}
        onInput={updateWidth}
        onBlur={formatData}
        placeholder={placeholder}
        size={inputSize}
        {...rest}
        onChange={onChangeHandler}
        className='input'
        id='input'
      />
      <label
        htmlFor='cost-input'
        className={`input-group__label ${
          value ? 'input-group__label--active' : ''
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};
