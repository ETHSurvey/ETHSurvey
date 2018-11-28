import shortid from 'shortid';

// Additional handling to avoid `hyphen` and `minus` in the `shortid`
export const getShortId = (): string => {
  let id: string;
  let hasSpecialChar: boolean;

  do {
    id = shortid.generate();
    hasSpecialChar = /[-_]/g.test(id);
  } while (hasSpecialChar);

  return id;
};
