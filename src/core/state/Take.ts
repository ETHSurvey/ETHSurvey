import { FormField } from '@src/types';

export interface TakeSurveyState {
  amount: string;
  fields: FormField[];
  name: string;
  requiredResponses: string;
  totalResponses: string;
}
