import { Button } from '@/components/ui/button';
import { createAiBlog } from '@/lib/api';
import { Status, toastHandler } from '@/lib/helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, PenLine } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import UserAcc from '@/components/UserAcc';

const CreateAiBlogSchema = z.object({
  topic: z
    .string()
    .max(200, 'Topic should not exceed 200 letters!')
    .nonempty("Topic can't be left empty!"),
});

type CreateAiBlogSchemaType = z.infer<typeof CreateAiBlogSchema>;

const AiBlog = () => {
  const navigate = useNavigate();
  const form = useForm<CreateAiBlogSchemaType>({
    resolver: zodResolver(CreateAiBlogSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = async (topic: CreateAiBlogSchemaType) => {
    const toastId = toast.loading('Creating Blog');
    try {
      const res = await createAiBlog(topic);
      const data = await res.json();

      toast.dismiss(toastId);
      toastHandler(data.status, data.message);
      if (res.ok) navigate('/feeds');
    } catch (error) {
      console.log(error);
      toastHandler(Status.ERROR, 'Something went wrong');
    }
  };

  return (
    <div>
      <nav className="bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-4 backdrop-blur-md">
        <div className="flex items-end gap-2 text-2xl font-bold">
          <PenLine className="text-primary size-8" />
          <span className="from-primary to-primary/70 hidden bg-gradient-to-r bg-clip-text text-transparent sm:block">
            The Venture
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              navigate('/feeds');
            }}
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-6 max-w-xl space-y-6"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-base leading-7"
                    placeholder="Enter blog topic.."
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

export default AiBlog;
