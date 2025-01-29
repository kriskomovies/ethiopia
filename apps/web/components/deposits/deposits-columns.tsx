import { Button } from '@/components/ui/button';
import { ArrowUpDown, Copy } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { getTextColorBasedOnStatus } from '@/utils/common';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'transactionId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { toast } = useToast();
      const text = (row.getValue('transactionId') as string)?.slice(0, 20);

      const onCopyClick = async () => {
        await navigator.clipboard.writeText(row.getValue('transactionId'));
        toast({
          variant: 'default',
          title: 'Transaction Id copied to clipboard',
        });
      };

      return (
        <div className="flex items-center">
          <p>{`${text}...`}</p>
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
