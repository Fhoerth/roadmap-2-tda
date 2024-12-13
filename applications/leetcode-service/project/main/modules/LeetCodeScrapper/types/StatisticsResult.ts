import type { SubmissionId } from './SubmissionId';

export type Base64EncodedString = string;
export type StatisticsResult = {
  submissionId: SubmissionId;
  solved: boolean;
  image: Base64EncodedString | null;
};
