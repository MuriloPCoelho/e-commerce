import ProductCard from "@/components/commom/product-card";
import { db } from "@/db";
import { categoriesTable, productsTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  
  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.slug, slug),
  });

  if (!category) return notFound();

  const isMainCategory = category.parentId === null;

  const products = await db.query.productsTable.findMany({
    where: isMainCategory
      ? eq(productsTable.categoryId, category.id)
      : eq(productsTable.subcategoryId, category.id),
    with: {
      variants: {
        with: {
          color: true,
        },
      },
      category: true,
      subcategory: true,
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{category.name}</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhum produto encontrado nesta categoria.</p>
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

export default CategoryPage;
