import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

interface IAppDeleteMenuItemProps {
  children: ReactNode;
  name: string;
  entityType: string;
  onDelete: () => void;
  isDeleting: boolean;
}

const AppDeleteMenuItem = ({
  name,
  children,
  entityType,
  onDelete,
  isDeleting = false,
}: IAppDeleteMenuItemProps): ReactNode => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {children}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="top-1/2 flex w-3/10 flex-col right-3/10 absolute">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this {entityType}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{' '}
            {entityType} <span className="font-bold">&quot;{name}&quot;</span>{' '}
            and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppDeleteMenuItem;
