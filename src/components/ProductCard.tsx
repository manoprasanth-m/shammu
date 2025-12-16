import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.mainImage || '/uploads/placeholder.jpg'}
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
            {product.category.replace(/-/g, ' ')}
          </p>
        </div>
      </div>
    </Link>
  );
}
