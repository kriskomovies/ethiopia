import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import {
  useGenerateMutation,
  useGetUserByIdQuery,
} from '@/redux/services/users.service';
import { addHours, differenceInHours, format, parseISO } from 'date-fns';
import { CircleHelp, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from '@/hooks/use-toast';
import InfoBox from '@/components/info-box/info-box';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { useDispatch } from 'react-redux';
import { AppDataGrid } from '@/components/app-data-grid/app-data-grid';
import { packageEarningsColumns } from '@/components/package-earnings/package-earnings';
import { setPage } from '@/redux/features/tax-data-grid-slice';

const MiningPage = (): ReactNode => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((store) => store.appState);
  const { data, refetch } = useGetUserByIdQuery(
    { id: user?.id },
    { skip: !user?.id },
  );
  const { page, limit } = useAppSelector((state) => state.taxDataGrid);

  const [generateMoney] = useGenerateMutation();

  if (!data?.user) {
    return <div className="mt-6">Loading....</div>;
  }

  const currentUser = data.user;
  const { lastActivity, status, earnings, balance } = currentUser;

  if (status === 'INACTIVE') {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col justify-center items-center">
          <div className="w-full h-full flex flex-1 justify-center items-center">
            <div className="bg-[rgba(190,81,5,0.7)] px-4 py-2 rounded-xl flex items-center">
              <div>
                <TriangleAlert size={32} className="mr-4" />
              </div>
              You need to activate a package in order to start receiving
              rewards.
            </div>
          </div>
          <Button className="mt-4" onClick={() => router.push('/packages')}>
            See packages
          </Button>
        </div>
      </div>
    );
  }

  const lastActivityDate = parseISO(lastActivity);
  const currentDate = new Date();
  const diffHours = differenceInHours(currentDate, lastActivityDate);
  const isDisabled = diffHours < 24;
  const dailyIncome = data?.user?.membership?.dailyIncome || 0;
  const totalEarnedAmount = data?.user.earnings.reduce(
    (acc: any, cur: any) => acc + cur.amount,
    0,
  );

  const onPageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const onHowToCollectYourRewardsClick = () => {
    dispatch(
      openAlertDialog({
        title: 'How to Collect Your Rewards?',
        descriptionNode: (
          <div>
            <p>
              Collecting your rewards is simple and rewarding! Here’s how it
              works:
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li className="mb-2 text-start">
                You can collect your rewards by clicking the{' '}
                <strong>Collect Reward</strong> button once every{' '}
                <strong>24 hours</strong>.
              </li>
              <li className="mb-2 text-start">
                The amount of your reward is based on the{' '}
                <strong>active package</strong> you have on your account.
              </li>
              <li className="mb-2 text-start">
                Once you click the <strong>Collect Reward</strong> button, the
                earned funds will be immediately added to your account balance.
              </li>
              <li className="mb-2 text-start">
                This action can only be performed{' '}
                <strong>once every 24 hours</strong>, so make sure to come back
                daily to collect your rewards.
              </li>
              <li className="mb-2 text-start">
                You can collect rewards again after:{' '}
                <strong>
                  {format(
                    addHours(new Date(lastActivity), 24),
                    'MMM d, yyyy HH:mm:ss',
                  )}
                </strong>
              </li>
            </ol>
            <p className="mt-4">
              Remember to collect your rewards every day to maximize your
              earnings!
            </p>
          </div>
        ),
        onPress: async () => {
          dispatch(closeAlertDialog());
        },
      }),
    );
  };

  const onMakeMoneyClick = async () => {
    setIsLoading(true);
    const res = await generateMoney(currentUser);

    if (res.error) {
      toast({
        variant: 'destructive',
        title: res.error.data.error,
      });
      setIsLoading(false);
      return;
    }
    toast({
      variant: 'default',
      title: `Successfully collected ${dailyIncome} USDC.`,
    });
    setIsLoading(false);

    refetch();
  };

  return (
    <div className="flex flex-col h-screen justify-start">
      <div>
        <div className="w-full flex gap-2 flex-col sm:flex-row sm:px-0 py-4">
          {dailyIncome > 0 && (
            <InfoBox
              title="Ability to generate more USDC"
              value={format(
                addHours(new Date(lastActivity), 24),
                'MMM d, yyyy HH:mm:ss',
              )}
            />
          )}
          <InfoBox title="Balance" value={`${balance} USDC`} />
        </div>
        <Button
          className="flex cursor-pointer mb-4"
          onClick={onHowToCollectYourRewardsClick}
          variant="secondary"
        >
          <CircleHelp />
          <p className="ml-2">How to collect rewards?</p>
        </Button>
        <div className="w-full flex flex-1 justify-start items-center">
          <div className="bg-[rgba(190,81,5,0.7)] px-4 py-2 rounded-xl flex items-center">
            <div>
              <TriangleAlert size={32} className="mr-4" />
            </div>
            <div>
              <p>You can collect rewards only once every 24 hours.</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-start justify-start mt-6">
          <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-[rgba(0,0,0,0.7)]">
            <h1 className="text-2xl font-semibold mb-6 text-center text-primary">
              Collect rewards
            </h1>
            <div className="space-y-4">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Button
                  onClick={onMakeMoneyClick}
                  disabled={isDisabled}
                  className="w-full"
                >
                  Collect daily rewards {dailyIncome} USDC
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-3xl">
            Package Earnings ({earnings.length || 0})
          </h1>
          <h2 className="text-2xl">
            Total earned amount:{' '}
            <span className="font-semibold underline text-green-500">
              {totalEarnedAmount} USDC
            </span>
          </h2>
          <AppDataGrid
            data={earnings}
            columns={packageEarningsColumns}
            totalItems={earnings.length || 0}
            pageSize={limit}
            currentPage={page}
            onPageChange={onPageChange}
            entityName="Package earnings"
            showColumnsSelect={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MiningPage;
