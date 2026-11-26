import type { Metadata } from 'next';
import InventoryManager from '@/features/inventory/components/InventoryManager';

export const metadata: Metadata = { title: 'Inventory' };

// Address: /inventory
export default function Page() {
  return <InventoryManager />;
}
