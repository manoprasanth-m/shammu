import { useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ProductCard';
import { getAllCategories, getAllProducts, Category, Product } from '@/lib/data';
import { makeWhatsAppLink, getGeneralEnquiryText } from '@/lib/whatsapp';

interface HomeProps {
  categories: Category[];
  products: Product[];
}

export default function Home({ categories, products }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const whatsappLink = makeWhatsAppLink({ text: getGeneralEnquiryText() });

  return (
    <Layout>
      <section className="bg-gradient-to-br from-accent-light to-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6">
            Welcome to <span className="text-accent">Mal&apos;s Mandi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique handcrafted products for every occasion. Browse our collection and reach out to us on WhatsApp.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Start Shopping
          </a>
        </div>
      </section>

      <section id="categories" className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">Browse Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <CategoryChip
                key={category.slug}
                title={category.title}
                slug={category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">All Products</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-secondary hover:bg-accent-light hover:text-accent'
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

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
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

  return {
    props: {
      categories,
      products,
    },
  };
};
