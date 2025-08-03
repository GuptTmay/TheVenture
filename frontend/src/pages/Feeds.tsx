import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BlogCard from '@/components/BlogCard';
import { useEffect, useState } from 'react';
import { getAllBlogs } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  Status,
  toastHandler,
  type BlogType,
} from '@/lib/helper';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';

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
        <div className="flex items-end gap-2 text-2xl font-bold">
          <PenLine className="text-primary size-8" />
          <span className="from-primary to-primary/70 hidden bg-gradient-to-r bg-clip-text text-transparent sm:block">
            The Venture
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              navigate('/blog/create');
            }}
            variant="outline"
          >
            Create Blog
          </Button>
          <Avatar className="bg-secondary size-10 cursor-pointer ring-2 ring-white/30 hover:scale-110 active:scale-105">
            <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=uuid&flip=true" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
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
          {/* Trending Topics */}
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-lg font-semibold">📈 Trending Topics</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
              <li>Web3 & Decentralization</li>
              <li>AI & LLMs</li>
              <li>TypeScript Tips</li>
              <li>CSS Tricks in 2025</li>
            </ul>
          </div>

          {/* Tags */}
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-lg font-semibold">🏷️ Popular Tags</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {['#JavaScript', '#React', '#AI', '#Startups', '#Design'].map(
                (tag, i) => (
                  <span
                    key={i}
                    className="bg-muted text-muted-foreground hover:bg-accent cursor-pointer rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Suggested Users */}
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 text-lg font-semibold">
              👥 Suggested Creators
            </h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>@tech_with_tanmay</li>
              <li>@frontendfox</li>
              <li>@ai_architect</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Feeds;
