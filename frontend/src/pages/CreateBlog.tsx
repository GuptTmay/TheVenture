import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '@/lib/api';
import { toastHandler } from '@/lib/helper';
import Logo from '@/components/Logo';
import UserAcc from '@/components/UserAcc';

const CreateBlogSchema = z.object({
  title: z
    .string()
    .max(150, 'Title Length should not exceed 150 letters')
    .nonempty('Title should not be empty'),
  content: z
    .string()
    .max(2500, 'Content Length should not exceed 2500 letters')
    .nonempty('Content should not be empty'),
});

type CreateBlogSchemaType = z.infer<typeof CreateBlogSchema>;

const CreateBlog = () => {
  const navigate = useNavigate();

  const form = useForm<CreateBlogSchemaType>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data: CreateBlogSchemaType) => {
    console.log(data);
    const res = await createBlog(data.title, data.content);
    const proData = await res.json();
    toastHandler(proData.status, proData.message);
    navigate('/feeds');
  };

  return (
    <div className="px-6">
      {/* Header */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b px-2 py-4 backdrop-blur-2xl sm:px-6">
          <Logo/> 
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-6 max-w-xl space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-base leading-7"
                    placeholder="Enter blog title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Start writing your blog..."
                    rows={16}
                    className="min-h-[200px] w-full text-base leading-7 md:min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlog;
