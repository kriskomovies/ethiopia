import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppSelector } from '@/redux/store';
import { closeAlertDialog } from '@/redux/features/modal-slice';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AppModal = (): ReactNode => {
  const {
    title,
    onPress = () => {},
    isOpen,
    descriptionNode = <div />,
    showCatalogue,
  } = useAppSelector((state) => state.alertDialog);
  const dispatch = useDispatch();

  const tableData = [
    {
      level: 'Junior',
      price: 20,
      hourlyCommission: 0.0416,
      dailyCommission: 1,
    },
    {
      level: 'Bronze',
      price: 50,
      hourlyCommission: 0.1041,
      dailyCommission: 2.5,
    },
    {
      level: 'Silver',
      price: 100,
      hourlyCommission: 0.2083,
      dailyCommission: 5,
    },
    {
      level: 'Gold',
      price: 200,
      hourlyCommission: 0.4167,
      dailyCommission: 10,
    },
    {
      level: 'Platinum',
      price: 400,
      hourlyCommission: 0.8333,
      dailyCommission: 20,
    },
    {
      level: 'Diamond',
      price: 800,
      hourlyCommission: 1.6667,
      dailyCommission: 40,
    },
    {
      level: 'Elite',
      price: 2000,
      hourlyCommission: 4.1667,
      dailyCommission: 100,
    },
  ];

  const ExampleTable = () => {
    return (
      <div className="overflow-x-auto">
        <Table className="bg-[rgba(0,0,0,0.7)] w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="font-semibold">Price (USDC)</TableHead>
              <TableHead className="font-semibold">
                One Hour Commission (USDC)
              </TableHead>
              <TableHead className="font-semibold">
                One Day Commission (USDC)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} className="font-semibold">
                <TableCell>{row.level}</TableCell>
                <TableCell>{row.price} USDC</TableCell>
                <TableCell>{row.hourlyCommission.toFixed(4)} USDC</TableCell>
                <TableCell>{row.dailyCommission.toFixed(2)} USDC</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  if (showCatalogue) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader className="text-white font-semibold text-2xl">
            Betamine Packages
          </AlertDialogHeader>
          <AlertDialogDescription className="text-white overflow-x-auto">
            <ExampleTable />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onPress}>Continue</AlertDialogAction>
            <AlertDialogCancel onClick={() => dispatch(closeAlertDialog())}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            {descriptionNode}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onPress}>Continue</AlertDialogAction>
          <AlertDialogCancel onClick={() => dispatch(closeAlertDialog())}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppModal;
