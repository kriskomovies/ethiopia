import {
  GridFilterItem,
  GridLogicOperator,
} from '@mui/x-data-grid/models/gridFilterItem';
import { setFilters } from '../redux/features/tax-data-grid-slice';

const getFilter = (operator: string, value: string, field?: string): any => {
  switch (operator) {
    case 'contains':
      return { [field as string]: { $regex: value, $options: 'i' } };
    case '=':
      return { [field as string]: value };
    default:
      return { $regex: value, $options: 'i' };
  }
};

export const applyFilters = (
  {
    items,
    logicOperator,
  }: {
    items: GridFilterItem[];
    logicOperator: GridLogicOperator;
  },
  dispatch: any,
) => {
  const filters = items.reduce((acc: any, item: GridFilterItem) => {
    const { field, value, operator } = item;
    const filter = getFilter(operator, value, field);
    acc = { ...acc, ...filter };
    return acc;
  }, {});

  dispatch(setFilters(filters));
};
