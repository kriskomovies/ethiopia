import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from '@/components/icons/copy';
import { useGetUserByIdQuery } from '@/redux/services/users.service';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { useConnection } from '@solana/wallet-adapter-react';
import { useGetDepositsQuery, useDepositTransactionMutation } from '@/redux/services/deposits.service';
import { getTransferDetailsBySignature } from '@/utils/web3-utils';
import { z } from 'zod';

const schema = z.object({
  transactionId: z
    .string()
    .min(64, { message: 'Transaction ID must be at least 64 characters long' })
    .max(88, { message: 'Transaction ID must be at most 88 characters long' })
    .regex(/^[1-9A-HJ-NP-Za-km-z]{43,88}$/, {
      message: 'Invalid transaction ID format',
    }),
});

const DepositPage = (): ReactNode => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();
  const { user } = useAppSelector((store) => store.appState);
  const [depositTransaction] = useDepositTransactionMutation();
  const { data: userDeposits, refetch } = useGetDepositsQuery({
    filters: { userId: user?.id },
    page: 0,
    limit: 0,
  });
  const { data } = useGetUserByIdQuery({ id: user.id }, { skip: !user?.id });
  const [transactionId, setTransactionId] = useState('');

  if (!data?.user) {
    return <div className="mt-6">Loading....</div>;
  }

  const depositWallet = user?.walletPublicKey;

  const handleCopy = () => {
    navigator.clipboard.writeText(depositWallet);
  };

  const handleValidateDeposit = async () => {
    if (!transactionId) return;
    
    try {
      if (!schema.parse({ transactionId })) return;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid transaction ID format',
      });
      return;
    }

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

  return (
    <div className="mt-6 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Deposit</h1>

      <div className="relative rounded-xl border-2 border-gray-800 transition-all p-4 md:p-6 backdrop-blur-sm bg-white/5">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Your Deposit wallet
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-full">
            <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-800 bg-black/20">
              <span className="text-sm text-gray-300 break-all">
                {depositWallet}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-gray-400 hover:text-gray-300"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${depositWallet}`}
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 relative rounded-xl border-2 border-orange-900/50 transition-all p-4 md:p-6 backdrop-blur-sm bg-orange-500/5">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-orange-400 mb-1">
              SEND ONLY USDC
            </h3>
            <p className="text-sm text-orange-300/80">
              In order to receive your funds upon successful deposit, please
              provide us with the transaction id (signature), so we can charge
              the funds to your account via "Confirm Deposit" button.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 relative rounded-xl border-2 border-gray-800 transition-all p-4 md:p-6 backdrop-blur-sm bg-white/5">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Confirm Transaction
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Id
            </label>
            <Input
              type="text"
              placeholder="Transaction Id..."
              className="bg-transparent border-gray-700 focus:border-blue-500"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleValidateDeposit}
            disabled={!transactionId || isLoading}
          >
            {isLoading ? 'Validating...' : 'Confirm transaction'}
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="mt-6 text-sm text-gray-400 hover:text-gray-300"
        onClick={handleHowToFindTxClick}
      >
        How to deposit?
      </Button>
    </div>
  );
};

export default DepositPage;
