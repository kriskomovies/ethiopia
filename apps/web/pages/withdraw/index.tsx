import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import InfoBox from '@/components/info-box/info-box';
import { useGetUserByIdQuery } from '@/redux/services/users.service';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import {
  useGetWithdrawalsQuery,
  useRegisterWithdrawalMutation,
} from '@/redux/services/withdrawals.service';
import { transactionStatus } from '@/lib/statusUtils';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import AppInput from '@/components/app-input/app-input';

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
    useRegisterWithdrawalMutation();
  const { data } = useGetUserByIdQuery({ id: user.id }, { skip: !user?.id });

  if (!data?.user) {
    return <div className="mt-6">Loading....</div>;
  }

  const balance = data?.user?.balance || 0;
  const pendingWithdraws = withdrawals?.items?.length || 0;

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

  const handleWithdraw = async (amount: number, wallet: string) => {
    if (!amount || !wallet) return;

    try {
      schema.parse({ amount, wallet });

      dispatch(
        openAlertDialog({
          title: 'Confirm Withdraw',
          descriptionNode: (
            <div>
              <div className="flex items-center">
                <p>Amount:</p>
                <p className="ml-2 text-green-500 font-semibold">
                  {amount} USDC
                </p>
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: error.errors[0].message,
        });
      }
    }
  };

  const handleHowToWithdraw = () => {
    dispatch(
      openAlertDialog({
        title: 'How to Withdraw',
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
          </div>
        ),
        onPress: async () => {
          dispatch(closeAlertDialog());
        },
      }),
    );
  };

  return (
    <div className="mt-6 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Withdraw Funds
      </h1>
      <p className="text-gray-400 text-sm md:text-base mb-4">
        Withdraw your earnings to your external wallet by submitting a request.
        Our team will review and process your withdrawal within 24 hours.
      </p>

      <div className="my-4 md:my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <InfoBox title="Available amount" value={`${balance} USDC`} />
        <InfoBox
          title="Pending withdraws"
          value={pendingWithdraws.toString()}
        />
      </div>

      <div className="relative rounded-xl border-2 border-gray-800 transition-all p-4 md:p-6 backdrop-blur-sm bg-white/5">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Request Withdrawal
        </h2>

        <IntegratedAppForm<formValues>
          defaultValues={defaultValues}
          schema={schema}
          onSubmit={handleWithdraw as any}
        >
          <div className="space-y-4">
            <div>
              <AppInput
                labelText="Amount"
                labelId="amount"
                name="amount"
                type="number"
                placeholder="0"
                className="bg-transparent border-gray-700 focus:border-blue-500"
              />
            </div>

            <div>
              <AppInput
                labelText="Withdraw wallet"
                labelId="wallet"
                name="wallet"
                placeholder="Public key..."
                className="bg-transparent border-gray-700 focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-orange-400 flex items-center">
                <span className="mr-2">⚠️</span>
                The provided address must be on: Solana Network
              </p>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-6"
              disabled={pendingWithdraws > 0}
            >
              WITHDRAW
            </Button>
          </div>
        </IntegratedAppForm>
      </div>

      <div className="mt-6 relative rounded-xl border-2 border-orange-900/50 transition-all p-4 md:p-6 backdrop-blur-sm bg-orange-500/5">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-orange-400 mb-1">No Tax Fees</h3>
            <p className="text-sm text-orange-300/80">
              We do not charge any tax or service fees for withdrawals. However,
              please note that a small{' '}
              <span className="text-orange-400">
                Solana blockchain network fee
              </span>{' '}
              will be deducted to process your transaction.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="mt-6 text-sm text-gray-400 hover:text-gray-300"
        onClick={handleHowToWithdraw}
      >
        How to withdraw?
      </Button>
    </div>
  );
};

export default WithdrawPage;
