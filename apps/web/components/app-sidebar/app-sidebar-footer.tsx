import { ReactNode } from 'react';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { setLoggedOut } from '@/redux/features/app-state-slice';
import { useDispatch } from 'react-redux';

const AppSidebarFooter = (): ReactNode => {
  const dispatch = useDispatch();
  const onLogoutClick = () => {
    dispatch(setLoggedOut());
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div
              onClick={onLogoutClick}
              className="flex items-center gap-2 w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors duration-200 ease-in-out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
