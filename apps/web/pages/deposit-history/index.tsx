import { ReactNode } from 'react';
import { useAppSelector } from '@/redux/store';
import { useGetDepositsQuery } from '@/redux/services/deposits.service';
import { AppDataGrid } from '@/components/app-data-grid/app-data-grid';
import { setPage } from '@/redux/features/tax-data-grid-slice';
import { useDispatch } from 'react-redux';
import { columns } from '@/components/deposits/deposits-columns';

const DepositHistoryPage = (): ReactNode => {
  const dispatch = useDispatch();
  const { page, limit } = useAppSelector((state) => state.taxDataGrid);
  const { user } = useAppSelector((store) => store.appState);
  const { data } = useGetDepositsQuery({
    page,
    limit,
    filters: { userId: user?.id },
  });

  const items = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const onPageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Deposit History
      </h1>
      <AppDataGrid
        data={items}
        columns={columns}
        totalItems={totalCount}
        pageSize={limit}
        currentPage={page}
        onPageChange={onPageChange}
        entityName="deposits"
        showColumnsSelect={false}
      />
    </div>
  );
};

export default DepositHistoryPage;
