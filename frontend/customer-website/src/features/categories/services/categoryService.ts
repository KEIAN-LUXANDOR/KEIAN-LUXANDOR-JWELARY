// Which products each kind of category page asks the backend for.
// One product system for every metal and jewellery type.
import type { ProductQuery } from '@/features/products/types/productTypes';
import { JEWELLERY_TYPES, METAL_CATEGORIES } from '../utils/categoryConfig';
import type { JewelleryTypeId, MetalCategoryId } from '../types/categoryTypes';

/** /diamond-gold → every product in 14K Yellow Gold, … */
export const metalCategoryQuery = (id: MetalCategoryId): ProductQuery => ({ metals: METAL_CATEGORIES[id].metals });

/** /rings → GET /api/products?tag=rings */
export const jewelleryTypeQuery = (id: JewelleryTypeId): ProductQuery => ({ tag: JEWELLERY_TYPES[id].slug });

/** /collections/gifts → GET /api/products?tag=gifts */
export const collectionQuery = (slug: string): ProductQuery => ({ tag: slug });
