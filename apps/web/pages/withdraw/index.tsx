import { ReactNode } from 'react';
import InfoBox from '@/components/info-box/info-box';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import { z } from 'zod';
import AppInput from '@/components/app-input/app-input';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { useAppSelector } from '@/redux/store';
import { useGetUserByIdQuery } from '@/redux/services/users.service';
import {
  useGetWithdrawalsQuery,
  useRegisterWithdrawalMutation,
} from '@/redux/services/withdrawals.service';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { transactionStatus } from '@/lib/statusUtils';
import { CircleHelp, TriangleAlert } from 'lucide-react';

const generalWalletRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const WithdrawPage = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAppSelector((store) => store.appState);
  const { data: withdrawals } = useGetWithdrawalsQuery({
    page: 0,
    limit: 10,
    filters: { userId: user?.id, status: transactionStatus.pending },
  });
  const [registerWithdrawal, { isLoading: withdrawIsLoading }] =
    useRegisterWithdrawalMutation({});
  const { data, refetch, isLoading } = useGetUserByIdQuery(
    { id: user?.id },
    { skip: !user?.id },
  );
  if (isLoading) {
    return <div className="mt-6">Loading...</div>;
  }

  const { balance } = data.user;

  const schema = z.object({
    amount: z
      .number()
      .min(20, { message: 'Minimum withdrawal amount is 20 USDC.' })
      .refine((val) => val <= balance, {
        message: 'Amount must be less than or equal to your available balance',
      }),
    wallet: z.string().regex(generalWalletRegex, {
      message: 'Invalid cryptocurrency wallet address',
    }),
  });

  type formValues = z.infer<typeof schema>;

  const defaultValues: formValues = {
    amount: 0,
    wallet: '',
  };

  const onSubmit = (submitValues: any) => {
    onWithdrawClick(submitValues);
  };

  const onHowToWithdrawClick = () => {
    dispatch(
      openAlertDialog({
        title: 'Confirm Withdraw',
        descriptionNode: (
          <div>
            <p>
              To complete the withdrawal process, please follow these
              instructions:
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li className="mb-2 text-start">
                Provide a valid <strong>public key address</strong> to a Solana
                wallet where you wish to withdraw your funds.
              </li>
              <li className="mb-2 text-start">
                Specify the <strong>amount</strong> you wish to withdraw.
              </li>
              <li className="mb-2 text-start">
                Ensure that the provided wallet address is{' '}
                <strong>valid</strong> and that you have access to it. Any
                errors in the wallet address may result in a loss of funds.
              </li>
              <li className="mb-2 text-start">
                Withdrawal requests are processed by our team and typically take{' '}
                <strong>10-30 minutes</strong> to complete. Please be patient
                while we process your request.
              </li>
              <li className="mb-2 text-start">
                For <strong>security reasons</strong>, you may only have{' '}
                <strong>one active withdrawal request at a time</strong>. Once
                the current request is completed, you will be able to submit
                another withdrawal request.
              </li>
            </ol>
            <p className="mt-2">
              <strong>No Tax Fees:</strong> We do not charge any tax or service
              fees for withdrawals. However, please note that a small{' '}
              <strong>Solana blockchain network fee</strong> will be deducted to
              process your transaction.
            </p>
            <p className="mt-2">
              You will receive your funds once your request has been processed.
              If there are any issues, we will respond via email. For further
              assistance, please contact us through the{' '}
              <strong>Customer Support</strong> page on our website.
            </p>
            <p className="mt-2 font-semibold">
              Thank you for your patience and understanding!
            </p>
          </div>
        ),
        onPress: async () => {
          dispatch(closeAlertDialog());
        },
      }),
    );
  };

  const onWithdrawClick = (submitValues: any) => {
    const { amount, wallet } = submitValues;
    dispatch(
      openAlertDialog({
        title: 'Confirm Withdraw',
        descriptionNode: (
          <div>
            <div className="flex items-center">
              <p>Amount:</p>
              <p className="ml-2 text-green-500 font-semibold">{amount} USDC</p>
            </div>
            <div className="flex items-center">
              <p>Network:</p>
              <p className="ml-2 font-semibold">Solana</p>
            </div>
            <div className="flex items-center">
              <p>Wallet address:</p>
              <p className="ml-2 font-semibold">{wallet}</p>
            </div>
            <div className="mt-4">
              <p>Do you wish to continue with this withdraw?</p>
            </div>
            {withdrawIsLoading && <div>Sending...</div>}
          </div>
        ),
        onPress: async () => {
          const res = await registerWithdrawal({
            amount,
            wallet,
            userId: user.id,
          });
          dispatch(closeAlertDialog());

          if (res.error) {
            toast({
              variant: 'destructive',
              title:
                res.error.data.error ||
                'Error submitting withdraw request, please try again!',
            });
            return;
          }
          toast({
            title: 'Withdrawal request is registered.',
            description: `Please wait for your amount to be sent in your provided wallet.`,
          });
          await router.push('/withdraw-requests');
        },
      }),
    );
  };
  const pendingWithdrawals = withdrawals?.items?.length || 0;
  return (
    <div className="mt-6">
      <h1 className="text-3xl">Withdraw</h1>
      <div className="my-6">
        <InfoBox title="Available amount" value={`${balance} USDC`} />
      </div>

      <div className="p-2 font-semibold">
        Pending withdraws: {pendingWithdrawals}
      </div>
      {pendingWithdrawals > 0 && (
        <div className="p-2 font-semibold">
          You can not make new withdraw request because you already have 1
          pending.
        </div>
      )}
      <IntegratedAppForm<formValues>
        defaultValues={defaultValues}
        schema={schema}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 items-center w-full mt-6 md:flex-row lg:flex-row lg:w-[50%]">
          <AppInput
            labelText="Amount"
            labelId="amount"
            name="amount"
            type="number"
            placeholder="Amount..."
            className="bg-[rgba(0,0,0,0.7)] p-2 rounded-lg"
          />
        </div>
        <div className="">
          <div className="gap-4 items-center w-full mt-6 md:flex-row lg:flex-row lg:w-[50%]">
            <AppInput
              labelText="Withdraw wallet:"
              labelId="wallet"
              name="wallet"
              placeholder="Public key..."
              className="bg-[rgba(0,0,0,0.7)] p-2 rounded-lg"
            />
            <div className="flex items-center md:flex-row lg:flex-row lg:w-[100%]">
              <div className="flex text-yellow-500">
                The provided address must be on:
                <div className="font-semibold ml-2 underline">
                  Solana Network
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={pendingWithdrawals > 0}>
          WITHDRAW
        </Button>
      </IntegratedAppForm>
      <Button
        className="my-6"
        variant="secondary"
        onClick={onHowToWithdrawClick}
      >
        <CircleHelp />
        How to withdraw?
      </Button>
      <div className="bg-[rgba(190,81,5,0.7)] px-4 py-2 rounded-xl flex items-start mb-12 lg:w-1/2">
        <div>
          <TriangleAlert size={32} className="mr-2" />
        </div>
        <div>
          <p className="mt-2">
            <strong>No Tax Fees:</strong> We do not charge any tax or service
            fees for withdrawals. However, please note that a small{' '}
            <strong>Solana blockchain network fee</strong> will be deducted to
            process your transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
