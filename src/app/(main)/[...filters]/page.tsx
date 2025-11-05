import ProductCard from "@/components/commom/product-card";
import { getFilteredProducts } from "@/actions/get-filtered-products";
import { parseFilters, generatePageTitle } from "@/lib/filters";

interface FiltersPageProps {
  params: Promise<{ filters: string[] }>;
}

const FiltersPage = async ({ params }: FiltersPageProps) => {
  const { filters } = await params;
  const productFilters = parseFilters(filters);
  const products = await getFilteredProducts(productFilters);
  const pageTitle = generatePageTitle(productFilters);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{pageTitle}</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltersPage;
