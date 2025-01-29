import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface IInfoBoxProps {
  title: string;
  value: string;
  icon?: ReactNode;
  secondTitle?: string;
  secondValue?: any;
}

const InfoBox = ({ title, value, icon }: IInfoBoxProps): ReactNode => {
  return (
    <Box
      className={`flex justify-between items-center p-2 rounded-xl bg-[rgba(0,0,0,0.7)] w-[300px]`}
    >
      <Box className="mr-4">
        <p>{title}</p>
        <p className="text-green-500 font-semibold">{value}</p>
      </Box>
      {icon && (
        <Box className="bg-green-500 rounded-2xl p-1 cursor-pointer">
          {icon}
        </Box>
      )}
    </Box>
  );
};

export default InfoBox;
