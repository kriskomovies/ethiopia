import { useFormContext } from '@/components/app-form/form-context-provider';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import React from 'react';

interface AppCheckboxProps {
  labelText: string;
  labelId: string;
  name: string;
  description?: string;
  isFullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  labelText,
  labelId,
  name,
  description,
  isFullWidth = false,
  className = '',
  disabled = false,
}: AppCheckboxProps) => {
  const { form } = useFormContext();

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4',
            isFullWidth ? 'w-full' : '',
            className,
          )}
        >
          <FormControl>
            <Checkbox
              id={labelId}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor={labelId}>{labelText}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AppCheckbox;
