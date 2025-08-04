import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import UserAcc from '@/components/UserAcc';
import { Status, toastHandler, type BlogType } from '@/lib/helper';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogType[] | null>(null);

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
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <nav className="bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-4 backdrop-blur-md">
        <Logo />

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/feeds')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Go Back</span>
          </Button>

          <UserAcc />
        </div>
      </nav>

      <main>
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
      </main>
    </div>
  );
};
