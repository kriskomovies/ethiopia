import { ReactNode } from 'react';
import InfoBox from '@/components/info-box/info-box';
import { Button } from '@/components/ui/button';
import { packagesOptions } from '@/components/packages/packages';
import { useGetUserByIdQuery } from '@/redux/services/users.service';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/router';
import { Package } from '@/components/icons/package';
import { Coins } from '@/components/icons/coins';
import { Clock } from '@/components/icons/clock';
import { useDispatch } from 'react-redux';
import { useBuyPackageMutation } from '@/redux/services/packages.service';
import { toast } from '@/hooks/use-toast';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';

const PackagesPage = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAppSelector((store) => store.appState);
  const [buyPackage] = useBuyPackageMutation();
  const { data, refetch, isLoading } = useGetUserByIdQuery(
    { id: user.id },
    { skip: !user?.id },
  );

  if (!data?.user) {
    return <div className="mt-6">Loading....</div>;
  }

  const onAddFundsClick = async () => {
    await router.push('/deposit');
  };

  const balance = data?.user?.balance || 0;
  const packageId = data?.user?.membership?.id;

  const handlePurchase = (id: string, name: string, price: number, dailyIncome: number, isOwned: boolean) => {
    const currentPackagePrice = data?.user?.membership?.price || 0;
    
    // Prevent buying lower packages
    if (price < currentPackagePrice) {
      toast({
        variant: 'destructive',
        title: 'Cannot downgrade package',
        description: 'You cannot purchase a package with lower value than your current one.',
      });
      return;
    }

    if (!isOwned) {
      dispatch(
        openAlertDialog({
          title: 'Confirm buy package',
          descriptionNode: (
            <div>
              Buy package: {name} for {price} USDC
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

  return (
    <div className="mt-6 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Choose Your Package
      </h1>
      <p className="text-gray-400 text-sm md:text-base mb-4">
        Select a package that suits your needs and start earning daily dividends
        based on your choice.
      </p>

      <div className="my-4 md:my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <InfoBox
            title="Your current package"
            value={data?.user?.membership?.name || 'None'}
          />
          <InfoBox title="Balance amount" value={`${balance} USDC`} />
        </div>
        <Button
          onClick={onAddFundsClick}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Deposit funds
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {packagesOptions.map((membership: any) => {
          const { id, name, price, dailyIncome, description } = membership;
          const isRecommended = id === 'pro';
          const isSelected = id === packageId;
          const isOwned = data?.user?.membership?.id === id;

          return (
            <div
              key={`pack-${id}`}
              className={`
                relative rounded-xl border-2 transition-all 
                p-4 md:p-6
                backdrop-blur-sm bg-white/5
                ${isRecommended ? 'border-blue-500' : 'border-gray-800'}
                ${isSelected ? 'border-green-500' : ''}
                hover:border-gray-700
              `}
            >
              {isRecommended && (
                <div className="absolute -top-3 right-4 bg-blue-500/20 text-blue-400 border border-blue-500 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  Recommended
                </div>
              )}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-green-500/20 text-green-400 border border-green-500 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  Selected
                </div>
              )}

              <h3 className="text-lg md:text-xl font-bold mb-2">{name}</h3>
              <p className="text-gray-400 text-xs md:text-sm mb-4">
                {description}
              </p>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex items-center text-gray-200">
                  <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="font-semibold text-xl md:text-2xl">
                    {price} USDC
                  </span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Coins className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base">
                    Daily Income: {dailyIncome} USDC
                  </span>
                </div>

                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base">
                    Rewards credited every 24 hours
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(id, name, price, dailyIncome, isOwned)}
                disabled={isSelected || balance < price || price < (data?.user?.membership?.price || 0)}
                variant={isSelected ? ('success' as any) : 'secondary'}
                className="w-full text-sm md:text-base"
              >
                {isSelected 
                  ? 'Current Package' 
                  : price < (data?.user?.membership?.price || 0)
                    ? 'Cannot Downgrade'
                    : 'Choose Package'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesPage;
