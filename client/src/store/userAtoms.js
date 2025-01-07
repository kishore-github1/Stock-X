import { atom } from 'recoil';

export const userEmailAtom = atom({
  key: 'userEmailAtom',
  default: '',
});

export const userNameAtom = atom({
  key: 'userNameAtom',
  default: '',
});