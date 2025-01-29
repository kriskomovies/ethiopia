import { ReactNode } from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IValueWithCopyIconProps {
  value: string;
  formattedValue?: string;
  isUnderline?: boolean;
}

const ValueWithCopyIcon = ({
  value,
  formattedValue,
  isUnderline = false,
}: IValueWithCopyIconProps): ReactNode => {
  const { toast } = useToast();

  const onCopyClick = async () => {
    await navigator.clipboard.writeText(value);
    toast({
      variant: 'default',
      title: 'Value copied to clipboard',
    });
  };

  return (
    <div className="flex p-1 px-2 items-center justify-start rounded-xl bg-[rgba(0,0,0,0.7)] mb-4">
      <div
        className="cursor-pointer mr-4 bg-primary p-2 rounded-xl hover:scale-110 transition-all duration-100"
        onClick={onCopyClick}
      >
        <Copy />
      </div>
      <p
        className={`${isUnderline && 'underline'} font-semibold max-[490px]:text-sm`}
      >
        {formattedValue || value}
      </p>
    </div>
  );
};

export default ValueWithCopyIcon;
