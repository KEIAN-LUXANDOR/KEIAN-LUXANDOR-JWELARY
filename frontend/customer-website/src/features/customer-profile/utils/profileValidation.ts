import { isBlank, isPhone, type FormErrors } from '@/utils/validation';
import type { AddressInput, ProfileInput } from '../types/profileTypes';

export const EMPTY_ADDRESS: AddressInput = { firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '' };

export const validateAddress = (v: AddressInput): FormErrors<AddressInput> => {
  const e: FormErrors<AddressInput> = {};
  (['firstName', 'lastName', 'line1', 'city', 'state', 'zip', 'country'] as const).forEach((k) => {
    if (isBlank(v[k])) e[k] = 'Required';
  });
  if (v.phone && !isPhone(v.phone)) e.phone = 'Enter a valid phone number';
  return e;
};

export const validateProfile = (v: ProfileInput): FormErrors<ProfileInput> => {
  const e: FormErrors<ProfileInput> = {};
  if (isBlank(v.firstName)) e.firstName = 'Required';
  if (isBlank(v.lastName)) e.lastName = 'Required';
  if (v.phone && !isPhone(v.phone)) e.phone = 'Enter a valid phone number';
  return e;
};

export const formatAddress = (a: AddressInput): string =>
  [a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`, a.country].filter(Boolean).join(', ');
