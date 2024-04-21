"use client";

import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinPollSchema } from "@/schemas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const JoinPollForm = () => {
  const form = useForm<z.infer<typeof joinPollSchema>>({
    resolver: zodResolver(joinPollSchema),
    defaultValues: {
      name: "",
      pollID: "",
    },
  });

  const onSubmit = (values: z.infer<typeof joinPollSchema>) => {
    console.log(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[400px] space-y-6"
      >
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

        <Button type="submit" size="lg">
          Join
        </Button>
      </form>
    </Form>
  );
};

export default JoinPollForm;
