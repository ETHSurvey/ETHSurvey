import { FormField } from '@src/types';

export interface CreateSurveyState {
  current: number;
  fields: FormField[];
  shortid: string;
  showResults: boolean;
}
