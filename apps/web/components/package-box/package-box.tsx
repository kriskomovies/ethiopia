import { ReactNode, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import { Button } from '@/components/ui/button';
import { useBuyPackageMutation } from '@/redux/services/packages.service';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IPackageBoxProps {
  id: number;
  name: string;
  price: number;
  dailyIncome: number;
  packageId: number | null;
  balance: number;
  user: any;
  refetch: any;
}

const PackageBox = ({
  id,
  name,
  price,
  dailyIncome,
  packageId,
  balance,
  user,
  refetch,
}: IPackageBoxProps): ReactNode => {
  const dispatch = useDispatch();
  const [buyPackage] = useBuyPackageMutation();
  const isOwned = useMemo(() => id === packageId, [id, packageId]);
  const isBuyButtonDisabled =
    isOwned || price > balance || user.membership.price > price;

  const isLesserPackage = dailyIncome < user.membership.dailyIncome;
  const moneyRequiredToBuyPackage = price - user.balance;
  const onClick = () => {
    if (!isOwned) {
      dispatch(
        openAlertDialog({
          title: 'Confirm buy package',
          descriptionNode: (
            <div>
              Buy package: {name} for {price}
            </div>
          ),
          onPress: async () => {
            const res = await buyPackage({
              userId: user.id,
              membership: {
                id,
                name,
                price,
                dailyIncome,
              },
            });
            dispatch(closeAlertDialog());
            if (res.error) {
              toast({
                variant: 'destructive',
                title: res.error.data.error,
              });
            } else {
              await refetch();
              toast({
                variant: 'default',
                title: `Package ${name} successfully purchased`,
              });
            }
          },
        }),
      );
    }
  };

  const borderColor = isOwned
    ? 'border-green-500'
    : isLesserPackage
      ? 'border-gray-500'
      : 'border-primary';
  const buttonColor = isOwned
    ? 'bg-green-500'
    : isLesserPackage
      ? 'bg-gray-500'
      : 'bg-primary';

  return (
    <div className="flex items-center my-6 group cursor-pointer flex-col sm:flex-row md:flex-row max-w-md">
      <div
        className={`${borderColor} flex-grow flex items-start py-4 px-4 bg-[rgba(0,0,0,0.7)] border-l-4 md:flex-col sm:flex-col transition-all duration-100 w-full sm:w-auto`}
      >
        <div className="flex flex-col w-full">
          <p className="font-semibold">{name}</p>
          <div className="mt-2">
            <div className="flex">
              <p>Price:</p>
              <p className="font-semibold ml-2">{price} USDC</p>
            </div>
            <div className="flex">
              <p>Daily income:</p>
              {dailyIncome ? (
                <p className="font-semibold ml-2">{dailyIncome} USDC</p>
              ) : (
                <Button>Buy package</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={onClick}
              variant={isOwned ? 'secondary' : 'default'}
              className={`ml-2 mt-2 ${buttonColor}`}
              disabled={isBuyButtonDisabled}
            >
              {isOwned ? 'Owned' : 'Buy'}
            </Button>
          </TooltipTrigger>
          {moneyRequiredToBuyPackage > 0 && !isOwned && !isLesserPackage && (
            <TooltipContent>
              Requires {moneyRequiredToBuyPackage}$ more to buy this package.
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PackageBox;
