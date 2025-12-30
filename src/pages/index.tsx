import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ProductCard';
import { getParentCategories, getSubcategories, getAllProducts, getAllFulfilledOrders } from '@/lib/data';
import { Category, Product, FulfilledOrder, CategoryWithSubs, slugFromReference } from '@/lib/types';
import { makeWhatsAppLink, getGeneralEnquiryText } from '@/lib/whatsapp';
import Link from 'next/link';

interface HomeProps {
  categoryTree: CategoryWithSubs[];
  products: Product[];
  fulfilledOrders: FulfilledOrder[];
}

export default function Home({ categoryTree, products, fulfilledOrders }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PRODUCTS_PER_PAGE = 20;

  // Filter products by selected category (matching either category or subcategory slug)
  const filteredProducts = selectedCategory
    ? products.filter((p) => {
      const catSlug = slugFromReference(p.category);
      const subcatSlug = slugFromReference(p.subcategory);
      // Check if selected category is a parent category
      const parentCat = categoryTree.find((c) => c.slug === selectedCategory);
      if (parentCat) {
        // If it's a parent, include products in this category OR any of its subcategories
        const subcatSlugs = parentCat.subcategories.map((s) => s.slug);
        return catSlug === selectedCategory || subcatSlugs.includes(catSlug || '') || subcatSlugs.includes(subcatSlug || '');
      }
      // Otherwise it's a subcategory, match exactly
      return catSlug === selectedCategory || subcatSlug === selectedCategory;
    })
    : products;

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const whatsappLink = makeWhatsAppLink({ text: getGeneralEnquiryText() });

  return (
    <Layout>
      <section className="bg-gradient-to-br from-accent-light to-white py-16 md:py-20 border-b border-gray-100">
        <div className="container text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-3">
            Exclusive · Curated · By Request
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
            Sourced pieces you won’t find on the usual shelves, secured through our network
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse the collection, or send a brief for something specific—rare, vintage, or made-to-order. WhatsApp us to request sourcing, quotes, and timelines.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Shopping
          </a>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-br from-white via-accent-light/40 to-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-4 text-center">
            See what our customers says
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            We love bringing your ideas to life. Here&apos;s what some of our happy customers
            have to say about their Mal&apos;s Mandi experience.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-accent-light/40">
              <p className="text-gray-700 mb-4">
                &quot;Beautiful quality and attention to detail. The custom gift box was even
                better than I imagined!&quot;
              </p>
              <p className="font-semibold text-secondary">Ananya, Mumbai</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-accent-light/40">
              <p className="text-gray-700 mb-4">
                &quot;Mal&apos;s Mandi made our party decor so special. Everyone kept asking
                where we got everything from!&quot;
              </p>
              <p className="font-semibold text-secondary">Rahul &amp; Meera, Pune</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-accent-light/40">
              <p className="text-gray-700 mb-4">
                &quot;Super easy to order over WhatsApp and the handcrafted pieces are totally
                worth it.&quot;
              </p>
              <p className="font-semibold text-secondary">Sana, Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-2">Our Collection</h2>
              <p className="text-gray-600">Handpicked treasures for your home and lifestyle</p>
            </div>

            {/* Category Chips */}
            <div className="w-full md:w-auto">
              {/* Parent Categories */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === null
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent'
                    }`}
                >
                  All
                </button>
                {categoryTree.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.slug
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent'
                      }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              {/* Subcategories (only shown when parent is selected) */}
              {selectedCategory && (
                <div className="flex flex-wrap gap-2 pl-2 animate-fadeIn bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-400 font-medium py-1 px-1">Subcategories:</span>
                  {categoryTree
                    .find(c => c.slug === selectedCategory)
                    ?.subcategories.map(sub => (
                      <Link
                        key={sub.slug}
                        href={`/category/${sub.slug}`} // Navigate to subcategory page
                        className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent"
                      >
                        {sub.title}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} categoryTree={categoryTree} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-lg">
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Fulfilled Orders Moved Below */}
      {fulfilledOrders.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container">
            <h2 className="text-3xl font-bold text-secondary mb-4 text-center">
              Fulfilled Orders
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              A glimpse of some custom orders we&apos;ve brought to life for our customers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {fulfilledOrders.map((order) => (
                <div
                  key={order.title}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-secondary text-center">
                      {order.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const parentCategories = getParentCategories();
  const products = getAllProducts();
  const fulfilledOrders = getAllFulfilledOrders();

  // Build category tree with subcategories
  const categoryTree: CategoryWithSubs[] = parentCategories.map((parent) => ({
    ...parent,
    subcategories: getSubcategories(parent.slug),
  }));

  return {
    props: {
      categoryTree,
      products,
      fulfilledOrders,
    },
  };
};

