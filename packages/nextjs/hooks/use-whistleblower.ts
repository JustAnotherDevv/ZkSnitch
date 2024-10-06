import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useWhistleBlower = () => {
  // Write functions
  const { writeAsync: createOrganization, isLoading: isCreatingOrg } = useScaffoldWriteContract({
    contractName: "WhistleBlower",
    functionName: "createOrganization",
    args: [""],
  });

  const { writeAsync: joinOrganization, isLoading: isJoiningOrg } = useScaffoldWriteContract({
    contractName: "WhistleBlower",
    functionName: "joinOrganization",
    args: [0],
  });

  const { writeAsync: submitDocument, isLoading: isSubmittingDoc } = useScaffoldWriteContract({
    contractName: "WhistleBlower",
    functionName: "submitDocument",
    args: [0, "0x0000000000000000000000000000000000000000000000000000000000000000", "", ""],
  });

  const { writeAsync: changeSubmissionStatus, isLoading: isChangingStatus } = useScaffoldWriteContract({
    contractName: "WhistleBlower",
    functionName: "changeSubmissionStatus",
    args: [0, 0, 0],
  });

  // Read functions
  const { data: organizationCounter } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "organizationCounter",
  });

  const { data: organizationInfo, refetch: refetchOrgInfo } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "getOrganizationInfo",
    args: [0],
  });

  const { data: isOrgMember, refetch: refetchMembership } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "isOrganizationMember",
    args: [0, "0x0000000000000000000000000000000000000000"],
  });

  const { data: submission, refetch: refetchSubmission } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "getSubmission",
    args: [0, 0],
  });

  const { data: submissionCount, refetch: refetchSubmissionCount } = useScaffoldReadContract({
    contractName: "WhistleBlower",
    functionName: "getSubmissionCount",
    args: [0],
  });

  // Helper functions to wrap the contract interactions
  const createNewOrganization = async name => {
    return createOrganization({ args: [name] });
  };

  const joinExistingOrganization = async orgId => {
    return joinOrganization({ args: [orgId] });
  };

  const submitNewDocument = async (orgId, documentHash, category, identity) => {
    return submitDocument({ args: [orgId, documentHash, category, identity] });
  };

  const updateSubmissionStatus = async (orgId, submissionId, newStatus) => {
    return changeSubmissionStatus({ args: [orgId, submissionId, newStatus] });
  };

  const getOrganizationInfo = async orgId => {
    await refetchOrgInfo({ args: [orgId] });
    return organizationInfo;
  };

  const checkOrganizationMembership = async (orgId, address) => {
    await refetchMembership({ args: [orgId, address] });
    return isOrgMember;
  };

  const getSubmission = async (orgId, submissionId) => {
    await refetchSubmission({ args: [orgId, submissionId] });
    return submission;
  };

  const getSubmissionCount = async orgId => {
    await refetchSubmissionCount({ args: [orgId] });
    return submissionCount;
  };

  return {
    createNewOrganization,
    joinExistingOrganization,
    submitNewDocument,
    updateSubmissionStatus,
    getOrganizationInfo,
    checkOrganizationMembership,
    getSubmission,
    getSubmissionCount,
    organizationCounter,
    isCreatingOrg,
    isJoiningOrg,
    isSubmittingDoc,
    isChangingStatus,
  };
};
