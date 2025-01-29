import { Copy } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { getTextColorBasedOnStatus } from '@/utils/common';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'wallet',
    header: 'Wallet',
    cell: ({ row }) => {
      const { toast } = useToast();
      const text = row.getValue('wallet') as string;

      const onCopyClick = async () => {
        await navigator.clipboard.writeText(text);
        toast({
          variant: 'default',
          title: 'Wallet address copied to clipboard',
        });
      };

      return (
        <div className="flex items-center">
          <p>{`${text.slice(0, 12)}...`}</p>
          <div className="bg-primary ml-4 p-1 rounded-lg cursor-pointer hover:scale-110 transition-200">
            <Copy size={18} color="black" onClick={onCopyClick} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const textColor = getTextColorBasedOnStatus(row.original.status);
      return (
        <div className={`${textColor} uppercase font-semibold`}>
          {row.original.status}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return date.toLocaleString();
    },
  },
];
