import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface IFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
}

const Field = <T extends FieldValues>({ control, name, label, placeholder, type = 'text' }: IFormFieldProps<T>) => {
  return (
    <Controller name={name} control={control} render={({ field }) => (
      <FormItem>
        <FormLabel className='label'>{label}</FormLabel>
        <FormControl>
          <Input className="input" placeholder={placeholder} type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}>
    </Controller>
  )
}

export default Field;
