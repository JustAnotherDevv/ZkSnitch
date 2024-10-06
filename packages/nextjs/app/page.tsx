"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Moon, Shield } from "lucide-react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useWhistleBlower } from "~~/hooks/use-whistleblower";

const availableOrganizations = [
  { id: 1, name: "TechCorp Inc." },
  { id: 2, name: "EcoSolutions Ltd." },
  { id: 3, name: "HealthCare Systems" },
];

const userOrganizations = [
  { id: 101, name: "Local Government" },
  { id: 102, name: "Education Board" },
];

export default function HomePage() {
  const [newOrgName, setNewOrgName] = useState("");
  const [organization, setOrganizations] = useState("");
  const { getOrganizationInfo, createNewOrganization } = useWhistleBlower();
  const { data: organizationCount } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "organizationCounter",
  });

  const handleAddOrganization = async () => {
    // Here you would typically send a request to your backend to add the new organization
    console.log("Adding new organization:", newOrgName);
    // setNewOrgName("");
    await createNewOrganization(newOrgName);
    setNewOrgName("");
    // Refresh organizations list
    const orgCount = (await organizationCount.toString()).toNumber();
    const newOrg = await getOrganizationInfo(orgCount);
    setNewOrgName([...organizations, newOrg]);
    // You might want to update the list of user organizations here
  };

  return (
    <div className="space-y-8 ">
      {/* <section>
        <h1 className="text-4xl font-bold mb-4">Welcome to the Whistleblower Platform</h1>
        <p className="text-xl mb-4">
          Our platform provides a secure and anonymous way to report misconduct, ethical violations, and other concerns
          within organizations.
        </p>
        <Link href="/create">
          <Button className=" font-bold" variant="outline">
            Submit a Report
          </Button>
        </Link>
      </section> */}

      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-8 md:p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Cypherpunk Whistleblower
            </h1>
            <p className="text-xl mb-6 max-w-2xl">
              Secure, anonymous reporting in a world of digital shadows. Illuminate the truth without revealing your
              identity.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Submit a Report
              </Button>
            </Link>
          </div>
          <div className="flex space-x-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-purple-800 rounded-full flex items-center justify-center">
              <Moon className="w-8 h-8 md:w-12 md:h-12 text-purple-300" />
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-800 rounded-full flex items-center justify-center">
              <Key className="w-8 h-8 md:w-12 md:h-12 text-indigo-300" />
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-800 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 md:w-12 md:h-12 text-blue-300" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {/* {JSON.parse(organizationCount?.toString())} */}
          Available Organizations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableOrganizations?.map(org => (
            <Card key={org.id} className="border-gray-900 border-2 text-gray-200">
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/org/${org.id}`}>
                  <Button className=" font-bold" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userOrganizations.map(org => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <Button variant="outline">Manage</Button> */}
                <Link href={`/org/${org.id}`}>
                  <Button className=" font-bold" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Dialog>
          <DialogTrigger asChild>
            <Button className=" font-bold" variant="outline">
              Add New Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>Enter the details of the new organization you want to add.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className=" font-bold" variant="outline" type="submit" onClick={handleAddOrganization}>
                Add Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
