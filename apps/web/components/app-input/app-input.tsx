import React from 'react';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from '@/components/app-form/form-context-provider';
import dayjs from 'dayjs';

interface IAppInputProps {
  labelText: string;
  labelId: string;
  name: string;
  type?: string;
  placeholder?: string;
  isFullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

const AppInput: React.FC<IAppInputProps> = ({
  labelText,
  labelId,
  name,
  type = 'text',
  placeholder = '',
  isFullWidth = true,
  className = '',
  disabled = false,
}) => {
  const { form } = useFormContext();

  if (!form) {
    throw new Error('AppInput must be used within an IntegratedAppForm');
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(isFullWidth ? 'w-full' : '', className)}>
          <FormLabel htmlFor={labelId}>{labelText}</FormLabel>
          <FormControl>
            <Input
              id={labelId}
              type={type}
              placeholder={placeholder}
              {...field}
              value={
                type === 'date' && field.value
                  ? dayjs(field.value).format('YYYY-MM-DD')
                  : field.value
              }
              onChange={(e) => {
                let value: string | number | Date = e.target.value;
                if (type === 'number') {
                  value = parseFloat(value);
                } else if (type === 'date') {
                  value = dayjs(value).toDate();
                }
                field.onChange(value);
              }}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AppInput;
