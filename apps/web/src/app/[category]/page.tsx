import { CatalogView } from '@/components/catalog/CatalogView';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: { category: string } }) {
  // We only want to handle valid categories
  const validCategories = ['eyeglasses', 'sunglasses', 'contact-lenses', 'computer-glasses'];
  
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  return <CatalogView categorySlug={params.category} />;
}
