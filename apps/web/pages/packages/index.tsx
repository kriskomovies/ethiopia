import { ReactNode } from 'react';
import InfoBox from '@/components/info-box/info-box';
import { Button } from '@/components/ui/button';
import { packagesOptions } from '@/components/packages/packages';
import { useGetUserByIdQuery } from '@/redux/services/users.service';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/router';
import { Package, CircleDollarSign, Clock } from 'lucide-react';

const PackagesPage = (): ReactNode => {
  const router = useRouter();
  const { user } = useAppSelector((store) => store.appState);
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

  return (
    <div className="mt-6">
      <h1 className="text-3xl mb-6">Packages</h1>
      <div className="mb-8 flex items-center gap-4">
        <InfoBox title="Balance amount" value={`${balance} USDC`} />
        <Button onClick={onAddFundsClick}>Deposit funds</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesOptions.map((membership: any) => {
          const { id, name, price, dailyIncome } = membership;
          const isRecommended = id === 2; // Pro package
          
          return (
            <div 
              key={`pack-${id}`}
              className={`relative p-6 rounded-xl border bg-black/40 backdrop-blur-sm transition-all hover:border-white/20
                ${isRecommended ? 'border-blue-500/50' : 'border-white/10'}`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-3 rounded-full ${isRecommended ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                  <Package className={`w-6 h-6 ${isRecommended ? 'text-blue-400' : 'text-white/80'}`} />
                </div>

                <h3 className="text-xl font-medium text-white">{name}</h3>
                <p className="text-sm text-gray-400">
                  {id === 1 && 'Perfect for beginners to start earning daily rewards.'}
                  {id === 2 && 'For intermediate users looking to maximize daily rewards.'}
                  {id === 3 && 'Advanced package for serious investors.'}
                </p>

                <div className="text-3xl font-semibold text-white">${price}</div>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <CircleDollarSign className="w-4 h-4" />
                    Earn {dailyIncome}% Daily
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    Rewards credited every 24 hours
                  </div>
                </div>

                <Button 
                  className="w-full"
                  variant={isRecommended ? "default" : "secondary"}
                  disabled={balance < price || packageId === id}
                >
                  {packageId === id ? 'Active Package' : 'Choose Package'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesPage;
