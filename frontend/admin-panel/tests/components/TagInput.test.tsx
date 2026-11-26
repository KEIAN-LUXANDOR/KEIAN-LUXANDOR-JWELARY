import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from '@/components/forms/TagInput';

function Harness({ start = [] as string[] }) {
  const [values, setValues] = useState(start);
  return (
    <>
      <TagInput id="t" label="Ring sizes" values={values} onChange={setValues} />
      <output>{values.join(',')}</output>
    </>
  );
}

describe('TagInput', () => {
  it('adds values on Enter and ignores duplicates', async () => {
    render(<Harness />);
    const input = screen.getByLabelText('Ring sizes');
    await userEvent.type(input, '6{Enter}6.5{Enter}6{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('6,6.5');
  });

  it('removes a value with its × button', async () => {
    render(<Harness start={['Round', 'Oval']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Round' }));
    expect(screen.getByRole('status')).toHaveTextContent('Oval');
  });
});
