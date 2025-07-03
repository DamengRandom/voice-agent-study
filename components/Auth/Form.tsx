'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Field from "./Field";
import { useRouter } from "next/navigation";

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: FormType) => z.object({
  ...(type === 'sign-up' && { name: z.string().min(2).max(50) }),
  email: z.string().email(),
  password: z.string().min(3),
});

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignInPage = type === 'sign-in';
  const router = useRouter();
  const formSchema = authFormSchema(type); // define this is for avoid line 24, 25 type warnings
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isSignInPage) {
        toast.success('Sign in successfully');
        router.push('/');
        console.info('sign in:', values); // @To be removed
      } else {
        toast.success('Account created successfully. Please sign in to start the practice.');
        router.push('/sign-in');
        console.info('sign up:', values); // @To be removed
      }
    } catch (error) {
      toast.error(`Error on submit form: ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo image" height={32} width={38} />
          <h2 className="text-primary-100">TS/JS Interviewer</h2>
        </div>
        <h3>Practice Job Interviews with AI bot</h3>
        {/* Auth form section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignInPage && <Field name="name" control={form.control} label="Name" placeholder="Please enter your name" type="text" />}
            <Field name="email" control={form.control} label="Email" placeholder="Please enter your email" type="email" />
            <Field name="password" control={form.control} label="Password" placeholder="Please enter your password" type="password" />
            <Button className="btn" type="submit">{isSignInPage ? 'Sign In' : 'Sign Up'}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignInPage ? 'Don\'t have an account yet?' : 'Already have an account?'}
          <Link href={isSignInPage ? '/sign-up' : '/sign-in'} className="font-bold text-user-primary ml-1">
            {isSignInPage ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm;
