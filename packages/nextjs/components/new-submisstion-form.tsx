import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const formSchema = z.object({
  org: z.string().min(1, {
    message: "org must be selected.",
  }),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  evidence: z.string().optional(),
  anonymous: z.boolean().default(false),
});

export function NewSubmissionForm(props: any) {
  console.log(props.id);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: props.id || "",
      title: "",
      description: "",
      category: "",
      evidence: "",
      anonymous: false,
    },
  });

  //   const { writeAsync: joinOrg } = useScaffoldWriteContract({
  //     contractName: "WhistleBlower",
  //     functionName: "joinOrganization",
  //     args: [BigNumber.from(0)],
  //   });

  //   const handleJoinOrg = async (orgId: number) => {
  //     await joinOrg({ args: [BigNumber.from(orgId)] });
  //   };

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Submission Received",
      description: "Your whistleblower report has been submitted successfully.",
    });
  }

  return (
    <div className="text-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="org"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">a</SelectItem>
                    <SelectItem value="2">b</SelectItem>
                    <SelectItem value="3">c</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Provide a concise title for your whistleblower report.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brief title of your report" {...field} />
                </FormControl>
                <FormDescription>Provide a concise title for your whistleblower report.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the incident or concern"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed account of the incident or concern you're reporting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category for your report" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="financial">Financial Misconduct</SelectItem>
                    <SelectItem value="ethical">Ethical Violations</SelectItem>
                    <SelectItem value="safety">Safety Concerns</SelectItem>
                    <SelectItem value="discrimination">Discrimination or Harassment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose the category that best fits your report.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="evidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence Upload</FormLabel>
                <FormControl>
                  <Input type="file" {...field} value={undefined} onChange={e => field.onChange(e.target.files?.[0])} />
                </FormControl>
                <FormDescription>Upload any relevant documents or evidence (optional).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Anonymous Submission</FormLabel>
                  <FormDescription>Submit this report anonymously. Your identity will not be recorded.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit Report</Button>
        </form>
      </Form>
    </div>
  );
}
