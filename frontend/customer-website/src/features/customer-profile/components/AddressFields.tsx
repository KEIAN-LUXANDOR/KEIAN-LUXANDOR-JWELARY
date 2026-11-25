import { TextField } from '@/components/common/FormField';
import type { FormErrors } from '@/utils/validation';
import type { AddressInput } from '../types/profileTypes';

interface AddressFieldsProps {
  idPrefix: string;
  values: AddressInput;
  errors: FormErrors<AddressInput>;
  onChange: (values: AddressInput) => void;
}

/** Address inputs, shared by the address book and checkout. */
export default function AddressFields({ idPrefix, values, errors, onChange }: AddressFieldsProps) {
  const field = (name: keyof AddressInput, label: string, opts: { full?: boolean; autoComplete?: string; type?: string } = {}) => (
    <TextField
      id={`${idPrefix}-${name}`}
      label={label}
      value={values[name]}
      error={errors[name]}
      full={opts.full}
      type={opts.type}
      autoComplete={opts.autoComplete}
      onChange={(e) => onChange({ ...values, [name]: e.target.value })}
    />
  );
  return (
    <>
      {field('firstName', 'First Name', { autoComplete: 'given-name' })}
      {field('lastName', 'Last Name', { autoComplete: 'family-name' })}
      {field('line1', 'Address', { full: true, autoComplete: 'address-line1' })}
      {field('line2', 'Apartment, suite, etc. (optional)', { full: true, autoComplete: 'address-line2' })}
      {field('city', 'City', { autoComplete: 'address-level2' })}
      {field('state', 'State', { autoComplete: 'address-level1' })}
      {field('zip', 'Zip Code', { autoComplete: 'postal-code' })}
      {field('country', 'Country', { autoComplete: 'country-name' })}
      {field('phone', 'Phone (optional)', { full: true, autoComplete: 'tel', type: 'tel' })}
    </>
  );
}
