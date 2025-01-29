import { ReactNode } from 'react';
import InfoBox from '@/components/info-box/info-box';
import { ArrowUpWideNarrow, Wallet } from 'lucide-react';
import { AppDataGrid } from '@/components/app-data-grid/app-data-grid';
import { transactionsColumns } from '@/components/transactions/transactions-columns';
import AppSelect from '@/components/app-select/app-select';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import { z } from 'zod';
import { ISelectItem, ISelectValueOption } from '@/common/interfaces';

const mock_transactions_data = [
  {
    transactionId:
      '0xd7ad612dd39f9d16deeef274dc88402a507389ffaf44c29e7c48d1d2894f3535',
    amount: 30,
    status: 'Approved',
    createdAt: Date.now(),
    type: 'Daily dividend (Package 1)',
  },
  {
    transactionId:
      '0xd7ad612dd39f9d16deeef274dc88402a507389ffaf44c29e7c48d1d2894f3535',
    amount: 30,
    status: 'Approved',
    createdAt: Date.now(),
    type: 'Deposit',
  },
  {
    transactionId:
      '0xd7ad612dd39f9d16deeef274dc88402a507389ffaf44c29e7c48d1d2894f3535',
    amount: 30,
    status: 'Approved',
    createdAt: Date.now(),
    type: 'Bought Package 1',
  },
  {
    transactionId:
      '0xd7ad612dd39f9d16deeef274dc88402a507389ffaf44c29e7c48d1d2894f3535',
    amount: 30,
    status: 'Approved',
    createdAt: Date.now(),
    type: 'Withdrawal',
  },
  {
    transactionId:
      '0xd7ad612dd39f9d16deeef274dc88402a507389ffaf44c29e7c48d1d2894f3535',
    amount: 30,
    status: 'Approved',
    createdAt: Date.now(),
    type: 'Referral bonus (user email address)',
  },
];

const schema = z.object({});

const defaultValues = {
  status: 'All',
  type: 'All',
};

const Payments = (): ReactNode => {
  const statusOpts: ISelectItem[] = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
  ];
  const typeOpts = [
    { value: 'daily-dividend', label: 'Daily Dividend' },
    { value: 'referral-bonus', label: 'Referral Bonus' },
    { value: 'buy', label: 'Buy' },
    { value: 'withdraw', label: 'Withdraw' },
    { value: 'deposit', label: 'Deposit' },
  ];

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-3xl">Payments</h1>
        <div className="my-4 flex gap-4 max-[545px]:flex-col">
          <InfoBox
            title="Active package"
            value="Package lv2"
            icon={
              <ArrowUpWideNarrow
                color="black"
                size={30}
                className="group-hover:text-green-500"
              />
            }
          />
          <InfoBox
            title="Daily income"
            value="75 USDT"
            secondTitle="Next devident in"
            secondValue="12h, 15min"
          />
        </div>
      </div>
      <IntegratedAppForm
        defaultValues={defaultValues}
        schema={schema}
        onSubmit={() => {}}
      >
        <div className="flex gap-4 w-[60%] items-center my-6 max-[1050px]:w-[100%] max-[545px]:flex-col">
          <AppSelect
            dropdownOptions={statusOpts}
            name="status"
            labelId="status"
            labelText="Status"
            className="bg-[rgba(0,0,0,0.7)] p-2 rounded-lg"
          />
          <AppSelect
            dropdownOptions={typeOpts}
            name="type"
            labelId="type"
            labelText="Type"
            className="bg-[rgba(0,0,0,0.7)] p-2 rounded-lg"
          />
        </div>
      </IntegratedAppForm>
      <div>
        <AppDataGrid
          data={mock_transactions_data}
          columns={transactionsColumns}
          totalItems={5}
          pageSize={5}
          currentPage={1}
          onPageChange={() => {}}
          entityName="transactions"
        />
      </div>
    </div>
  );
};

export default Payments;
