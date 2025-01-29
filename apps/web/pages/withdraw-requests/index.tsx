import { ReactNode, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useGetWithdrawalsQuery } from '@/redux/services/withdrawals.service';
import { setFilters, setPage } from '@/redux/features/tax-data-grid-slice';
import { AppDataGrid } from '@/components/app-data-grid/app-data-grid';
import { useDispatch } from 'react-redux';
import { columns } from '@/components/withdrawals/withdrawals-columns';
import UncontrolledAppSelect from '@/components/app-select/uncontrolled-app-select';

const WithdrawalsPage = (): ReactNode => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((store) => store.appState);
  const { page, limit, filters } = useAppSelector((state) => state.taxDataGrid);
  const [status, setStatus] = useState<string>('');
  const { data, isLoading } = useGetWithdrawalsQuery({
    page,
    limit,
    filters: { userId: user.id, ...filters },
  });

  const items = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const onPageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    dispatch(setFilters({ ...filters, status: newStatus }));
    dispatch(setPage(0));
  };

  if (isLoading) {
    return <div className="mt-6">Loading...</div>;
  }

  return (
    <div className="mt-6">
      <h1 className="text-3xl">Withdrawal Requests</h1>
      <div className="flex gap-4 my-4 items-center">
        <UncontrolledAppSelect
          dropdownOptions={[
            { label: 'All', value: '' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' },
          ]}
          name="status"
          labelId="status"
          labelText="Status"
          className="w-[200px]"
          value={status}
          onChange={handleStatusChange}
        />
      </div>
      <AppDataGrid
        data={items}
        columns={columns}
        totalItems={totalCount}
        pageSize={limit}
        currentPage={page}
        onPageChange={onPageChange}
        entityName="withdrawals"
        showColumnsSelect={false}
      />
    </div>
  );
};

export default WithdrawalsPage;
