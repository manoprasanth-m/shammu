import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Custom404() {
  return (
    <Layout title="Page Not Found | Mal's Mandi">
      <div className="container py-20 text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}
