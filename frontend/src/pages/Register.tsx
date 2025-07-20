import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  LockIcon,
  MailIcon,
  UserIcon,
  PenLine,
  EyeClosed,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);

    const data = await registerUser(name, email, password);
    sessionStorage.setItem("token", data.token);
    alert(data.message);
  };

  const handlePasswordVisiblity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  return (
    <div className="bg-muted/20 relative flex min-h-screen w-full flex-col items-center justify-center gap-12 px-6 py-8 sm:justify-between md:flex-row md:px-16">
      {/* Fancy Background Branding */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-primary/10 animate-pulse-slow absolute -top-40 -left-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="animate-pulse-slow absolute right-0 bottom-10 h-72 w-72 rounded-full bg-purple-400/10 blur-2xl" />
      </div>

      {/* Left Section with Branding */}
      <motion.div
        className="z-10 flex w-full justify-center md:flex-1 md:justify-start"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md text-center md:text-left">
          <div className="border-border/30 bg-background/70 mb-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 shadow-sm backdrop-blur-md">
            <PenLine className="text-primary" size={24} />
            <h2 className="font-serif text-xl font-bold tracking-tight">
              The Venture
            </h2>
          </div>
          <h1 className="text-primary font-serif text-4xl leading-tight font-bold md:text-5xl">
            Write. Share. Inspire.
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-lg">
            Join the community of creators telling stories that matter.
          </p>
        </div>
      </motion.div>

      {/* Right Section - Form */}
      <motion.div
        className="z-10 flex w-full justify-center md:flex-1"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/40 bg-background/80 w-full max-w-sm border shadow-md backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl font-medium tracking-tight">
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="group relative space-y-1">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <UserIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Raven Blackwood"
                    className="pl-10"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group relative space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <MailIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group relative space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type={hidePass ? 'password' : 'text'}
                    placeholder="••••••••"
                    className="px-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onMouseDown={handlePasswordVisiblity}
                    onMouseUp={handlePasswordVisiblity}
                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {hidePass ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Join Now'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Already a Venturer?
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            </CardDescription>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
