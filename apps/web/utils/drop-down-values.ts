import { ISelectValueOption } from '@/common/interfaces';

export const getDropDownValues = (
  initialValueOptions: ISelectValueOption[],
) => {
  return initialValueOptions.map((item: ISelectValueOption) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
};
