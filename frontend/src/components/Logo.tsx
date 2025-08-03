import { PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/") } className="flex cursor-pointer items-end gap-2 text-2xl font-bold">
      <PenLine className="text-primary size-8" />
      <span className="from-primary to-primary/70 hidden bg-gradient-to-r bg-clip-text text-transparent sm:block">
        The Venture
      </span>
    </button>
  );
};

export default Logo;
