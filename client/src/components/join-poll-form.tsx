"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/hooks";

import { joinPollThunk } from "@/redux/polls/polls-operations";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinPollSchema } from "@/schemas";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { toast } from "sonner";

const JoinPollForm = () => {
  const { replace } = useRouter();

  const [isPending, startTransition] = useTransition();

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof joinPollSchema>>({
    resolver: zodResolver(joinPollSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof joinPollSchema>) => {
    startTransition(() => {
      dispatch(joinPollThunk(values))
        .then((data: any) => {
          if (data.payload.error) {
            toast.error("Invalid code");
            return;
          }

          toast.success("You have joined the poll");
          replace("/waiting");
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[400px] space-y-6"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup className="uppercase">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter your name..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit" size="lg" disabled={isPending}>
            Join
          </Button>

          <Button
            type="submit"
            size="lg"
            variant="outline"
            asChild
            disabled={isPending}
          >
            <Link href="/">Start Over</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JoinPollForm;
