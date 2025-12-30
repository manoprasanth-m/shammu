import Link from 'next/link';
import Image from 'next/image';
import { Product, CategoryWithSubs, slugFromReference } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  categoryTree?: CategoryWithSubs[];
}

export default function ProductCard({ product, categoryTree }: ProductCardProps) {
  // Build category display string
  const getCategoryDisplay = () => {
    const catSlug = slugFromReference(product.category);
    const subcatSlug = slugFromReference(product.subcategory);

    if (categoryTree) {
      // Find category names from tree
      let catName = '';
      let subcatName = '';

      for (const parent of categoryTree) {
        if (parent.slug === catSlug) {
          catName = parent.title;
        }
        for (const sub of parent.subcategories) {
          if (sub.slug === catSlug) {
            catName = sub.title;
          }
          if (sub.slug === subcatSlug) {
            subcatName = sub.title;
          }
        }
      }

      if (subcatName) {
        return `${catName} / ${subcatName}`;
      }
      return catName || (catSlug || '').replace(/-/g, ' ');
    }

    // Fallback: just use slug
    return (catSlug || product.category || '').replace(/-/g, ' ');
  };

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.mainImage || '/uploads/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-secondary text-lg mb-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm capitalize">
            {getCategoryDisplay()}
          </p>
        </div>
      </div>
    </Link>
  );
}

