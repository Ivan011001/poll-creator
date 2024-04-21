"use client";

import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "@/schemas";

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
import VotesRange from "./votes-range";

const CreatePollForm = () => {
  const form = useForm<z.infer<typeof createPollSchema>>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      topic: "",
      name: "",
      maxVotes: 3,
    },
  });

  const onSubmit = (values: z.infer<typeof createPollSchema>) => {
    console.log(values);
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
                <Input placeholder="Enter poll topic..." {...field} />
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
                <Input placeholder="Enter your name..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" size="lg">
            Create
          </Button>

          <Button type="submit" size="lg" variant="outline">
            Start Over
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePollForm;
