// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhistleBlower {
    address public reviewer;
    uint256 public organizationCounter;

    struct Organization {
        string name;
        address owner;
        mapping(address => bool) members;
    }

    struct Submission {
        bytes32 documentHash;
        string category;
        string identity;
        SubmissionStatus status;
    }

    enum SubmissionStatus { Pending, Approved, Rejected }

    mapping(uint256 => Organization) public organizations;
    mapping(uint256 => Submission[]) public submissions;

    event OrganizationCreated(uint256 indexed orgId, string name, address owner);
    event UserJoined(uint256 indexed orgId, address user);
    event SubmissionAdded(uint256 indexed orgId, uint256 submissionId, bytes32 documentHash);
    event SubmissionStatusChanged(uint256 indexed orgId, uint256 submissionId, SubmissionStatus newStatus);

    constructor() {
        reviewer = msg.sender;
        organizationCounter = 0; // Initialize the counter
    }

    modifier onlyReviewer() {
        require(msg.sender == reviewer, "Only the reviewer can perform this action");
        _;
    }

    modifier onlyOrganizationOwner(uint256 _orgId) {
        require(msg.sender == organizations[_orgId].owner, "Only the organization owner can perform this action");
        _;
    }

    modifier onlyOrganizationMember(uint256 _orgId) {
        require(organizations[_orgId].members[msg.sender], "Only organization members can perform this action");
        _;
    }

    function createOrganization(string memory _name) external {
        organizationCounter++;
        uint256 orgId = organizationCounter;

        Organization storage newOrg = organizations[orgId];
        newOrg.name = _name;
        newOrg.owner = msg.sender;
        newOrg.members[msg.sender] = true;

        emit OrganizationCreated(orgId, _name, msg.sender);
    }

    function joinOrganization(uint256 _orgId) external {
        require(_orgId > 0 && _orgId <= organizationCounter, "Invalid organization ID");
        require(!organizations[_orgId].members[msg.sender], "Already a member of this organization");

        organizations[_orgId].members[msg.sender] = true;
        emit UserJoined(_orgId, msg.sender);
    }

    function submitDocument(uint256 _orgId, bytes32 _documentHash, string memory _category, string memory _identity) external onlyOrganizationMember(_orgId) {
        Submission memory newSubmission = Submission({
            documentHash: _documentHash,
            category: _category,
            identity: _identity,
            status: SubmissionStatus.Pending
        });

        submissions[_orgId].push(newSubmission);
        emit SubmissionAdded(_orgId, submissions[_orgId].length - 1, _documentHash);
    }

    function changeSubmissionStatus(uint256 _orgId, uint256 _submissionId, SubmissionStatus _newStatus) external onlyOrganizationOwner(_orgId) {
        require(_submissionId < submissions[_orgId].length, "Invalid submission ID");
        
        submissions[_orgId][_submissionId].status = _newStatus;
        emit SubmissionStatusChanged(_orgId, _submissionId, _newStatus);
    }

    function getOrganizationInfo(uint256 _orgId) external view returns (string memory name, address owner) {
        require(_orgId > 0 && _orgId <= organizationCounter, "Invalid organization ID");
        Organization storage org = organizations[_orgId];
        return (org.name, org.owner);
    }

    function isOrganizationMember(uint256 _orgId, address _user) external view returns (bool) {
        return organizations[_orgId].members[_user];
    }

    function getSubmission(uint256 _orgId, uint256 _submissionId) external view returns (bytes32 documentHash, string memory category, string memory identity, SubmissionStatus status) {
        require(_submissionId < submissions[_orgId].length, "Invalid submission ID");
        Submission storage sub = submissions[_orgId][_submissionId];
        return (sub.documentHash, sub.category, sub.identity, sub.status);
    }

    function getSubmissionCount(uint256 _orgId) external view returns (uint256) {
        return submissions[_orgId].length;
    }

    function changeReviewer(address _newReviewer) external onlyReviewer {
        reviewer = _newReviewer;
    }
}