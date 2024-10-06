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
  const [userFiles, setUserFiles] = useState([]);
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

  return (
    <div className="w-screen h-screen bg-gray-800">
      <div className="w-full mx-auto flex flex-col">
        <Button onClick={storeFile}>Add File</Button>
        <Button onClick={viewFile}>View File</Button>
        <Button onClick={() => downloadFile(userFiles[0])}>Download File</Button>
        <Button onClick={() => shareFile(userFiles[0], "secret1r4ucam2v3y73j4n44856jjfelx4qz2v2vavjzl")}>
          Share File
        </Button>
      </div>
    </div>
  );
};

export default Snitch;
