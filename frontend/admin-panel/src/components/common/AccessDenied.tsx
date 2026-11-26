import EmptyState from './EmptyState';

export default function AccessDenied() {
  return <EmptyState icon="lock" title="You don't have access to this page" text="Ask the store owner to give your account this permission in Admin Users." />;
}
