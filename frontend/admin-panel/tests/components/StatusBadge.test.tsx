import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/common/Badge';

describe('StatusBadge', () => {
  it.each([
    ['Delivered', 'badge--success'],
    ['Pending', 'badge--warning'],
    ['Refunded', 'badge--danger'],
    ['Out of stock', 'badge--danger'],
    ['something else', 'badge--neutral'],
  ])('%s gets %s', (status, cls) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))).toHaveClass(cls);
  });
});
