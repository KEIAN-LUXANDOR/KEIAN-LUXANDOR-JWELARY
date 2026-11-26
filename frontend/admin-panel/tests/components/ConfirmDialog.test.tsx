import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '@/components/modals/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('runs the action and closes when confirmed', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<ConfirmDialog open title="Delete product?" message="This can’t be undone." onConfirm={onConfirm} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Delete product?' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalled();
  });

  it('closes without running the action on Cancel or Escape', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmDialog open title="Delete?" message="Sure?" onConfirm={onConfirm} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('renders nothing when closed', () => {
    render(<ConfirmDialog open={false} title="Delete?" message="Sure?" onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
