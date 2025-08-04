import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { useNavigate, useParams } from 'react-router-dom';
import { editBlog, getBlog } from '@/lib/api';
import { Status, toastHandler } from '@/lib/helper';
import Logo from '@/components/Logo';
import UserAcc from '@/components/UserAcc';
import { ArrowLeft, Edit, Eye, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Markdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const fetchBlog = useCallback(async (blogId: string) => {
    try {
      const res = await getBlog(blogId);
      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.message || `Failed to load blog (${res.status})`;
        toastHandler(Status.ERROR, errorMessage);
      } else {
        setTitle(data.blogData.title);
        setContent(data.blogData.content);
      }
    } catch (err) {
      const errorMessage =
        'Failed to fetch blog. Please check your connection.';
      toastHandler(Status.ERROR, errorMessage);
      console.error('Blog fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      toastHandler(Status.ERROR, 'Invalid blog URL');
      navigate('/blog/user', { replace: true });
      return;
    }

    fetchBlog(id);
  }, [id, fetchBlog, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toastHandler(Status.ERROR, 'Invalid Blog Id');
      return;
    }

    if (!title.trim()) {
      toastHandler(Status.ERROR, 'Title is required');
      return;
    }

    if (!content.trim()) {
      toastHandler(Status.ERROR, 'Content is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await editBlog(id, title, content);
      const data = await res.json();
      toastHandler(data.status, data.message);

      if (res.ok) {
        navigate('/blog/user');
      }
    } catch (error) {
      toastHandler(Status.ERROR, 'Something went wrong!');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6">
      {/* Header */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b px-2 py-4 backdrop-blur-2xl sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/blog/user')}
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

      <div className="flex w-full items-center justify-center pt-4">
        <h1 className="text-4xl font-medium">Edit Blog</h1>
      </div>
      {loading && (
        <div className="flex w-full items-center justify-center p-10">
          <p className="text-muted-foreground">Loading Blog...</p>{' '}
        </div>
      )}

      {!loading && (
        <div className="flex justify-center">
          <Card className="my-10 w-full sm:w-2/3">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Textarea
                    id="title"
                    placeholder="Enter blog title..."
                    value={title}
                    disabled={submitting}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                    required
                  />
                  <p className="text-muted-foreground text-xs">
                    {title.length}/150 characters
                  </p>
                </div>

                {/* Content Editor with Preview */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>

                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="edit"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger
                        value="preview"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit" className="mt-4">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Start writing your blog content... (Markdown supported)"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          disabled={submitting}
                          className="min-h-[200px] w-full resize-none text-base leading-7 md:min-h-[300px]"
                          required
                        />
                        <div className="text-muted-foreground flex justify-between text-xs">
                          <span>Markdown is supported</span>
                          <span>{content.length}/5000 characters</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                      <Card className="min-h-[400px] md:min-h-[500px]">
                        <CardHeader>
                          <CardTitle className="text-2xl">
                            {title || 'Untitled'}
                          </CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent>
                          {content ? (
                            <div className="prose prose-gray dark:prose-invert max-w-none">
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
                                      <code className={className}>
                                        {children}
                                      </code>
                                    );
                                  },
                                }}
                              >
                                {content}
                              </Markdown>
                            </div>
                          ) : (
                            <div className="text-muted-foreground flex h-full items-center justify-center">
                              <p>Start writing to see the preview...</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitting || !title.trim() || !content.trim()}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Blog...
                      </>
                    ) : (
                      'Update Blog'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/blog/user')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditBlog;
