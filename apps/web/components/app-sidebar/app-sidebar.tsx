import { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import AppSidebarHeader from '@/components/app-sidebar/app-sidebar-header';
import AppSidebarFooter from '@/components/app-sidebar/app-sidebar-footer';
import AppSidebarContent from '@/components/app-sidebar/app-sidebar-content';

export interface ISidebarItem {
  title: string;
  url: string;
  icon: string;
}

const items: ISidebarItem[] = [
  {
    title: 'The project',
    url: '/',
    icon: 'house',
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'chart-column-decreasing',
  },
  {
    title: '',
    url: '',
    icon: 'home',
  },
  {
    title: 'Deposit',
    url: '/deposit',
    icon: 'piggy-bank',
  },
  {
    title: 'Deposit history',
    url: '/deposit-history',
    icon: 'wallet',
  },
  {
    title: '',
    url: '',
    icon: 'home',
  },
  {
    title: 'Withdraw',
    url: '/withdraw',
    icon: 'arrow-big-down-dash',
  },
  {
    title: 'Withdraw requests',
    url: '/withdraw-requests',
    icon: 'wallet',
  },
  {
    title: '',
    url: '',
    icon: 'home',
  },
  {
    title: 'Collect',
    url: '/collect',
    icon: 'hand-coins',
  },
  {
    title: 'Team',
    url: '/team',
    icon: 'users-round',
  },
  {
    title: 'Packages',
    url: '/packages',
    icon: 'package',
  },
  {
    title: 'Customer Service',
    url: '/customer-service',
    icon: 'hand-helping',
  },
];

const AppSidebar = (): ReactNode => {
  return (
    <Sidebar collapsible="icon" className="text-white">
      <AppSidebarHeader />
      <AppSidebarContent sideBarItems={items} />
      <AppSidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
