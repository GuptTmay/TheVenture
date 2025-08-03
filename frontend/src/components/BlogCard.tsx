import Markdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { blogAgeFinder } from '@/lib/helper';
import { useEffect, useState } from 'react';
import { getBlogVotes } from '@/lib/api';

type BlogCardProps = {
  blogId: string;
  title: string;
  content: string;
  authorName: string;
  updatedAt: string;
};

const BlogCard = ({
  blogId,
  title,
  content,
  authorName,
  updatedAt,
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
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${authorName}&flip=false`}
              alt={authorName}
            />
            <AvatarFallback className="text-xs font-semibold">
              {authorName[0]}
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

          <div className="text-muted-foreground pt-2 text-sm">
            🗳️ {votes ?? '...'} votes • {blogAgeFinder(updatedAt)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCard;
