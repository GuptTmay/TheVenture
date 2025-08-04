import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ageFinder,
  Status,
  toastHandler,
  type CommentType,
} from '@/lib/helper';
import {
  addBlogVote,
  checkIfVoted,
  createBlogComment,
  getBlog,
  getBlogComments,
  getBlogVotes,
  removeBlogVote,
} from '@/lib/api';
import { ArrowLeft, Calendar, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import UserAcc from '@/components/UserAcc';
import Logo from '@/components/Logo';
import CommentCard from '@/components/CommentCard';

type BlogData = {
  id: string;
  title: string;
  content: string;
  author: { name: string; id: string };
  updatedAt: string;
  readingTime?: number;
  tags?: string[];
};

type LoadingState = 'loading' | 'success' | 'error';

const ReadBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string>('');
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [votes, setVotes] = useState<number>(0);
  const [voted, setVoted] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentContent, setCommentContent] = useState<string>('');
  const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false);

  // Memoized blog fetching function
  const fetchBlog = useCallback(async (blogId: string) => {
    try {
      setLoadingState('loading');
      setError('');

      const res = await getBlog(blogId);
      const data = await res.json();

      const voteRes = await getBlogVotes(blogId);
      const voteData = await voteRes.json();

      const votedRes = await checkIfVoted(blogId);
      const votedData = await votedRes.json();

      if (!res.ok) {
        const errorMessage =
          data.message || `Failed to load blog (${res.status})`;
        setError(errorMessage);
        setLoadingState('error');
        toastHandler(Status.ERROR, errorMessage);
      } else {
        setBlog(data.blogData);
        setVotes(voteData.voteCount);
        setVoted(votedData.hasVoted);
        setLoadingState('success');
      }
    } catch (err) {
      const errorMessage =
        'Failed to fetch blog. Please check your connection.';
      setError(errorMessage);
      setLoadingState('error');
      toastHandler(Status.ERROR, errorMessage);
      console.error('Blog fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      toastHandler(Status.ERROR, 'Invalid blog URL');
      navigate('/feeds', { replace: true });
      return;
    }

    fetchBlog(id);
  }, [id, fetchBlog, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      try {
        const res = await getBlogComments(id);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error(error);
        toastHandler(Status.ERROR, 'Failed to fetch comments! Try Again');
      }
    };

    fetchComments();
  }, [id]);

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="mt-16 flex items-center justify-center">
      <Alert className="max-w-md">
        <AlertDescription className="text-center">
          {error}
          <div className="mt-4">
            <Button
              onClick={() => id && fetchBlog(id)}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );

  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleLikeToggle = useCallback(async () => {
    if (!id || isVoteLoading) return;

    try {
      setIsVoteLoading(true);
      const newVotedState = !voted;

      setVoted(newVotedState);
      setVotes((prev) => (newVotedState ? prev + 1 : prev - 1));

      if (newVotedState) {
        await addBlogVote(id);
      } else {
        await removeBlogVote(id);
      }
    } catch (error) {
      setVoted(voted);
      setVotes((prev) => (voted ? prev + 1 : prev - 1));
      toastHandler(Status.ERROR, 'Failed to update vote. Please try again.');
      console.error('Vote error:', error);
    } finally {
      setIsVoteLoading(false);
    }
  }, [id, voted, isVoteLoading]);

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!commentContent.trim()) return;
    if (!blog || !id) return;
    setCommentLoading(true);

    try {
      const res = await createBlogComment(id, commentContent.trim());
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        console.log(data.comment);
        setComments((prev) => [data.comment, ...prev]);
        setCommentContent('');
      }
    } catch (error) {
      console.error(error);
      toastHandler(Status.ERROR, 'Failed to comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Enhanced Header */}
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

      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        {loadingState === 'loading' && (
          <Card className="bg-background/80 mt-8 rounded-xl border shadow-md backdrop-blur-md">
            <CardContent className="p-6">
              <LoadingSkeleton />
            </CardContent>
          </Card>
        )}

        {loadingState === 'error' && <ErrorState />}

        {loadingState === 'success' && blog && (
          <article className="mt-8">
            <Card className="bg-background/80 rounded-xl border shadow-lg backdrop-blur-md">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="bg-secondary ring-primary/20 size-14 ring-2">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${blog.author.id}`}
                      alt={`${blog.author.name}'s avatar`}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {blog.author.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <User className="size-4" />
                      <span className="text-foreground font-medium">
                        {blog.author.name}
                      </span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{ageFinder(blog.updatedAt)}</span>
                      </div>

                      {blog.content && (
                        <div className="flex items-center gap-1">
                          <span>📖</span>
                          <span>
                            {calculateReadingTime(blog.content)} min read
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 px-6 pb-8">
                {/* Enhanced Title */}
                <header className="space-y-4">
                  <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    {blog.title}
                  </h1>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/*  Content */}
                <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // Custom components for better styling
                      h1: ({ children }) => (
                        <h1 className="mt-8 mb-4 text-3xl font-bold">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mt-6 mb-3 text-2xl font-semibold">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mt-4 mb-2 text-xl font-medium">
                          {children}
                        </h3>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-primary/30 bg-muted/50 rounded-r border-l-4 py-2 pl-4 italic">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                            {children}
                          </code>
                        ) : (
                          <code className={className}>{children}</code>
                        );
                      },
                    }}
                  >
                    {blog.content}
                  </Markdown>
                </div>

                {/* Footer with additional metadata */}
                <footer className="mt-8 space-y-6 border-t pt-6">
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <Button
                      onClick={handleLikeToggle}
                      variant={voted ? 'default' : 'ghost'}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={voted ? 'fill-red-500 text-red-500' : ''}
                      />
                      <span>{votes}</span>
                    </Button>

                    <Button
                      onClick={() => navigate('/feeds')}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Back to Feeds
                    </Button>
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comments</h3>

                    <form className="flex gap-2" onSubmit={handleAddComment}>
                      <input
                        type="text"
                        className="w-full flex-1 rounded border px-3 py-1 text-sm"
                        placeholder="Add a comment..."
                        value={commentContent}
                        disabled={commentLoading}
                        onChange={(e) => setCommentContent(e.target.value)}
                      />
                      <Button type="submit" size="sm">
                        Post
                      </Button>
                    </form>

                    <ul className="space-y-2">
                      {comments.length === 0 && (
                        <li className="text-muted-foreground text-sm italic">
                          No comments yet.
                        </li>
                      )}
                      {comments.map((comment, i) => (
                        <>
                          {console.log(comment)}
                          <CommentCard
                            key={i}
                            authorId={comment.user.id}
                            authorName={comment.user.name ?? 'Anonymous'}
                            content={comment.content}
                            createdAt={comment.createdAt}
                          />
                        </>
                      ))}
                    </ul>
                  </div>
                </footer>
              </CardContent>
            </Card>
          </article>
        )}
      </main>
    </div>
  );
};

export default ReadBlog;
