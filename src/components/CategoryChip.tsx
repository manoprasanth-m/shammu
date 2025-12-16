import Link from 'next/link';

interface CategoryChipProps {
  title: string;
  slug: string;
  isActive?: boolean;
  onClick?: () => void;
  asLink?: boolean;
}

export default function CategoryChip({ title, slug, isActive = false, onClick, asLink = true }: CategoryChipProps) {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer";
  const activeClasses = isActive 
    ? "bg-accent text-white" 
    : "bg-gray-100 text-secondary hover:bg-accent-light hover:text-accent";

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
