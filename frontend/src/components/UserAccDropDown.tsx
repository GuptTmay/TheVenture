import type { RootState } from '@/app/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Status, toastHandler } from '@/lib/helper';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserAccDropDown = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              sessionStorage.removeItem('token');
              toastHandler(Status.INFO, 'Logged out successfully');
              navigate('/');
            }}
            className="cursor-pointer"
          >
            Log Out
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate('/blog/user');
            }}
          >
            My Blogs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAccDropDown;
