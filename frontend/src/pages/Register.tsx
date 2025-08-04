import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

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
import { registerUser, sendOtp, verifyOtp } from '@/lib/api';
import { Status, toastHandler } from '@/lib/helper';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '@/features/user/userSlice';

const Register = () => {
  const RegisterStages = {
    EMAIL: 'email',
    OTP: 'otp',
    INFO: 'info',
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [registerStages, setRegisterStages] = useState(RegisterStages.EMAIL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(name, password);
      const data = await res.json();
      toastHandler(data.status, data.message);

      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        dispatch(addUserInfo(data.user));
        navigate('/feeds');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendingOTP = async (
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Sending OTP');
    try {
      const res = await sendOtp(email);
      const data = await res.json();
      toast.dismiss(toastId);
      toastHandler(data.status, data.message);

      if (res.ok) {
        setRegisterStages(RegisterStages.OTP);
        setOtp('');
      }
    } catch (err) {
      console.log(err);
      toastHandler(Status.ERROR, 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Verifing OTP');
    try {
      const res = await verifyOtp(email, otp);
      const data = await res.json();
      toast.dismiss(toastId);
      toastHandler(data.status, data.message);

      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        setRegisterStages(RegisterStages.INFO);
        setPassword('');
      }
    } catch (err) {
      console.log(err);
      toastHandler(Status.ERROR, 'Something went wrong');
    } finally {
      setLoading(false);
    }
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

      {/* Dot Background */}
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
          'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

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
          {registerStages === RegisterStages.EMAIL && (
            <>
              <CardHeader>
                <CardTitle className="text-center text-xl font-medium tracking-tight">
                  Create Your Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendingOTP} className="space-y-5">
                  {/* Email */}
                  <div className="group relative space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <MailIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        autoComplete="off"
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

                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Submit'}
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
            </>
          )}

          {registerStages === RegisterStages.OTP && (
            <>
              <CardHeader>
                <CardTitle className="text-center text-xl font-medium tracking-tight">
                  Verifing Your Email
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  {/* OTP  */}
                  <div className="group relative space-y-1 place-self-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        {[...Array(3)].map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                        <InputOTPSeparator />
                        {[...Array(3)].map((_, i) => (
                          <InputOTPSlot key={i + 3} index={i + 3} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Verifing ...' : 'Verify'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <CardDescription>OTP Sent to {email}</CardDescription>
                <CardDescription>
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-0"
                    onClick={handleSendingOTP}
                  >
                    Resend OTP
                  </Button>
                </CardDescription>
                <CardDescription>
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-0"
                    onClick={() => {
                      setRegisterStages(RegisterStages.EMAIL);
                    }}
                  >
                    Go Back
                  </Button>
                </CardDescription>
              </CardFooter>
            </>
          )}

          {registerStages === RegisterStages.INFO && (
            <>
              <CardHeader>
                <CardTitle className="text-center text-xl font-medium tracking-tight">
                  Enter Your Info
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
                        autoComplete="off"
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

                  {/* Password */}
                  <div className="group relative space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <LockIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="password"
                        type={hidePass ? 'password' : 'text'}
                        placeholder="Password"
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
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
