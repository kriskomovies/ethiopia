import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ISelectItem } from '@/common/interfaces';
import { useFormContext } from '@/components/app-form/form-context-provider';

interface IAppSelectProps {
  labelText: string;
  labelId: string;
  name: string;
  hasDefaultNoneElement?: boolean;
  isFullWidth?: boolean;
  dropdownOptions: Array<ISelectItem>;
  className?: string;
  onChange?: any;
}

const AppSelect: React.FC<IAppSelectProps> = ({
  labelText,
  labelId,
  name,
  dropdownOptions,
  hasDefaultNoneElement = false,
  isFullWidth = true,
  className = '',
  onChange,
}) => {
  const { form } = useFormContext();

  if (!form) {
    throw new Error('AppSelect must be used within an IntegratedAppForm');
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(isFullWidth ? 'w-full' : '', className)}>
          <FormLabel htmlFor={labelId}>{labelText}</FormLabel>
          <Select
            onValueChange={onChange ? onChange : field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger id={labelId}>
                <SelectValue placeholder={labelText} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-black text-white">
              <SelectGroup>
                {hasDefaultNoneElement && (
                  <SelectItem value="_none">None</SelectItem>
                )}
                {dropdownOptions.length > 0 ? (
                  dropdownOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_no_options" disabled>
                    No options available
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AppSelect;
