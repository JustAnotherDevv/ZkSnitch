"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Config,
  Environment,
  MetaMaskWallet,
  PinataStorage,
  SecretDocumentClient,
} from "@secret-network/share-document";
import { useForm } from "react-hook-form";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
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
  const { address } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<SecretDocumentClient>();
  const [userFiles, setUserFiles] = useState([]);
  const [downloadFileId, setDownloadFileId] = useState("");
  const [shareFileId, setShareFileId] = useState("");
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

  useEffect(() => {
    const initializeClient = async () => {
      if (!walletClient) return;

      //   const config = new Config({ env: Environment.MAINNET });
      console.log(Environment.MAINNET);
      const config = new Config({ env: Environment.MAINNET });
      config.useEvmWallet({ client: walletClient });
      console.log("config: ", config, ` => \n `, config.config.storage, ` -> `, Object.keys(config.config));

      const sepoliaConfig = { ...config };

      console.log("sepolia config: ", sepoliaConfig);

      const wallet = await MetaMaskWallet.create(window.ethereum, address || "");
      config.useSecretWallet(wallet);

      const gateway = process.env.NEXT_PUBLIC_GATEWAY;
      const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

      const pinataStorage = new PinataStorage(gateway, accessToken);
      config.useStorage(pinataStorage);

      const secretClient = new SecretDocumentClient(config);
      setClient(secretClient);
      console.log("client: ", secretClient);
    };

    initializeClient();
  }, [walletClient, address]);

  const storeFile = async () => {
    if (!client) {
      console.error("Client is not initialized");
      return;
    }
    try {
      const file = new File(["Hello, world!"], "hello.txt", { type: "text/plain" });
      const res = await client.storeDocument().fromFile(file);
      console.log("File stored successfully:", res);
    } catch (error) {
      console.error("Error storing file:", error);
    }
  };

  const viewFile = async () => {
    if (!client) {
      console.error("Client is not initialized");
      return;
    }
    try {
      const res = await client.viewDocument().getAllFileIds();
      console.log("File viewed successfully:", res);
      setUserFiles(res);
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  const downloadFile = async (fileId: string) => {
    if (!client) {
      console.error("Client is not initialized");
      return;
    }
    try {
      const uint8Array = await client.viewDocument().download(fileId);

      const textDecoder = new TextDecoder("utf-8");
      const textContent = textDecoder.decode(uint8Array);
      console.log("File content:", textContent);

      // Convert Uint8Array to Blob
      const blob = new Blob([uint8Array], { type: "application/octet-stream" });

      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downloaded_file"; // Set the desired file name here

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // const downloadFile = async (fileId: string) => {
  //   if (!client) {
  //     console.error("Client is not initialized");
  //     return;
  //   }
  //   try {
  //     console.log(fileId);
  //     const uint8Array = await client.viewDocument().download(fileId);

  //     // Convert Uint8Array to Blob
  //     const blob = new Blob([uint8Array], { type: "application/octet-stream" });

  //     // Create a URL for the blob
  //     const url = URL.createObjectURL(blob);

  //     // Create a link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `file_${fileId}`; // Set the desired file name here

  //     // Append the link to the body
  //     document.body.appendChild(link);

  //     // Programmatically click the link to trigger the download
  //     link.click();

  //     // Clean up
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);

  //     console.log("File downloaded successfully");
  //   } catch (error) {
  //     console.error("Error downloading file:", error instanceof Error ? error.message : String(error));
  //   }
  // };

  const shareFile = async (fileId: string, secretAddress: string) => {
    if (!client) {
      console.error("Client is not initialized");
      return;
    }
    try {
      const shareDocument = client.shareDocument(fileId);

      // Get existing file access
      // const fileAccess = await shareDocument.getFileAccess();
      // console.log('Existing file access:', fileAccess);

      // Share viewing access to a file
      const addViewingRes = await shareDocument.addViewing([secretAddress]);
      console.log("Viewing access added:", addViewingRes);

      // Delete viewing access to a file
      // const deleteViewingRes = await shareDocument.deleteViewing([secretAddress]);
      // console.log('Viewing access deleted:', deleteViewingRes);

      // Transfer the ownership
      // const changeOwnerRes = await shareDocument.changeOwner(secretAddress);
      // console.log('Ownership transferred:', changeOwnerRes);

      // All in one share operation
      const shareRes = await shareDocument.share({
        // changeOwner: secretAddress,
        addViewing: [secretAddress],
        // deleteViewing: [secretAddress],
      });
      console.log("All-in-one share operation completed:", shareRes);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  //   const { writeAsync: joinOrg } = useScaffoldWriteContract({
  //     contractName: "WhistleBlower",
  //     functionName: "joinOrganization",
  //     args: [BigNumber.from(0)],
  //   });

  //   const handleJoinOrg = async (orgId: number) => {
  //     await joinOrg({ args: [BigNumber.from(orgId)] });
  //   };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const file = new File([`${values.title}`], "submission.txt", { type: "text/plain" });
    const res = await client.storeDocument().fromFile(file);
    console.log("File stored successfully:", res);
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
                    <SelectItem value="1">TechCorp Inc.</SelectItem>
                    <SelectItem value="2">EcoSolutions Ltd.</SelectItem>
                    <SelectItem value="3">HealthCare Systems</SelectItem>
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
