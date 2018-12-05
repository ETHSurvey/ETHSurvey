import Web3 from 'web3';

import { Survey } from '@src/types';

export const getSurveyList = (data: {
  0: string[];
  1: string[];
  2: string[];
}): Survey[] => {
  const count = data[0].length;

  const FIELD_NAME = 0;
  const FIELD_SHORTID = 1;
  const FIELD_TOTAL_RESPONSES = 2;

  const surveys = [];

  for (let i = 0; i < count; i++) {
    const s = {
      name: Web3.utils.toAscii(data[FIELD_NAME][i]),
      shortid: Web3.utils.toAscii(data[FIELD_SHORTID][i]),
      totalResponses: data[FIELD_TOTAL_RESPONSES][i]
    };

    surveys.push(s);
  }

  return surveys;
};
