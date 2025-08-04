import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { RootState } from '@/app/store';
import UserAccDropDown from './UserAccDropDown';

const UserAcc = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <UserAccDropDown>
      <Avatar className="bg-secondary size-10 cursor-pointer ring-2 ring-white/30 active:scale-105">
        <AvatarImage
          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user.id ?? 0}&flip=true`}
        />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
    </UserAccDropDown>
  );
};

export default UserAcc;
