import React, { useEffect } from 'react';
import { FieldValues, useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormContext } from '@/components/app-form/form-context-provider';
import { ZodType } from 'zod';

interface IntegratedAppFormProps<TFieldValues extends FieldValues> {
  children: React.ReactNode;
  defaultValues: UseFormProps<TFieldValues>['defaultValues'];
  onSubmit: (values: TFieldValues, reset?: any) => void;
  schema: ZodType<TFieldValues>;
  resetFormOnSubmit?: boolean;
}

export function IntegratedAppForm<TFieldValues extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
  schema,
}: IntegratedAppFormProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues as any);
  }, [form, defaultValues]);

  return (
    <FormContext.Provider value={{ form } as any}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            onSubmit(values, form.reset(defaultValues as any)),
          )}
          className="space-y-8"
          autoComplete="off"
        >
          {children}
        </form>
      </Form>
    </FormContext.Provider>
  );
}

export default IntegratedAppForm;
