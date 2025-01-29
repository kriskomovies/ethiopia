import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import IntegratedAppForm from '@/components/app-form/integrated-app-form';
import AppInput from '@/components/app-input/app-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '@/redux/features/app-state-slice';
import { useRegisterUserMutation } from '@/redux/services/users.service';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/store';

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export const schema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    referral: z.string().refine((val) => isValidObjectId(val), {
      message: 'Invalid referral ID',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type formValues = z.infer<typeof schema>;

const RegisterPage = (): ReactNode => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoggedIn } = useAppSelector((state) => state.appState);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  if (isLoggedIn) {
    router.push('/');
  }
  const refCode = router.query.referral;
  const defaultValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    referral: (refCode as string) || '',
  };

  const handleSubmit = async (submitValues: formValues) => {
    const result = await registerUser(submitValues);
    const { data, error } = result;
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to register user',
        description: `${error.data.message}`,
      });
    } else {
      const { message, user } = data;
      toast({
        title: `${message} ${user.username}`,
      });
      dispatch(setLoggedIn(user));
      await router.push('/');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full text-foreground">
      <Card className="w-full max-w-[350px] bg-[rgba(0,0,0,0.7)]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">
            Register
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
              <AppInput
                labelText="Password"
                labelId="password"
                name="password"
                placeholder="Password..."
                type="password"
                className="text-gray-400"
              />
              <AppInput
                labelText="Confirm Password"
                labelId="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password..."
                type="password"
                className="text-gray-400"
              />
              <AppInput
                labelText="Email"
                labelId="email"
                name="email"
                placeholder="Email..."
                className="text-gray-400"
              />
              <AppInput
                labelText="Phone number"
                labelId="phoneNumber"
                name="phoneNumber"
                placeholder="Phone number..."
                className="text-gray-400"
              />
              <AppInput
                labelText="Referral"
                labelId="referral"
                name="referral"
                placeholder="Referral..."
                className="text-gray-400"
              />
            </div>
            <CardFooter className="flex flex-col items-center">
              <Button type="submit" className="w-full">
                {isLoading ? 'Loading...' : 'Register'}
              </Button>
            </CardFooter>
          </IntegratedAppForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
