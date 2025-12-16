import Link from 'next/link';

interface CategoryChipProps {
  title: string;
  slug: string;
  isActive?: boolean;
  onClick?: () => void;
  asLink?: boolean;
}

export default function CategoryChip({ title, slug, isActive = false, onClick, asLink = true }: CategoryChipProps) {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap";
  const activeClasses = isActive 
    ? "bg-accent text-white shadow-sm" 
    : "bg-white border border-gray-200 text-secondary hover:border-accent hover:text-accent";

  if (asLink) {
    return (
      <Link href={`/category/${slug}`} className={`${baseClasses} ${activeClasses}`}>
        {title}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {title}
    </button>
  );
}
