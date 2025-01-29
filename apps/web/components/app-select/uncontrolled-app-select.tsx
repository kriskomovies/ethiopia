import React from 'react';
import { cn } from '@/lib/utils';
import { ISelectItem } from '@/common/interfaces';

interface IUncontrolledAppSelectProps {
  labelText: string;
  labelId: string;
  name: string;
  hasDefaultNoneElement?: boolean;
  isFullWidth?: boolean;
  dropdownOptions: Array<ISelectItem>;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}

const UncontrolledAppSelect: React.FC<IUncontrolledAppSelectProps> = ({
  labelText,
  labelId,
  name,
  dropdownOptions,
  hasDefaultNoneElement = false,
  isFullWidth = true,
  className = '',
  onChange,
  value,
}) => {
  return (
    <div
      className={cn('flex flex-col', isFullWidth ? 'w-full' : '', className)}
    >
      <label
        htmlFor={labelId}
        className="mb-2 text-sm font-medium dark:text-gray-200 text-white"
      >
        {labelText}
      </label>
      <select
        id={labelId}
        name={name}
        onChange={onChange}
        value={value}
        className="bg-black rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {hasDefaultNoneElement && <option value="_none">None</option>}
        {dropdownOptions.length > 0 ? (
          dropdownOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))
        ) : (
          <option value="_no_options" disabled>
            No options available
          </option>
        )}
      </select>
    </div>
  );
};

export default UncontrolledAppSelect;
