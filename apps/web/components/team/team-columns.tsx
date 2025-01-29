import { ColumnDef } from '@tanstack/react-table';
import { getTextColorBasedOnStatus } from '@/utils/common';

export const teamColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'username',
    header: 'Username',
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
    accessorKey: 'earnings',
    header: 'Earnings from member',
    cell: ({ row }) => {
      const amount = row.original.firstPackagePrice;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount * 0.1);

      return formatted;
    },
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return formatted;
    },
  },
];
