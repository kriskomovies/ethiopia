import { cn } from '@/lib/utils';
import {
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  values: any;
  setFieldValue: any;
  name: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, values, setFieldValue, name, ...props }, ref) => {
    const [value, setValue] = useState('');

    useEffect(() => {
      //initialValues
      setValue(values[name]);
    }, [values[name]]);

    const debouncedChange = useRef(
      debounce((value: string) => {
        setFieldValue(name, value);
      }, 300),
    ).current;

    useEffect(() => {
      return () => {
        debouncedChange.cancel();
      };
    }, [debouncedChange]);

    const handleLocalChange = (event: any) => {
      const { value } = event.target;
      setValue(value);
      debouncedChange(value);
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-primary bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          ref={ref}
          value={value}
          onChange={handleLocalChange}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
