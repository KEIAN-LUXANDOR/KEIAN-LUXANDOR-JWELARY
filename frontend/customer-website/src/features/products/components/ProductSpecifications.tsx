import { Fragment } from 'react';
import type { Product } from '../types/productTypes';
import { specificationRows } from '../utils/productHelpers';

/** Metal purity, diamond shape, carat weight and other specifications. */
export default function ProductSpecifications({ product, selectedMetal }: { product: Product; selectedMetal?: string }) {
  return (
    <dl className="pdp__specs">
      {specificationRows(product, selectedMetal).map((row) => (
        <Fragment key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
