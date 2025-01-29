import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import InfoBox from '@/components/info-box/info-box';
import { AppDataGrid } from '@/components/app-data-grid/app-data-grid';
import { teamColumns } from '@/components/team/team-columns';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import {
  useGetUserByIdQuery,
  useGetUserMembersQuery,
} from '@/redux/services/users.service';
import { addHours, format } from 'date-fns';
import { setPage } from '@/redux/features/tax-data-grid-slice';
import { useDispatch } from 'react-redux';
import { useGetTotalWithdrawalsQuery } from '@/redux/services/withdrawals.service';
import { packageEarningsColumns } from '@/components/package-earnings/package-earnings';

const Dashboard = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAppSelector((store) => store.appState);
  const { page, limit } = useAppSelector((state) => state.taxDataGrid);
  const { data: withdrawalData } = useGetTotalWithdrawalsQuery(
    { userId: user?.id },
    { skip: !user?.id },
  );
  const { data, refetch, isLoading } = useGetUserByIdQuery(
    { id: user.id },
    { skip: !user?.id },
  );

  const { data: membersData } = useGetUserMembersQuery(
    { id: user.id },
    { skip: !user.id },
  );

  if (!data?.user) {
    return <div className="mt-6">Loading....</div>;
  }

  const onPageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const currentUser = data.user;
  const members = membersData?.members || [];
  const paginatedMembers = members.slice(page * limit, (page + 1) * limit);

  const { lastActivity, balance, membership, earnings } = currentUser;

  return (
    <>
      <div className="mb-6 mt-6">
        <h1 className="text-3xl">Investment</h1>
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2">
          <InfoBox
            title="Active package"
            value={membership.name ? membership.name : 'No active package'}
          />
          <InfoBox title="Balance" value={`${balance} USDC`} />
          <InfoBox
            title="Total withdrawals amount"
            value={`${withdrawalData?.totalAmount || 0} USDC`}
          />
          <InfoBox
            title="Daily income"
            value={
              membership.dailyIncome
                ? `${membership.dailyIncome} USDC`
                : 'No active package'
            }
          />
          {membership.dailyIncome && (
            <InfoBox
              title="Ability to generate more USDC"
              value={format(
                addHours(new Date(lastActivity), 24),
                'MMM d, yyyy HH:mm:ss',
              )}
            />
          )}
        </div>
      </div>
      <div>
        <h1 className="text-3xl">Team ({members.length || 0})</h1>
        <AppDataGrid
          data={paginatedMembers.slice(0, 5)}
          columns={teamColumns}
          totalItems={members.length}
          pageSize={5}
          currentPage={page}
          onPageChange={onPageChange}
          entityName="transactions"
          showPagination={false}
          showColumnsSelect={false}
        />
        <div className="w-full flex justify-center items-center my-4">
          <Button variant="default" onClick={() => router.push('/team')}>
            View all
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-3xl">Package Earnings ({earnings.length || 0})</h1>
        <AppDataGrid
          data={earnings.slice(0, 5)}
          columns={packageEarningsColumns}
          totalItems={earnings.length || 0}
          pageSize={5}
          currentPage={page}
          onPageChange={onPageChange}
          entityName="Package earnings"
          showPagination={false}
          showColumnsSelect={false}
        />
        <div className="w-full flex justify-center items-center my-4">
          <Button variant="default" onClick={() => router.push('/collect')}>
            View all
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
