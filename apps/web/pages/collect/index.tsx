import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import {
  useGenerateMutation,
  useGetUserByIdQuery,
} from '@/redux/services/users.service';
import { addHours, differenceInHours, format, parseISO } from 'date-fns';
import { CircleHelp, TriangleAlert, Timer } from 'lucide-react';
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
              Collecting your rewards is simple and rewarding! Here's how it
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

  // Add this function to calculate actual daily streak
  const calculateDailyStreak = (earnings: any[]) => {
    if (!earnings?.length) return 0;

    // Sort earnings by date in descending order
    const sortedEarnings = [...earnings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Convert dates to YYYY-MM-DD format for comparison
    const dates = sortedEarnings.map(
      (earning) => new Date(earning.date).toISOString().split('T')[0],
    );

    let streak = 1;
    let currentDate: any = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const prevDate: any = dates[i];

      // Compare dates in YYYY-MM-DD format
      const date1 = new Date(currentDate);
      const date2 = new Date(prevDate);

      const diffTime = date1.getTime() - date2.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="mt-6 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Claim Your Rewards
      </h1>
      <p className="text-gray-400 text-sm md:text-base mb-4">
        Every 24 hours, your wallet accumulates rewards. Click the button below
        to collect your earnings and keep mining!
      </p>

      <div className="my-4 md:my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <InfoBox title="Available amount" value={`${balance} USDC`} />
        {dailyIncome > 0 && (
          <InfoBox
            title="Next mining opportunity"
            value={format(
              addHours(new Date(lastActivity), 24),
              'MMM d, yyyy HH:mm:ss',
            )}
          />
        )}
      </div>

      <div className="relative rounded-xl border-2 border-gray-800 transition-all p-4 md:p-6 backdrop-blur-sm bg-white/5">
        <h2 className="text-lg md:text-xl font-bold mb-4">Mining Progress</h2>
        <p className="text-sm text-gray-400 mb-6">
          Watch your rewards grow in real-time
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Mining Progress</p>
              <p className="text-2xl font-bold">
                {Math.min(100, Math.floor((diffHours / 24) * 100))}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Daily Streak</p>
              <p className="text-2xl font-bold text-yellow-500">
                {calculateDailyStreak(earnings)} Days
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.floor((diffHours / 24) * 100))}%`,
              }}
            />
          </div>

          {isLoading ? (
            <Button disabled className="w-full">
              Processing...
            </Button>
          ) : (
            <Button
              onClick={onMakeMoneyClick}
              disabled={isDisabled}
              className="w-full"
              variant="secondary"
            >
              {isDisabled ? (
                <div className="flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  Come Back Later
                </div>
              ) : (
                `Collect ${dailyIncome} USDC`
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 relative rounded-xl border-2 border-orange-900/50 transition-all p-4 md:p-6 backdrop-blur-sm bg-orange-500/5">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-orange-400 mb-1">
              Collection Rules
            </h3>
            <p className="text-sm text-orange-300/80">
              You can collect rewards only once every 24 hours. Make sure to
              come back daily to maximize your earnings!
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="mt-6 text-sm text-gray-400 hover:text-gray-300"
        onClick={onHowToCollectYourRewardsClick}
      >
        <CircleHelp className="mr-2 h-4 w-4" />
        How to collect rewards?
      </Button>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold">
            Package Earnings History
          </h2>
          <p className="text-sm text-gray-400">
            Total earned:{' '}
            <span className="text-green-500 font-semibold">
              {totalEarnedAmount} USDC
            </span>
          </p>
        </div>

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
  );
};

export default MiningPage;
