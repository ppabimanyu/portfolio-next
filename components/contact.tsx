"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import PlainCard from "./plain-card";
import Link from "next/link";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PrimaryButton from "./primary-button";
import { profileData } from "@/lib/data";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email-sender";
import { toast } from "sonner";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  message: z.string(),
});

export default function Contact() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validators: {
      onMount: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await sendContactEmail({
        name: value.name,
        email: value.email,
        message: value.message,
      });
      form.reset();
      toast("Message sent successfully");
    },
  });
  return (
    <PlainCard
      id="contact"
      className="w-full flex flex-col md:flex-row gap-6 justify-between items-start"
    >
      <div className="space-y-4">
        <h2 className="uppercase text-sm text-muted-foreground">Contact</h2>
        <div className="space-y-2">
          <h2 className="text-md font-semibold">{"Let's build what's next"}</h2>
          <p className="text-sm text-muted-foreground">
            {
              "I'm always open to new opportunities. Whether you have a question or want to collaborate on a project, feel free to reach out."
            }
          </p>
        </div>
        <div className="space-y-1">
          <div className="text-sm flex gap-2 items-center">
            <span>Email </span>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <Link
              href={`mailto:${profileData.email}`}
              className="hover:underline text-primary"
            >
              {profileData.email}
            </Link>
          </div>
          <div className="text-sm flex gap-2 items-center">
            <span>Location </span>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span className="text-muted-foreground">
              {profileData.location}
            </span>
          </div>
          <div className="flex gap-2 items-center mt-6">
            <span className="text-sm">Socials</span>
            <div className="h-1 w-1 bg-muted-foreground rounded-full" />
            <div className="flex gap-2">
              <Link
                href={profileData.linkedIn}
                className="text-sm hover:underline text-primary"
              >
                LinkedIn
              </Link>
              <Link
                href={profileData.github}
                className="text-sm hover:underline text-primary flex gap-1 items-center"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldTitle>A short note is all takes to start.</FieldTitle>
            <FieldGroup>
              <div className="flex flex-col md:flex-row gap-2">
                <form.Field name="name">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:border-primary/30 focus-visible:inset-shadow-sm focus-visible:inset-shadow-primary/30"
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        placeholder="john.doe@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:border-primary/30 focus-visible:inset-shadow-sm focus-visible:inset-shadow-primary/30"
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
              <form.Field name="message">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="message">
                      What would you like to work on?
                    </FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:border-primary/30 focus-visible:inset-shadow-sm focus-visible:inset-shadow-primary/30"
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Replies within 1-2 business days. Happy to sign an NDA.
              </p>
              <form.Subscribe selector={(state) => [state.canSubmit]}>
                {([canSubmit]) => (
                  <PrimaryButton disabled={!canSubmit}>
                    <Send size={16} /> Send Note
                  </PrimaryButton>
                )}
              </form.Subscribe>
            </div>
          </FieldSet>
        </form>
      </div>
    </PlainCard>
  );
}
