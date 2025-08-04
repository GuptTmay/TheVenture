import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '@/lib/api';
import { Status, toastHandler } from '@/lib/helper';
import Logo from '@/components/Logo';
import UserAcc from '@/components/UserAcc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, type FormEvent } from 'react';
import { Edit, Eye, Loader2 } from 'lucide-react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toastHandler(Status.ERROR, 'Title and content cannot be empty!');
      return;
    }

    setSubmitting(true);

    try {
      const res = await createBlog(title, content);
      const data = await res.json();
      toastHandler(data.status, data.message);
      if (res.ok) {
        navigate('/feeds');
      }
    } catch (error) {
      toastHandler(Status.ERROR, 'Something went wrong!');
      console.log(error);
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
            onClick={() => {
              navigate('/blog/ai');
            }}
            variant="outline"
          >
            Generate Using AI
          </Button>
          <UserAcc />
        </div>
      </nav>
      <div className="flex justify-center">
        <Card className="my-10 w-full  md:w-2/3">
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
                        className="min-h-[400px] w-full resize-none text-base leading-7"
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
                      Creating Blog...
                    </>
                  ) : (
                    'Create Blog'
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
    </div>
  );
};

export default CreateBlog;

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from '@/components/ui/form';
// import { useNavigate } from 'react-router-dom';
// import { createBlog } from '@/lib/api';
// import { toastHandler } from '@/lib/helper';
// import Logo from '@/components/Logo';
// import UserAcc from '@/components/UserAcc';

// const CreateBlogSchema = z.object({
//   title: z
//     .string()
//     .max(150, 'Title Length should not exceed 150 letters')
//     .nonempty('Title should not be empty'),
//   content: z
//     .string()
//     .max(2500, 'Content Length should not exceed 2500 letters')
//     .nonempty('Content should not be empty'),
// });

// type CreateBlogSchemaType = z.infer<typeof CreateBlogSchema>;

// const CreateBlog = () => {
//   const navigate = useNavigate();

//   const form = useForm<CreateBlogSchemaType>({
//     resolver: zodResolver(CreateBlogSchema),
//     defaultValues: {
//       title: '',
//       content: '',
//     },
//   });

//   const onSubmit = async (data: CreateBlogSchemaType) => {
//     console.log(data);
//     const res = await createBlog(data.title, data.content);
//     const proData = await res.json();
//     toastHandler(proData.status, proData.message);
//     navigate('/feeds');
//   };

//   return (
//     <div className="px-6">
//       {/* Header */}
//       <nav className="sticky top-0 z-10 flex items-center justify-between border-b px-2 py-4 backdrop-blur-2xl sm:px-6">
//           <Logo/>
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={() => {
//               navigate('/blog/ai');
//             }}
//             variant="outline"
//           >
//             Generate Using AI
//           </Button>
//           <UserAcc />
//         </div>
//       </nav>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mx-auto mt-6 max-w-xl space-y-6"
//         >
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     className="text-base leading-7"
//                     placeholder="Enter blog title"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Content</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Start writing your blog..."
//                     rows={16}
//                     className="min-h-[200px] w-full text-base leading-7 md:min-h-[300px]"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" className="w-full">
//             Submit
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CreateBlog;
