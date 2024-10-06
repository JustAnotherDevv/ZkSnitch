"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import {
  // useScaffoldContractRead,
  // useScaffoldContractWrite,
  // useScaffoldEventSubscriber,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const WhistleBlowerDashboard: React.FC = () => {
  const { address } = useAccount();
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [newDocProof, setNewDocProof] = useState("");
  const [organizationDetails, setOrganizationDetails] = useState([]);

  const { address: connectedAddress } = useAccount();

  // Read the total number of organizations
  const { data: organizationCount } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "organizationIdCounter",
  });

  // Read the user's organizations
  const { data: userOrgs } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "userOrganizations",
    args: [connectedAddress],
  });

  const { data: orgDetails, refetch: refetchOrgDetails } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "organizations",
    args: [0], // This will be updated in the effect
  });

  useEffect(() => {
    const fetchAllOrganizationDetails = async () => {
      if (organizationCount) {
        const count = parseInt(organizationCount.toString());
        const details = [];
        for (let i = 0; i < count; i++) {
          await refetchOrgDetails({ args: [i] });
          if (orgDetails) {
            details.push({ id: i, ...orgDetails });
          }
        }
        setOrganizationDetails(details);
      }
    };

    fetchAllOrganizationDetails();
  }, [organizationCount, refetchOrgDetails, orgDetails]);

  useEffect(() => {
    console.log("Total number of organizations:", organizationCount ? organizationCount.toString() : "0");
    console.log("List of organizations:", organizationDetails);
    console.log("User organizations:", userOrgs ? userOrgs.map(String) : []);
  }, [organizationCount, organizationDetails, userOrgs]);

  // useEffect(() => {
  //   const logOrganizationInfo = async () => {
  //     let orgDetails = null;
  //     if (organizationCount && organizationCount > 0) {
  //       orgDetails = await fetchOrganizationDetails();
  //     }

  //     console.log("Total number of organizations:", organizationCount ? organizationCount.toString() : "0");
  //     console.log("List of organizations:", orgDetails);
  //     console.log("User organizations:", userOrgs ? userOrgs.map(String) : []);
  //   };

  //   logOrganizationInfo();
  // }, [organizationCount, userOrgs, connectedAddress]);

  return (
    <div className="p-4">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Create New Organization</h2>
        <Input
          placeholder="Organization Name"
          value={newOrgName}
          onChange={e => setNewOrgName(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Organization Description"
          value={newOrgDescription}
          onChange={e => setNewOrgDescription(e.target.value)}
          className="mb-2"
        />
        <Button
        // onClick={handleCreateOrg}
        >
          Create Organization
        </Button>
      </div>
    </div>
  );
};

// const OrgCard: React.FC<{ orgId: number; onSelect: () => void; onJoin?: () => void }> = ({
//   orgId,
//   onSelect,
//   onJoin,
// }) => {
//   const { data: org } = useScaffoldContractRead({
//     contractName: "WhistleBlower",
//     functionName: "organizations",
//     args: [BigNumber.from(orgId)],
//   });

//   if (!org) return null;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{org[0]}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p>{org[1]}</p>
//         <div className="flex space-x-2 mt-2">
//           <Button onClick={onSelect}>Select</Button>
//           {onJoin && <Button onClick={onJoin}>Join</Button>}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const OrgDetails: React.FC<{ orgId: number }> = ({ orgId }) => {
//   const { data: documents } = useScaffoldContractRead({
//     contractName: "WhistleBlower",
//     functionName: "getDocuments",
//     args: [BigNumber.from(orgId), 0], // 0 for Active documents
//   });

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Documents</h3>
//       <ul>
//         {documents?.map((docId, index) => (
//           <li key={index}>Document ID: {docId.toString()}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

export default WhistleBlowerDashboard;
