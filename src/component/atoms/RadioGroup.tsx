import React, {createContext, ReactElement} from 'react';

export interface RadioGroupProps<T extends string = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  children: ReactElement[];
}

export default function RadioGroup<T extends string = string>({name, value, onChange, children}: RadioGroupProps<T>) {
  
  return (
      <RadioGroupContext.Provider value={{name, onChange, value}}>
        {children}
      </RadioGroupContext.Provider>
  );
};

export const RadioGroupContext = createContext<RadioGroupContextValue>(undefined as any);
export type RadioGroupContextValue = Omit<RadioGroupProps<any>, 'children'>;
