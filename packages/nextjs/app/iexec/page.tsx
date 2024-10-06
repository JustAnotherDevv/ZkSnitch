"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Config,
  Environment,
  MetaMaskWallet,
  PinataStorage,
  SecretDocumentClient,
} from "@secret-network/share-document";
import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";

// @ts-nocheck

const Snitch: NextPage = () => {
  const { address } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<SecretDocumentClient>();
  const [downloadFileId, setDownloadFileId] = useState("");
  const [shareFileId, setShareFileId] = useState("");
  const [secretAddress, setSecretAddress] = useState("");

  useEffect(() => {
    const initializeClient = async () => {
      if (!walletClient) return;

      //   const config = new Config({ env: Environment.MAINNET });
      console.log(Environment.MAINNET);

      // const sepoliaEnvironment = {
      //   config: {
      //     chains: {
      //       polygon: {
      //         chainId: "11155111",
      //       },
      //       secretNetwork: Environment.MAINNET.config.chains.secretNetwork,
      //     },
      //     contracts: {
      //       PolygonToSecret: {
      //         abi: Environment.MAINNET.config.contracts.PolygonToSecret.abi,
      //         address: "0xea433Ed8CD2eB745340Cd5387918d40FD48cF809"
      //       },
      //       ShareDocument: Environment.MAINNET.config.contracts.ShareDocuments,
      //     },
      //   },
      //   env: "testnet",
      // };
      const config = new Config({ env: Environment.MAINNET });
      config.useEvmWallet({ client: walletClient });
      console.log("config: ", config, ` => \n `, config.config.storage, ` -> `, Object.keys(config.config));

      // const sepoliaConfig = {
      //   config: {
      //     chains: {
      //       polygon: {
      //         chainId: "11155111",
      //       },
      //       secretNetwork: config.config.chains.secretNetwork,
      //     },
      //     contracts: {
      //       PolygonToSecret: {
      //         abi: config.config.contracts.PolygonToSecret.abi,
      //         address: "0xea433Ed8CD2eB745340Cd5387918d40FD48cF809",
      //       },
      //       ShareDocument: config.config.contracts.ShareDocuments,
      //     },
      //     storage: config.config.storage,
      //     wallets: config.config.wallet,
      //   },
      //   env: "testnet",
      // };

      const sepoliaConfig = { ...config };

      console.log("sepolia config: ", sepoliaConfig);

      const wallet = await MetaMaskWallet.create(window.ethereum, address || "");
      config.useSecretWallet(wallet);

      const gateway = "crimson-elated-impala-503.mypinata.cloud";
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZjQ3NzVjMC0zYzQ1LTQ1MGEtYTZkMS1mNzEwZWE5ZDhiMDEiLCJlbWFpbCI6ImFub3RoZXJkZXZ2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhMjM3ZTE0ZmRmMTlkYzlmNWM2NyIsInNjb3BlZEtleVNlY3JldCI6IjkwMWM3YTI4MjU1ZDk4MWEyZWE0OTgyYTNkZjI1OTJlZGQwZmZiYTU5ODgwOWQ1OTYyMTlkNjhlNDA4MWMzZjMiLCJleHAiOjE3NTk2MDQxMjZ9.aAMsGj2Yi0y267SCBWdgOxqygHlhugPJ5yDDXieJbAc";

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

  return (
    <div className="w-screen h-screen bg-gray-800">
      <div className="w-full mx-auto flex flex-col">
        <Button onClick={storeFile}>Add File</Button>
        <Button onClick={viewFile}>View File</Button>
        <Button>Download File</Button>
        <Button onClick={shareFile}>Share File</Button>
      </div>
    </div>
  );
};

export default Snitch;
