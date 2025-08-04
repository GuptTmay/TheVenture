import Markdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { ageFinder, Status, toastHandler } from '@/lib/helper';
import React, { useEffect, useState } from 'react';
import { deleteBlog, getBlogVotes } from '@/lib/api';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type BlogCardProps = {
  blogId: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  updatedAt: string;
  isUserBlog?: boolean;
  fetchData?: () => Promise<void>;
};

const BlogCard = ({
  blogId,
  title,
  content,
  authorName,
  authorId,
  updatedAt,
  isUserBlog = false,
  fetchData = () => Promise.resolve(),
}: BlogCardProps) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState<number | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await getBlogVotes(blogId);
        const data = await res.json();
        setVotes(data.voteCount ?? 0);
      } catch {
        setVotes(0);
      }
    };

    fetchVotes();
  }, [blogId]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const toastId = toast.loading('Deleteing blog...');
    try {
      const res = await deleteBlog(blogId);
      const data = await res.json();

      toastHandler(data.status, data.message);
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      toastHandler(Status.ERROR, 'Something went wrong!');
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/blog/edit/${blogId}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/blog/read/${blogId}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/read/${blogId}`)}
      className="block cursor-pointer focus:outline-none"
    >
      <Card className="group border-border/40 bg-background/60 rounded-2xl border backdrop-blur-sm hover:bg-blue-100/5 hover:shadow-xl">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="bg-secondary size-7 ring ring-white/30">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${authorId}&flip=false`}
              alt={authorName}
            />
            <AvatarFallback className="text-xs font-semibold">
              {authorName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-foreground text-sm font-medium">{authorName}</p>
        </CardHeader>

        <CardContent className="space-y-2">
          <h2 className="text-primary text-2xl font-bold">{title}</h2>

          <div className="text-muted-foreground text-md line-clamp-3">
            <Markdown
              allowedElements={['p', 'em', 'strong']}
              unwrapDisallowed={true}
            >
              {content}
            </Markdown>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-muted-foreground pt-2 text-sm">
            🗳️ {votes ?? '...'} votes • {ageFinder(updatedAt)}
          </div>

          {isUserBlog && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="hover:bg-primary/10 hover:text-primary h-7 px-2 text-xs"
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-7 px-2 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCard;
