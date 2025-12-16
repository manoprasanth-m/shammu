import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getAllCategories, getCategoryBySlug, getProductsByCategory, Category, Product } from '@/lib/data';

interface CategoryPageProps {
  category: Category;
  products: Product[];
}

export default function CategoryPage({ category, products }: CategoryPageProps) {
  return (
    <Layout 
      title={`${category.title} | Mal's Mandi`}
      description={`Browse ${category.title} products at Mal's Mandi`}
    >
      <div className="container py-8">
        <nav className="mb-6">
          <Link href="/" className="text-accent hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{category.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-secondary mb-8">{category.title}</h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found in this category yet.</p>
            <Link href="/" className="btn-secondary inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = getAllCategories();
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      notFound: true,
    };
  }

  const products = getProductsByCategory(slug);

  return {
    props: {
      category,
      products,
    },
  };
};
