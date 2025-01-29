import { ColumnDef } from '@tanstack/react-table';

export const packageEarningsColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const { amount } = row.original;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return date.toLocaleString();
    },
  },
];
