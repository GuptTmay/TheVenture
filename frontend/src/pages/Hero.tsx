import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Zap, User, UserPlus } from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Stories', 'Ideas', 'Insights', 'Thoughts', 'Dreams'];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">

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
      {/* Navigation */}
      <nav className="relative z-20 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-gray-300 transition-colors hover:text-white"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>

            <button
              onClick={() => navigate('/register')}
              className="flex cursor-pointer items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2 text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-violet-500"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header Badge */}
          <div className="mb-8 flex justify-center">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500/50 to-violet-500/50 opacity-60 blur transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex items-center space-x-2 rounded-full border border-gray-800 bg-gray-900/80 px-6 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">
                  Welcome to The Venture
                </span>
                <Zap className="h-4 w-4 text-violet-400" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-5xl font-black md:text-7xl">
              <span className="bg-gradient-to-r from-gray-100 via-white to-gray-200 bg-clip-text text-transparent">
                Share Your
              </span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {words[currentWord]}
                </span>
                <div className="absolute right-0 -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-400 md:text-2xl">
              Join our vibrant community of writers and readers. Discover
              compelling stories, share your unique perspective, and connect
              with minds that matter.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('register')}
              className="group relative cursor-pointer rounded-lg border border-gray-700 bg-gray-900/80 px-12 py-4 text-lg font-medium text-white shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-gray-600 hover:bg-gray-800/90"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-100">Start Writing</span>
                <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-300" />
              </div>

              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-800/0 via-gray-700/10 to-gray-800/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
