import { ReactNode, useState } from 'react';
import AppInput from '@/components/app-input/app-input';
import { z } from 'zod';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { TriangleAlert } from 'lucide-react';
import { useAppSelector } from '@/redux/store';

export const schema = z.object({
  title: z.string(),
  description: z.string(),
});

type formValues = z.infer<typeof schema>;

export const defaultValues: formValues = {
  title: '',
  description: '',
};

const CustomerServicePage = (): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((store) => store.appState);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: 'Email successfully sent!',
    });
  };

  return (
    <div className="mt-6">
      <h1 className="text-3xl">Customer Service</h1>
      <div className="mt-6">
        <h2 className="text-xl">
          Having troubles? Contact us directly via the from below
        </h2>
        {isLoading ? (
          <div className="my-6">Loading...</div>
        ) : (
          <div className="bg-[rgba(0,0,0,0.7)] p-4 rounded-2xl mt-6">
            <IntegratedAppForm<formValues>
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              schema={schema}
            >
              <AppInput
                labelText="Title"
                labelId="title"
                name="title"
                placeholder="Title..."
                className="text-gray-400"
              />
              <Textarea
                placeholder="Description..."
                name="description"
                values={''}
                setFieldValue={() => {}}
              />
              <Button type="submit" className="w-full">
                Sent email
              </Button>
            </IntegratedAppForm>
          </div>
        )}
      </div>
      <div className="w-full h-full flex flex-1 justify-start items-center my-4">
        <div className="bg-[rgba(190,81,5,0.7)] px-4 py-2 rounded-xl flex items-center">
          <div>
            <TriangleAlert size={32} className="mr-4" />
          </div>
          <div>
            <p>
              We will contact you back at email:
              <span className="underline font-semibold ml-2">{user.email}</span>
            </p>
            <p>
              If you wish to be contacted on another mail, please specify it in
              the description of your email.
            </p>
            <br />
            <p>
              Average response time:{' '}
              <span className="underline font-semibold ml-2">
                1 business day
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;
