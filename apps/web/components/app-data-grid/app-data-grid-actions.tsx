import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';

interface IGirdActionsProps {
  name: string;
  id: string;
  entity: string;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
  children?: ReactNode;
}

const AppDataGridActions = ({
  id,
  name,
  entity,
  onDelete,
  onEdit,
  onView,
  children,
}: IGirdActionsProps): ReactNode => {
  const dispatch = useDispatch();

  const onDeleteClick = () => {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
          Copy {entity} ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onView}>
          <Eye />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          Edit {entity}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
          Delete {entity}
        </DropdownMenuItem>
        {children && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Additional actions</DropdownMenuLabel>
            {children}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppDataGridActions;
