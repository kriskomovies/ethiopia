import AppSidebar from '@/components/app-sidebar/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.appState);
  const redirectToLogin = async () => {
    await router.push('/login');
  };
  const redirectToRegister = async () => {
    const refCode = window.location.search;
    await router.push(`/register${refCode}`);
  };
  const isRegister = router.pathname.includes('/register');

  useEffect(() => {
    if (!isLoggedIn) {
      if (isRegister) {
        redirectToRegister();
      } else {
        redirectToLogin();
      }
    }
  }, [isLoggedIn]);

  return (
    <SidebarProvider className="overflow-x-hidden">
      {isLoggedIn && <AppSidebar />}
      <SidebarInset>
        <div className="flex flex-1 items-center flex-col gap-4 py-6 px-[20%] bg-[url('/background.jpg')] bg-cover text-white max-[640px]:px-4">
          {isLoggedIn && <SidebarTrigger className="absolute left-10 top-5" />}
          <div className="h-full min-[150px]:w-[80vw] min-[380px]:w-[90vw] min-[640px]:w-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
