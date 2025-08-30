import { useCreateContactUsMutation } from "@/api/public/publicContactUsApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactUsRequest } from "@/types/requestTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod/v3";

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactUs({
  title = "Contact Us",
  description = "We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!",
  phone = "123-4567-7584",
  email = "email@hotel.com",
  web = { label: "google.com", url: "https://google.com" },
}: Contact2Props) {
  const navigate = useNavigate();
  const [createContactUs, { isLoading, isError, error }] =
    useCreateContactUsMutation();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function handleFormSubmit(data: ContactFormValues) {
    try {
      const contactUsRequest: ContactUsRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      };
      await createContactUs(contactUsRequest).unwrap();
      alert("Your message has been sent! We will send you an email shortly");
    } catch (error) {
      console.log("Error creating the message", error);
      alert("Error creating message");
    }
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                Contact Details
              </h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-bold">Phone: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-bold">Email: </span>
                  <a href={`mailto:${email}`} className="underline">
                    {email}
                  </a>
                </li>
                <li>
                  <span className="font-bold">Web: </span>
                  <a href={web.url} target="_blank" className="underline">
                    {web.label}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <div className="grid w-full items-center gap-1.5">
                        <FormLabel htmlFor="firstname">First Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="firstname"
                            placeholder="First Name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <div className="grid w-full items-center gap-1.5">
                        <FormLabel htmlFor="lastname">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="lastname"
                            placeholder="Last Name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid w-full items-center gap-1.5">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <div className="grid w-full items-center gap-1.5">
                      <FormLabel htmlFor="subject">Subject</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="subject"
                          placeholder="Subject"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <div className="grid w-full gap-1.5">
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here."
                          id="message"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
