"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
// import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileSymlink,
  FileText,
  Lock,
  Tag,
  Unlock,
} from "lucide-react";

// import { Link, useParams } from "react-router-dom";

// Mock data for the organization
const organizationData = {
  id: 1,
  name: "TechCorp Inc.",
  reviewerAddress: "reviewer@techcorp.com",
  submissions: [
    {
      id: 1,
      title: "Financial Misconduct Report",
      status: "Pending",
      submitter: "Anonymous",
      date: "2023-04-01",
      description: "Suspected misuse of company funds for personal expenses.",
      category: "Financial",
      evidence: "expense_report.pdf",
    },
    {
      id: 2,
      title: "Ethical Violation Complaint",
      status: "Under Review",
      submitter: "John Doe",
      date: "2023-04-05",
      description: "Manager pressuring employees to falsify timesheets.",
      category: "Ethical",
      evidence: "email_screenshots.zip",
    },
    {
      id: 3,
      title: "Safety Concern Report",
      status: "Resolved",
      submitter: "Anonymous",
      date: "2023-04-10",
      description: "Faulty equipment in the manufacturing department posing risk to workers.",
      category: "Safety",
      evidence: "safety_inspection_report.docx",
    },
  ],
};

export default function Id({ params }: { params: { id: string } }) {
  // const { id } = useParams<{ id: string }>();
  const { id } = params;
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // In a real application, you would fetch the organization data based on the id
  const organization = organizationData;

  const handleViewSubmission = submission => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const handleStatusChange = newStatus => {
    // In a real application, you would update the status in your backend
    console.log(`Updating status for submission ${selectedSubmission.id} to ${newStatus}`);
    setSelectedSubmission({ ...selectedSubmission, status: newStatus });
  };

  const getStatusIcon = status => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Under Review":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Under Review":
        return "bg-blue-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8 md:p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {organization.name}
          </h1>
          <p className="text-xl mb-6 max-w-2xl">
            Secure whistleblowing platform for {organization.name}. Your voice matters, your identity is protected.
          </p>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm py-1 px-2">
              <FileText className="w-4 h-4 mr-1" />
              {organization.submissions.length} Reports
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-2">
              <Eye className="w-4 h-4 mr-1" />
              Reviewer: {organization.reviewerAddress}
            </Badge>
          </div>
        </div>
      </section>

      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Submitted Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Submitter</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization.submissions.map(submission => (
                <TableRow key={submission.id} className="border-b border-gray-700">
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.status)}
                      <span>{submission.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{submission.submitter}</TableCell>
                  <TableCell>{submission.date}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewSubmission(submission)} variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-indigo-900 text-white border border-indigo-500 shadow-lg shadow-indigo-500/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {selectedSubmission?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Submitter</p>
                  <div className="flex items-center space-x-2">
                    {selectedSubmission.submitter === "Anonymous" ? (
                      <Lock className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-400" />
                    )}
                    <span>{selectedSubmission.submitter}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Date</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{selectedSubmission.date}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Status</p>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedSubmission.status)}`}></span>
                  <span>{selectedSubmission.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Category</p>
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-pink-400" />
                  <span>{selectedSubmission.category}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Description</p>
                <p className="bg-black bg-opacity-30 p-3 rounded-md">{selectedSubmission.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Evidence</p>
                <div className="flex items-center space-x-2">
                  <FileSymlink className="w-4 h-4 text-green-400" />
                  <span>{selectedSubmission.evidence}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                  Change Status
                </label>
                <Select onValueChange={handleStatusChange} defaultValue={selectedSubmission.status}>
                  <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="secondary"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center">
        <Link href={`/create/${id}`}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Submit New Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
