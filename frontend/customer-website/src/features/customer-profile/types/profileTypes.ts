export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, 'id' | 'isDefault'>;

export interface ProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
}
