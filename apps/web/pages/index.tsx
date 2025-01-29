import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import {
  ArrowUpWideNarrow,
  Bitcoin,
  Boxes,
  Globe,
  Menu,
  TreeDeciduous,
  Zap,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import HomePageInfoBox from '@/components/home-page-info-box/home-page-info-box';
import Image from 'next/image';

export default function HomePage(props: any) {
  const router = useRouter();
  const pricingRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAppSelector((state) => state.appState);
  const onLoginClick = () => router.push('/login');
  const onRegisterClick = () => router.push('/register');

  const onViewPricingClick = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div>
        <div className="flex flex-col flex-1 items-center justify-center my-12">
          <h1 className="text-4xl font-bold">Join the global GPU market</h1>
          <div className="text-center my-4 w-full">
            <p>
              Join Tretamine cloud, the only company aiming to simplify the GPU
              rental services.
            </p>
            <p>Innovating crypto currency mining into a click of a button</p>
            <div className="flex flex-col items-center justify-center">
              <Image
                src={'/video-card.png'}
                alt={'video-card'}
                width={500}
                height={100}
              />
              <div className="w-1/3 flex justify-between mb-4 max-[1000px]:w-full">
                <Button onClick={onViewPricingClick}>Review pricing</Button>
                <Button onClick={() => router.push('/collect')}>
                  Collect rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center my-12 py-6 bg-[rgba(0,0,0,0.7)]">
          <h1 className="text-4xl font-bold">How we do it?</h1>
          <p className="text-center w-1/2 my-4 max-[1000px]:w-full">
            Explore Tretamine's global network and open a new revenue for your
            idle GPU hardware. We directly connect your hardware to the most
            profitable cryptocurrency pools automatically or by making them
            available for our users for rent and mine instead of you.
          </p>
          <Button onClick={() => router.push('/dashboard')}>Get started</Button>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center text-center my-12">
          <h1 className="text-4xl font-bold">
            Do you have GPU's in a datacenter?
          </h1>
          <p className="text-center w-1/2 mt-4 mb-2 max-[1000px]:w-full">
            Tretamine verifies and showcases hosting partners who operate
            server-grade equipment within professionally managed datacenter
            environments. This way we <b>ensure</b> that our customers are
            receiving <b>enterprise level security and stability.</b>
          </p>
          <p className="text-center w-1/2 mb-4 max-[1000px]:w-full">
            Turn idle time into a revenue opportunity by listing your GPU with
            us and unlock a new stream of income.
          </p>
        </div>
        <div className="flex flex-1 items-start justify-center my-12 max-[1000px]:flex-col">
          <HomePageInfoBox
            icon={<ArrowUpWideNarrow size={42} />}
            title="Increase ROI"
            description="Maximize the return on your hardware investments and reduce the
              payback period of your GPUs."
          />
          <HomePageInfoBox
            icon={<Bitcoin size={42} />}
            title="Earn continuously"
            description="Fill in your downtime by listing your GPUs to Tretamine."
          />
          <HomePageInfoBox
            icon={<Globe size={42} />}
            title="Get a global customer base"
            description="Tretamine's network brings a worldwide customer base. A simple
              method to increase your market without any additional marketing
              expenses."
          />
        </div>
        <div className="flex flex-col flex-1 items-center justify-center my-12">
          <h1 className="text-4xl text-center font-bold my-6">
            For Entrepreneurs and GPU Farm Owners
          </h1>
          <p className="w-1/2 text-center max-[1000px]:w-full">
            Transform your mining farm into a GPU training center and start
            earning. Whether you are a small-scale GPU owner or run a
            full-fledged GPU farm, Tretamine is your platform for turning your
            GPUs into a profitable business.
          </p>
        </div>
        <div className="flex flex-1 items-start justify-center my-12 max-[1000px]:flex-col">
          <HomePageInfoBox
            icon={<Zap size={42} />}
            title="Easy start"
            description="Setting you up for business has never been this simple. Contact us to connectt your GPUs and start earning today."
          />
          <HomePageInfoBox
            icon={<Boxes size={42} />}
            title="Scale faster"
            description="The demand for GPUs is skyrocketing. In today's competetive market staying on edge is key."
          />
          <HomePageInfoBox
            icon={<TreeDeciduous size={42} />}
            title="Grow your business"
            description="Don't let idle GPUs be a cost burdon - invest their power wisely and turn downtime into a profitable revenue stream. Listing your GPUs with us is a opportunity to maximize your hardware's potential and fuel your growth."
          />
        </div>
        <div className="flex flex-row flex-1 items-center justify-center my-12 w-full max-[1000px]:flex-col">
          <Image
            src={'/betamine-image.png'}
            alt={'video-card'}
            width={240}
            height={500}
          />
          <div className="h-full ml-4 max-[1000px]:mt-4">
            <h2 className="text-3xl font-semibold mb-6 max-[1000px]:text-center">
              For individuals and Business with GPUs
            </h2>
            <div className="flex flex-col justify-start max-[1000px]:justify-center">
              <div className="mb-4">
                <h3 className="text-2xl max-[1000px]:text-center">
                  Earn from idle time
                </h3>
                <p className="w-1/2 max-[1000px]:w-full max-[1000px]:text-center">
                  GPUs are costly. Make yours work for you when you are not
                  using it. Apply and rent it to others via Tretamine clouds
                  network.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-2xl max-[1000px]:text-center">
                  Safe and secure
                </h3>
                <p className="w-1/2 max-[1000px]:w-full max-[1000px]:text-center">
                  Your GPUs are valuable and we treat them that way. Tretamine
                  offers a secure platform where your hardware is protected.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl max-[1000px]:text-center">
                  Transparent process
                </h3>
                <p className="w-1/2 max-[1000px]:w-full max-[1000px]:text-center">
                  With Tretamine renting out your GPU is straightforward.
                  Contact us at: <b>tretamine@email.com</b>, so we can handle
                  all the technicalities and enjoy the return.
                </p>
              </div>
              <Button onClick={() => router.push('/collect')}>
                Collect rewards
              </Button>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col flex-1 items-center justify-center text-center my-12"
          ref={pricingRef}
        >
          <h1 className="text-4xl font-bold">Pricing</h1>
          <h2 className="text-xl font-bold">
            Do not let idle time loose you money
          </h2>
          <p className="text-center w-1/2 mt-4 mb-2 max-[1000px]:w-full">
            Tretamine's prices are calculated per GPU, in case of multi GPU
            instances, the price is divided by the number of GPUs on the
            instance.
          </p>
        </div>
      </div>
      {!isLoggedIn && (
        <>
          <div className="absolute right-2 top-5 hidden md:block">
            <Button className="mr-4" onClick={onLoginClick}>
              Login
            </Button>
            <Button onClick={onRegisterClick}>Register</Button>
          </div>
          <div className="absolute right-2 top-5 block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="mr-auto">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white">
                <DropdownMenuCheckboxItem
                  className="capitalize"
                  onClick={onLoginClick}
                >
                  Login
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="capitalize"
                  onClick={onRegisterClick}
                >
                  Register
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
}
