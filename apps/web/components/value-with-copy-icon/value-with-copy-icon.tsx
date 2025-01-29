import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { ReactNode } from 'react';

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
    <div className="flex p-1 px-2 items-center justify-start rounded-xl bg-[rgba(0,0,0,0.7)]">
      <p
        className={`font-semibold ${
          isUnderline ? 'underline' : ''
        } below-1200:max-w-[150px] below-1200:overflow-hidden below-1200:text-ellipsis below-1200:whitespace-nowrap`}
        title={formattedValue || value} // Optional: Shows full text on hover
      >
        {formattedValue || value}
      </p>
      <div
        className="cursor-pointer mr-4 border-primary border-2 ml-6 p-2 rounded-xl hover:scale-110 transition-all duration-100"
        onClick={onCopyClick}
      >
        <Copy />
      </div>
    </div>
  );
};

export default ValueWithCopyIcon;
