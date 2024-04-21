"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/hooks";

import { createPollThunk } from "@/redux/polls/polls-operations";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "@/schemas";

import Link from "next/link";

import VotesRange from "./votes-range";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

const CreatePollForm = () => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof createPollSchema>>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      topic: "",
      name: "",
      maxVotes: 3,
    },
  });

  const onSubmit = (values: z.infer<typeof createPollSchema>) => {
    startTransition(() => {
      dispatch(createPollThunk(values))
        .then(() => {
          toast.success("Poll was created");
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
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter poll topic..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxVotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votes</FormLabel>
              <FormControl>
                <VotesRange
                  min={1}
                  max={5}
                  step={1}
                  initial={3}
                  onChange={(val: number) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
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
            Create
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

export default CreatePollForm;
