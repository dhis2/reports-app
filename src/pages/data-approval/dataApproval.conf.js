export const DataApprovalStatusEnum = {
    NONE: 'NONE',
    UNAPPROVABLE: 'UNAPPROVABLE',
    UNAPPROVED_ABOVE: 'UNAPPROVED_ABOVE',
    UNAPPROVED_WAITING: 'UNAPPROVED_WAITING',
    UNAPPROVED_ELSEWHERE: 'UNAPPROVED_ELSEWHERE',
    UNAPPROVED_READY: 'UNAPPROVED_READY',
    PARTIALLY_APPROVED_HERE: 'PARTIALLY_APPROVED_HERE',
    APPROVED_ABOVE: 'APPROVED_ABOVE',
    APPROVED_HERE: 'APPROVED_HERE',
    PARTIALLY_APPROVED_ELSEWHERE: 'PARTIALLY_APPROVED_ELSEWHERE',
    APPROVED_ELSEWHERE: 'APPROVED_ELSEWHERE',
    PARTIALLY_ACCEPTED_HERE: 'PARTIALLY_ACCEPTED_HERE',
    ACCEPTED_HERE: 'ACCEPTED_HERE',
    PARTIALLY_ACCEPTED_ELSEWHERE: 'PARTIALLY_ACCEPTED_ELSEWHERE',
    ACCEPTED_ELSEWHERE: 'ACCEPTED_ELSEWHERE',
};

export const DataApprovalActionsEnum = {
    APPROVE: 'APPROVE',
    UNAPPROVE: 'UNAPPROVE',
    ACCEPT: 'ACCEPT',
    UNACCEPT: 'UNACCEPT',
};

const FOR_APPROVE_STATUS = [
    DataApprovalStatusEnum.UNAPPROVED_READY,
    DataApprovalStatusEnum.PARTIALLY_APPROVED_HERE,
];

const FOR_UNAPPROVE_STATUS = [
    DataApprovalStatusEnum.PARTIALLY_APPROVED_HERE,
    DataApprovalStatusEnum.APPROVED_HERE,
    DataApprovalStatusEnum.PARTIALLY_ACCEPTED_HERE,
    DataApprovalStatusEnum.ACCEPTED_HERE,
];

const FOR_ACCEPTANCE_STATUS = [
    DataApprovalStatusEnum.APPROVED_HERE,
    DataApprovalStatusEnum.PARTIALLY_ACCEPTED_HERE,
];

const FOR_UNACCEPTANCE_STATUS = [
    DataApprovalStatusEnum.PARTIALLY_ACCEPTED_HERE,
    DataApprovalStatusEnum.ACCEPTED_HERE,
];

export const isReadyForApprove =
        approvalInfo => FOR_APPROVE_STATUS.includes(approvalInfo.status) && approvalInfo.mayApprove;

export const isReadyForUnapprove =
        approvalInfo => FOR_UNAPPROVE_STATUS.includes(approvalInfo.status) && approvalInfo.mayUnapprove;

export const isReadyForAcceptance =
        approvalInfo => FOR_ACCEPTANCE_STATUS.includes(approvalInfo.status) && approvalInfo.mayAccept;

export const isReadyForUnacceptance =
        approvalInfo => FOR_UNACCEPTANCE_STATUS.includes(approvalInfo.status) && approvalInfo.mayUnaccept;
