import { ReactNode, useEffect, useState } from 'react';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import AppInput from '@/components/app-input/app-input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useAppSelector } from '@/redux/store';
import {
  useDepositTransactionMutation,
  useGetDepositsQuery,
} from '@/redux/services/deposits.service';
import { CircleHelp, TriangleAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ValueWithCopyIcon from '@/components/value-with-copy-icon/value-with-copy-icon';
import { toast } from '@/hooks/use-toast';
import { getTransferDetailsBySignature } from '@/utils/web3-utils';
import { useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { truncateWallet } from '@/utils/common';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { useDispatch } from 'react-redux';

const schema = z.object({
  transactionId: z
    .string()
    .min(64, { message: 'Transaction ID must be at least 64 characters long' })
    .max(88, { message: 'Transaction ID must be at most 88 characters long' })
    .regex(/^[1-9A-HJ-NP-Za-km-z]{43,88}$/, {
      message: 'Invalid transaction ID format',
    }),
  network: z.string(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  transactionId: '',
  network: '',
};

const DepositPage = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();
  const { user } = useAppSelector((store) => store.appState);
  const [depositTransaction] = useDepositTransactionMutation();
  const { data: userDeposits, refetch } = useGetDepositsQuery({
    filters: { userId: user?.id },
    page: 0,
    limit: 0,
  });

  const [formattedWallet, setFormattedWallet] = useState(user?.walletPublicKey);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 320) {
        setFormattedWallet(truncateWallet(user?.walletPublicKey || '', 6));
      } else if (window.innerWidth < 440) {
        setFormattedWallet(truncateWallet(user?.walletPublicKey || '', 8));
      } else if (window.innerWidth < 880) {
        setFormattedWallet(truncateWallet(user?.walletPublicKey || '', 16));
      } else {
        setFormattedWallet(user?.walletPublicKey);
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [user?.walletPublicKey]);

  const handleHowToFindTxClick = () => {
    dispatch(
      openAlertDialog({
        title: 'How to Deposit',
        descriptionNode: (
          <div>
            <p>
              To complete the process, please follow the steps below to find
              your transaction ID (signature):
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li className="mb-2 text-start">
                Visit the transaction history for your wallet by going to{' '}
                <a
                  href={`https://solscan.io/account/${user.walletPublicKey}#transfers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  your wallet address
                </a>
                .
              </li>
              <li className="mb-2 text-start">
                Look for the transaction you just made. Note that it may take
                1-5 minutes for the transaction to appear and be approved on the
                blockchain.
              </li>
              <li className="mb-2 text-start">
                Once the transaction is visible, copy its{' '}
                <strong>signature (transaction ID)</strong>.
              </li>
              <li className="mb-2 text-start">
                <strong>Only USDC is accepted!</strong>.
              </li>
            </ol>
            <p className="mt-2">
              After copying the transaction ID, enter it in the input field
              below to validate your deposit. Please be patient while the
              blockchain processes your transaction.
            </p>
          </div>
        ),
        onPress: async () => {
          dispatch(closeAlertDialog());
        },
      }),
    );
  };

  const handleSubmit = async (submitValues: FormValues) => {
    const { transactionId } = submitValues;

    setIsLoading(true);
    const existingDeposit = userDeposits?.items.find(
      (d: any) => d.transactionId === transactionId,
    );

    if (existingDeposit) {
      toast({
        variant: 'destructive',
        title: 'The transaction is already registered!',
        description:
          'The requested transaction is received and funded to your account!',
      });
      setIsLoading(false);
      return;
    }

    const transaction = await getTransferDetailsBySignature(
      connection,
      transactionId,
    );

    if (!transaction) {
      toast({
        variant: 'destructive',
        title: 'Transaction not found!',
        description: 'No such transaction was found!',
      });
      setIsLoading(false);
      return;
    }

    if (transaction[0]?.receiver !== user.walletPublicKey) {
      toast({
        variant: 'destructive',
        title: 'Transaction is not received by this wallet!',
        description: 'No such transaction was found in wallet history!',
      });
      setIsLoading(false);
      return;
    }

    const res = await depositTransaction({
      transactionId,
      amount: Math.abs(transaction[0].amount),
      userId: user?.id,
    });

    if (res.error) {
      toast({
        variant: 'destructive',
        title: res.error.data.message,
      });
      setIsLoading(false);
      return;
    }

    refetch();

    toast({
      title: 'Deposit is registered!',
      description: `The funds: ${transaction[0]?.amount} USDC are credited to your account!`,
    });
    await router.push(`/deposit-history`);
    setIsLoading(false);
  };

  return (
    <div className="mt-6">
      <h1 className="text-3xl">Deposit</h1>
      <div className="my-6 w-1/2 max-[1400px]:w-full">
        <IntegratedAppForm<FormValues>
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          schema={schema}
        >
          <p>Your Deposit wallet:</p>
          <div className="max-[1036px]:flex-col">
            <div className="max-[1036px]:mt-4">
              <ValueWithCopyIcon
                value={user?.walletPublicKey}
                formattedValue={formattedWallet}
              />
            </div>
            <QRCodeSVG
              value={user?.walletPublicKey}
              size={220}
              height={220}
              width={220}
              bgColor="#c1c1c1"
            />
          </div>
          <div className="bg-[rgba(190,81,5,0.7)] rounded-xl flex p-2">
            <div>
              <TriangleAlert size={32} className="mr-2 mt-2" />
            </div>
            <div className="max-[490px]:text-sm">
              <p className="mt-2 font-bold mb-2">SEND ONLY USDC</p>
              <p className="mb-2">
                In order to receive your funds upon successful deposit, please
                provide us with the transaction id (signature), so we can charge
                the funds to your account via "Confirm Deposit" button.
              </p>
            </div>
          </div>
          <Button
            className="flex cursor-pointer"
            onClick={handleHowToFindTxClick}
            variant="secondary"
          >
            <CircleHelp />
            <p className="ml-2">How to deposit?</p>
          </Button>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <AppInput
                labelText="Transaction Id"
                labelId="transactionId"
                name="transactionId"
                placeholder="Transaction Id..."
                className="text-gray-400"
              />
              <Button type="submit" className="w-full">
                Confirm transaction
              </Button>
            </>
          )}
        </IntegratedAppForm>
      </div>
    </div>
  );
};

export default DepositPage;
