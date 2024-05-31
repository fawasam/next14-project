"use client";
import React, { useState } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/Validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "../ui/use-toast";

interface ProfileFormProps {
  clerkId: string;
  user: string;
}

const ProfileForm = ({ clerkId, user }: ProfileFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const parsedUser = JSON.parse(user || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfoliowebsite: parsedUser.portfoliowebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfoliowebsite: values.portfoliowebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (error) {
      console.log(error);
      return toast({
        title: `something went wrong please try again`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" mt-9 flex w-full flex-col gap-9"
      >
        {/* name field  */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="no-focus paragraph-regular light-border-2
                background-light700_dark300 text-dark300_light700 min-h-[56px] border
                "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* username field  */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  className="no-focus paragraph-regular light-border-2
                background-light700_dark300 text-dark300_light700 min-h-[56px] border
                "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* portfolioWebsite field  */}
        <FormField
          control={form.control}
          name="portfoliowebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Portfolio Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  className="no-focus paragraph-regular light-border-2
                background-light700_dark300 text-dark300_light700 min-h-[56px] border
                "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* location field  */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2
                background-light700_dark300 text-dark300_light700 min-h-[56px] border
                "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* bio field  */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Where special about you?"
                  className="no-focus paragraph-regular light-border-2
                background-light700_dark300 text-dark300_light700 min-h-[56px] border
                "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
