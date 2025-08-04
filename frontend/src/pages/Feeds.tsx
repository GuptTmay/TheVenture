import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import { useEffect, useState } from 'react';
import { getAllBlogs } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Status, toastHandler, type BlogType } from '@/lib/helper';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import UserAcc from '@/components/UserAcc';
import Logo from '@/components/Logo';
import { CometCard } from '@/components/ui/comet-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const Feeds = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogType[] | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      toastHandler(Status.WARNING, 'Authenticate First!!');
      setTimeout(() => navigate('/register'), 4000);
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        const res = await data.json();

        if (!res.blogs) {
          toastHandler(res.status, res.message);
        } else {
          setBlogs(res.blogs);
        }
      } catch (error) {
        toastHandler(Status.ERROR, 'Something went wrong!');
        console.error(error);
        navigate('/feeds');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  return (
    <div className="bg-background text-foreground min-h-screen w-full pb-6">
      {/* Header */}

      <nav className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-2xl">
        <Logo />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              navigate('/blog/create');
            }}
            variant="outline"
          >
            Create Blog
          </Button>
          <UserAcc />
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex gap-6 px-4 py-6">
        {/* Blog Feed */}
        <div className="flex w-full flex-col gap-6 sm:w-2/3">
          {!loading && (!blogs || blogs.length === 0) && (
            <div className="text-muted-foreground text-center">
              No Blogs Found!
            </div>
          )}

          {blogs?.map((blog, index) => (
            <BlogCard
              key={index}
              blogId={blog.id}
              title={
                blog.title.length < 30
                  ? blog.title
                  : blog.title.substring(0, 30) + '...'
              }
              content={
                blog.content.length < 150
                  ? blog.content
                  : blog.content.substring(0, 150) + '...'
              }
              authorName={blog.author.name || 'User'}
              authorId={blog.author.id}
              updatedAt={blog.updatedAt}
            />
          ))}

          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
        </div>

        {/* Aside Sidebar */}
        <aside className="hidden w-1/3 space-y-4 sm:block">
          <CometCard className="p-10">
            <Card className="border-muted-foreground bg-zinc-900 text-white shadow-lg">
              <CardHeader className="flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                <CardTitle className="text-xl">AI Blog Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300">
                  Instantly generate high-quality blog posts with the power of
                  AI. Just give a topic — we handle the rest.
                </p>
                <Button
                  variant="outline"
                  className=""
                  onClick={() => navigate('/blog/ai')}
                >
                  Generate Blog
                </Button>
              </CardContent>
            </Card>
          </CometCard>
        </aside>
      </main>
    </div>
  );
};

export default Feeds;
