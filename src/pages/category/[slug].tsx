import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import {
  getAllCategories,
  getAllSubcategories,
  getCategoryBySlug,
  getSubcategoryBySlug,
  getProductsByCategory,
  getSubcategories,
  getParentCategoryOf,
  getParentCategories,
} from '@/lib/data';
import { Category, Product, CategoryWithSubs, Subcategory } from '@/lib/types';

interface CategoryPageProps {
  category: Category | Subcategory;
  parentCategory: Category | null;
  subcategories: Subcategory[];
  products: Product[];
  categoryTree: CategoryWithSubs[];
}

export default function CategoryPage({ category, parentCategory, subcategories, products, categoryTree }: CategoryPageProps) {
  const isSubcategory = !!parentCategory;

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
          {isSubcategory && parentCategory && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/category/${parentCategory.slug}`} className="text-accent hover:underline">
                {parentCategory.title}
              </Link>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{category.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-secondary mb-4">{category.title}</h1>

        {/* Subcategory Navigation (if this is a parent category with subcategories) */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">Browse subcategories:</p>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.slug}
                  href={`/category/${subcat.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent transition-all"
                >
                  {subcat.title}
                </Link>
              ))}
            </div>
          </div>
        )}

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
              <ProductCard key={product.slug} product={product} categoryTree={categoryTree} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = getAllCategories();
  const subcategories = getAllSubcategories();

  // Create paths for both categories and subcategories
  const categoryPaths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  const subcategoryPaths = subcategories.map((subcategory) => ({
    params: { slug: subcategory.slug },
  }));

  return {
    paths: [...categoryPaths, ...subcategoryPaths],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  // Try to find as a parent category first
  let category: Category | Subcategory | null = getCategoryBySlug(slug);
  let parentCategory: Category | null = null;
  let subcategories: Subcategory[] = [];

  if (category) {
    // It's a parent category
    subcategories = getSubcategories(slug);
  } else {
    // Try to find as a subcategory
    category = getSubcategoryBySlug(slug);
    if (category) {
      // It's a subcategory, find its parent
      parentCategory = getParentCategoryOf(category as Subcategory);
    }
  }

  if (!category) {
    return {
      notFound: true,
    };
  }

  // Get products
  let products = getProductsByCategory(slug);

  // If it's a parent category, also include products from its subcategories
  if (!parentCategory && subcategories.length > 0) {
    for (const subcat of subcategories) {
      const subcatProducts = getProductsByCategory(subcat.slug);
      products = [...products, ...subcatProducts];
    }
    // Remove duplicates
    products = products.filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i);
  }

  // Build category tree for ProductCard
  const parentCategories = getAllCategories();
  const categoryTree: CategoryWithSubs[] = parentCategories.map((parent) => ({
    ...parent,
    subcategories: getSubcategories(parent.slug),
  }));

  return {
    props: {
      category,
      parentCategory,
      subcategories,
      products,
      categoryTree,
    },
  };
};

