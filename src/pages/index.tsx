import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ProductCard';
import { getAllCategories, getAllProducts, getAllFulfilledOrders, Category, Product, FulfilledOrder } from '@/lib/data';
import { makeWhatsAppLink, getGeneralEnquiryText } from '@/lib/whatsapp';

interface HomeProps {
  categories: Category[];
  products: Product[];
  fulfilledOrders: FulfilledOrder[];
}

export default function Home({ categories, products, fulfilledOrders }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PRODUCTS_PER_PAGE = 30;

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  useEffect(() => {
    // Reset to first page whenever the selected category changes
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
            Handcrafted · Curated · Made with love
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
            Unique handcrafted pieces for every occasion
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore curated gifts, decor, and custom creations. Discover something special and
            reach out on WhatsApp to make it yours.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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

      {fulfilledOrders.length > 0 && (
        <section className="py-14 bg-white">
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
                  className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
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

      <section id="products" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
              <div>
                <h2 className="text-3xl font-bold text-secondary">All Products</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Browse our latest handcrafted pieces across all categories.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === null
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <CategoryChip
                  key={category.slug}
                  title={category.title}
                  slug={category.slug}
                  isActive={selectedCategory === category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  asLink={false}
                />
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-accent text-accent hover:bg-accent hover:text-white'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-accent text-white'
                          : 'bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-accent text-accent hover:bg-accent hover:text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const categories = getAllCategories();
  const products = getAllProducts();
  const fulfilledOrders = getAllFulfilledOrders();

  return {
    props: {
      categories,
      products,
      fulfilledOrders,
    },
  };
};
