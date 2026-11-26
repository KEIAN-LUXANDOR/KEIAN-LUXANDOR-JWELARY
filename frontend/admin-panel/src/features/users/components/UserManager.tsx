'use client';

import { useState, type FormEvent } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Badge, { StatusBadge } from '@/components/common/Badge';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { SelectField, TextField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import useResource from '@/hooks/useResource';
import useDisclosure from '@/hooks/useDisclosure';
import { useToast } from '@/lib/providers/ToastProvider';
import { ADMIN_ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '@/lib/constants';
import type { AdminRole, AdminUser } from '@/types/models';
import { formatDateTime } from '@/utils/format';
import { omitId } from '@/utils/object';
import { hasErrors, isBlank, isEmail, type FormErrors } from '@/utils/validation';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

type UserInput = Omit<AdminUser, 'id'>;

function UserForm({ initial, takenEmails, isSelf, onSave, onClose }: { initial: UserInput; takenEmails: string[]; isSelf: boolean; onSave: (u: UserInput) => Promise<void>; onClose: () => void }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FormErrors<UserInput>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors<UserInput> = {};
    if (isBlank(v.name)) errs.name = 'Enter a name';
    if (!isEmail(v.email)) errs.email = 'Enter a valid email';
    else if (takenEmails.includes(v.email.trim().toLowerCase())) errs.email = 'Another admin already uses this email';
    if (v.role !== 'Owner' && v.permissions.length === 0) errs.permissions = 'Choose at least one area';
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      await onSave({ ...v, email: v.email.trim().toLowerCase(), permissions: v.role === 'Owner' ? ROLE_PERMISSIONS.Owner : v.permissions });
      onClose();
    } catch {
      // The reason was already shown as a message; keep the form open.
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <TextField id="u-name" label="Name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} error={errors.name} />
      <TextField id="u-email" label="Email (used to sign in)" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
      <SelectField
        id="u-role"
        label="Role"
        value={v.role}
        disabled={isSelf}
        hint={isSelf ? 'You can’t change your own role' : 'Choosing a role fills in its usual permissions'}
        onChange={(e) => {
          const role = e.target.value as AdminRole;
          setV({ ...v, role, permissions: ROLE_PERMISSIONS[role] });
        }}
        options={ADMIN_ROLES.map((r) => ({ value: r, label: r }))}
      />
      <div className="field" style={{ alignSelf: 'end' }}>
        <Toggle checked={v.active} onChange={(active) => setV({ ...v, active })} label="Can sign in" />
      </div>
      <fieldset className="field field--full" style={{ border: 0, padding: 0, margin: 0 }} disabled={v.role === 'Owner'}>
        <legend className="field__label" style={{ marginBottom: 8 }}>
          What this admin can manage {v.role === 'Owner' && <span className="muted">(owners can manage everything)</span>}
        </legend>
        <div className="perm-grid">
          {PERMISSIONS.map((p) => (
            <label key={p.value} className="check">
              <input
                type="checkbox"
                checked={v.role === 'Owner' || v.permissions.includes(p.value)}
                onChange={(e) => setV({ ...v, permissions: e.target.checked ? [...v.permissions, p.value] : v.permissions.filter((x) => x !== p.value) })}
              />
              <span>
                {p.label}
                <span className="check__desc">{p.description}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.permissions && <span className="field__error">{errors.permissions}</span>}
      </fieldset>
      <div className="form-actions field--full">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save admin
        </Button>
      </div>
    </form>
  );
}

/** /users — who can sign in to the admin panel, and what they can do. */
export default function UserManager() {
  const { user: me } = useAuth();
  const { items, loading, error, create, update, remove } = useResource(userService);
  const modal = useDisclosure<AdminUser>();
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const toast = useToast();
  const owners = items.filter((u) => u.role === 'Owner' && u.active).length;

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Admin',
      sortValue: (u) => u.name,
      render: (u) => (
        <div>
          <div className="cell-title">
            {u.name} {u.id === me?.id && <Badge tone="gold">You</Badge>}
          </div>
          <div className="cell-sub">{u.email}</div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', sortValue: (u) => u.role, render: (u) => u.role },
    {
      key: 'permissions',
      header: 'Can manage',
      render: (u) => <span className="cell-sub wrap" style={{ display: 'block' }}>{u.role === 'Owner' ? 'Everything' : PERMISSIONS.filter((p) => u.permissions.includes(p.value)).map((p) => p.label).join(', ')}</span>,
    },
    { key: 'last', header: 'Last sign-in', sortValue: (u) => u.lastLoginAt ?? '', render: (u) => (u.lastLoginAt ? formatDateTime(u.lastLoginAt) : 'Never') },
    { key: 'status', header: 'Status', sortValue: (u) => String(u.active), render: (u) => <StatusBadge status={u.active ? 'active' : 'Inactive'} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <span className="row-actions">
          <IconButton icon="edit" label={`Edit ${u.name}`} onClick={() => modal.open(u)} />
          <IconButton icon="trash" label={`Remove ${u.name}`} tone="danger" disabled={u.id === me?.id} onClick={() => setToDelete(u)} />
        </span>
      ),
    },
  ];

  const editing = modal.item;
  const lastOwner = (u: AdminUser | null) => Boolean(u && u.role === 'Owner' && u.active && owners <= 1);

  return (
    <>
      <PageHeader
        title="Admin Users"
        description="People who can sign in to this admin panel."
        actions={
          <Button icon="plus" onClick={() => modal.open(null)}>
            Add admin
          </Button>
        }
      />
      <DataTable caption="Admin users" columns={columns} rows={items} rowKey={(u) => u.id} loading={loading} error={error} />
      <Modal open={modal.isOpen} onClose={modal.close} title={editing ? `Edit ${editing.name}` : 'Add admin'} size="lg">
        <UserForm
          key={editing?.id ?? 'new'}
          initial={editing ? omitId(editing) : { name: '', email: '', role: 'Staff', permissions: ROLE_PERMISSIONS.Staff, active: true, lastLoginAt: null }}
          takenEmails={items.filter((u) => u.id !== editing?.id).map((u) => u.email.toLowerCase())}
          isSelf={editing?.id === me?.id}
          onClose={modal.close}
          onSave={async (values) => {
            if (editing && lastOwner(editing) && (values.role !== 'Owner' || !values.active)) {
              toast('The store needs at least one active owner', 'error');
              throw new Error('last owner');
            }
            if (editing) await update(editing.id, values);
            else await create(values);
            toast(editing ? 'Admin saved' : `${values.name} added — they can now sign in with ${values.email}`);
          }}
        />
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Remove admin?"
        message={lastOwner(toDelete) ? 'This is the only active owner. Make someone else an owner first.' : `${toDelete?.name} will no longer be able to sign in.`}
        confirmLabel={lastOwner(toDelete) ? 'OK' : 'Remove'}
        danger={!lastOwner(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete || lastOwner(toDelete)) return;
          await remove(toDelete.id);
          toast('Admin removed');
        }}
      />
    </>
  );
}
