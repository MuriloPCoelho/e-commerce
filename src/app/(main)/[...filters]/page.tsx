import ProductCard from "@/components/commom/product-card";
import { getFilteredProducts } from "@/actions/get-filtered-products";
import { parseFilters, generatePageTitle } from "@/lib/filters";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/commom/product-grid-skeleton";

interface FiltersPageProps {
  params: Promise<{ filters: string[] }>;
}

async function ProductList({ filters }: { filters: string[] }) {
  const productFilters = parseFilters(filters);
  const products = await getFilteredProducts(productFilters);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6">
      {products.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
  );
}

const FiltersPage = async ({ params }: FiltersPageProps) => {
  const { filters } = await params;
  const pageTitle = generatePageTitle(parseFilters(filters));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{pageTitle}</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList filters={filters} />
      </Suspense>
    </div>
  );
};

export default FiltersPage;
