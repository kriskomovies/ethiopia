import { Fragment, ReactNode } from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ISidebarItem } from '@/components/app-sidebar/app-sidebar';
import { useRouter } from 'next/router';
import LucideIcon from '@/components/lucide-icon/lucide-icon';

interface IAppSidebarContentProps {
  sideBarItems: ISidebarItem[];
}

const AppSidebarContent = ({
  sideBarItems,
}: IAppSidebarContentProps): ReactNode => {
  const router = useRouter();
  return (
    <SidebarContent>
      <SidebarGroup>
        {/*<SidebarGroupLabel>Навигация</SidebarGroupLabel>*/}
        <SidebarGroupContent>
          <SidebarMenu>
            {sideBarItems.map((item, idx) => {
              const isActive = router.pathname === item.url;

              if (!item.url) {
                return (
                  <div
                    className="h-0.5 my-2 bg-primary w-100"
                    key={`sideBar-${idx}`}
                  />
                );
              }
              return (
                <Fragment key={`sideBar-${idx}`}>
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url}>
                        <LucideIcon name={item.icon as any} size={26} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Fragment>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default AppSidebarContent;
