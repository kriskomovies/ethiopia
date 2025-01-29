import { ReactNode } from 'react';
import { SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux/store';

const AppSidebarHeader = (): ReactNode => {
  const { user } = useAppSelector((store) => store.appState);

  return (
    <SidebarHeader>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user?.username}</span>
        </div>
      </SidebarMenuButton>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
