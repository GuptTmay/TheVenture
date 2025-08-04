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
import { Eye, EyeClosed, LockIcon, MailIcon, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { changePassword, loginUser, sendOtp, verifyOtp } from '@/lib/api';
import { Status, toastHandler } from '@/lib/helper';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '@/features/user/userSlice';

const Login = () => {
  const ForgetPasswordStageStates = {
    DEFAULT: 'default',
    EMAIL: 'email',
    OTP: 'OTP',
    PASSWORD: 'PASSWORD',
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [forgotPasswordStage, setForgotPasswordStage] = useState(
    ForgetPasswordStageStates.DEFAULT
  );

  const handlePasswordVisiblity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      const data = await res.json();
      toastHandler(data.status, data.message);

      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        console.log(data);
        dispatch(addUserInfo(data.user));
        navigate('/feeds');
      }
    } catch (err) {
      console.log(err);
      toastHandler(Status.ERROR, 'Something went wrong');
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
        setForgotPasswordStage(ForgetPasswordStageStates.OTP);
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
        setForgotPasswordStage(ForgetPasswordStageStates.PASSWORD);
        setPassword('');
      }
    } catch (err) {
      console.log(err);
      toastHandler(Status.ERROR, 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await changePassword(password);
      const data = await res.json();
      toastHandler(data.status, data.message);

      if (res.ok) {
        setForgotPasswordStage(ForgetPasswordStageStates.DEFAULT);
        sessionStorage.removeItem('token');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.log(error);
      toastHandler(Status.ERROR, 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/20 relative flex min-h-screen w-full flex-col items-center justify-center gap-12 px-6 py-8 sm:justify-between md:flex-row md:px-16">
      {/* Fancy Background */}
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

      {/* Left Branding */}
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
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-lg">
            Ready to share your next story? Sign in to continue.
          </p>
        </div>
      </motion.div>

      {/* Login Form */}
      <motion.div
        className="z-10 flex w-full justify-center md:flex-1"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/40 bg-background/80 w-full max-w-sm border shadow-md backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl font-medium tracking-tight">
              {forgotPasswordStage === ForgetPasswordStageStates.DEFAULT &&
                'Sign In to Your Account'}
              {forgotPasswordStage === ForgetPasswordStageStates.EMAIL &&
                'Enter Your Email'}
              {forgotPasswordStage === ForgetPasswordStageStates.OTP &&
                `OTP Verification`}
              {forgotPasswordStage === ForgetPasswordStageStates.PASSWORD &&
                `New Password`}
            </CardTitle>
          </CardHeader>

          {forgotPasswordStage === ForgetPasswordStageStates.DEFAULT && (
            <>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="Password"
                        className="px-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        onMouseDown={handlePasswordVisiblity}
                        onMouseUp={handlePasswordVisiblity}
                        className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 cursor-pointer"
                      >
                        {hidePass ? (
                          <EyeClosed className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <CardDescription>
                  New to The Venture?
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-2"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </CardDescription>
                <CardDescription>
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-0"
                    onClick={() =>
                      setForgotPasswordStage(ForgetPasswordStageStates.EMAIL)
                    }
                  >
                    Forgot Password?
                  </Button>
                </CardDescription>
              </CardFooter>
            </>
          )}

          {forgotPasswordStage === ForgetPasswordStageStates.EMAIL && (
            <>
              <CardContent>
                <form onSubmit={handleSendingOTP} className="space-y-5">
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col items-start">
                <CardDescription>
                  We are going to send OTP to your Email
                </CardDescription>
                <CardDescription>
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-0"
                    onClick={() => {
                      setForgotPasswordStage(ForgetPasswordStageStates.DEFAULT);
                    }}
                  >
                    Go Back
                  </Button>
                </CardDescription>
              </CardFooter>
            </>
          )}

          {forgotPasswordStage === ForgetPasswordStageStates.OTP && (
            <>
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
                      setForgotPasswordStage(ForgetPasswordStageStates.DEFAULT);
                    }}
                  >
                    Go Back
                  </Button>
                </CardDescription>
              </CardFooter>
            </>
          )}

          {forgotPasswordStage === ForgetPasswordStageStates.PASSWORD && (
            <>
              <CardContent className="flex flex-col">
                <form onSubmit={handleNewPassword} className="space-y-5">
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
                        className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 cursor-pointer"
                      >
                        {hidePass ? (
                          <EyeClosed className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Changing ...' : 'Change'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <CardDescription>Enter your new Password</CardDescription>
                <CardDescription>
                  <Button
                    variant="link"
                    size="sm"
                    className="pl-0"
                    onClick={() => {
                      setForgotPasswordStage(ForgetPasswordStageStates.DEFAULT);
                    }}
                  >
                    Go Back
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

export default Login;
