import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSignInMutation } from '@/redux/services/auth.service';
import { useRouter } from 'next/router';
import { setLoggedIn } from '@/redux/features/app-state-slice';
import { useDispatch } from 'react-redux';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import { z } from 'zod';
import AppInput from '@/components/app-input/app-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAppSelector } from '@/redux/store';

export const schema = z.object({
  username: z.string(),
  password: z.string(),
});

type formValues = z.infer<typeof schema>;

export const defaultValues: formValues = {
  username: '',
  password: '',
};

const LoginPage = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.appState);
  const { toast } = useToast();
  const [loginUser, { isLoading }] = useSignInMutation();

  if (isLoggedIn) {
    router.push('/');
  }

  const handleSubmit = async (submitValues: any) => {
    const { username, password } = submitValues;
    const result = await loginUser({ username, password });
    const { data, error } = result;
    if (!error) {
      const { message, user } = data;
      toast({
        title: `${message} ${user.username}`,
      });
      dispatch(setLoggedIn(user));
      await router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to login.',
        description: `${error?.data?.message}`,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full text-foreground">
      <Card className="w-full max-w-[350px] bg-[rgba(0,0,0,0.7)]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IntegratedAppForm<formValues>
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            schema={schema}
          >
            <div className="flex flex-col space-y-1.5">
              <AppInput
                labelText="Username"
                labelId="username"
                name="username"
                placeholder="Username..."
                className="text-gray-400"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <AppInput
                labelText="Password"
                labelId="password"
                name="password"
                placeholder="Password..."
                type="password"
                className="text-gray-400"
              />
            </div>
            <CardFooter className="flex flex-col items-center">
              <Button type="submit" className="w-full">
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
              <Link
                href="/register"
                className="text-sm font-bold text-primary hover:underline mt-4 inline-block"
              >
                Create account
              </Link>
            </CardFooter>
          </IntegratedAppForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
