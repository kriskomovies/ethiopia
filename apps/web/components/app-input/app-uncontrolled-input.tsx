import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface IAppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  labelId: string;
  isFullWidth?: boolean;
  className?: string;
}

const AppUncontrolledInput: React.FC<IAppInputProps> = ({
  labelText,
  labelId,
  isFullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col', isFullWidth ? 'w-full' : '', className)}
    >
      <label
        htmlFor={labelId}
        className="text-sm font-medium text-gray-700 mb-1"
      >
        {labelText}
      </label>
      <Input id={labelId} {...props} />
    </div>
  );
};

export default AppUncontrolledInput;
