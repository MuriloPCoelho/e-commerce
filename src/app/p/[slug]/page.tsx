import Header from "@/components/commom/header";
import ProductRating from "@/components/commom/product-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { Accordion as AccordionPrimitive } from "radix-ui";
import VariantSelector from "./components/variant-selector";
import SizeSelector from "./components/size-selector";
import AddToBagButton from "./components/add-to-bag-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const ProductPage = async ({ params, searchParams }: ProductPageProps) => {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const size = resolvedSearchParams?.size;
  const selectedSizeName = Array.isArray(size)
    ? size[0]
    : (size as string | undefined);

  const variant = await db.query.productVariantsTable.findFirst({
    where: (productVariant) => eq(productVariant.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!variant) return <div>Product not found</div>;

  const variantSizes = await db.query.productVariantSizesTable.findMany({
    where: (size) =>
      eq(size.variantId, variant.id) ||
      variant.product.variants.some((v) => eq(size.variantId, v.id)),
    with: {
      size: true,
    },
  });


  let selectedProductVariantSizeId: number | null = null;
  if (selectedSizeName) {
    const found = variantSizes.find((s) => s.size.name === selectedSizeName);
    selectedProductVariantSizeId = found?.id ?? null;
  }
  if (!selectedProductVariantSizeId) {
    selectedProductVariantSizeId = variantSizes[0]?.id ?? null;
  }
  console.log({ variantSizes });

  return (
    <>
      <Header />
      <div className="flex flex-col">
        <div className="relative aspect-square mb-8">
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-2">{`${variant.product.name} - ${variant.name}`}</h1>
          <ProductRating rating={4.5} size="lg" />
          <p className="mt-4 text-[28px] font-bold">{`R$ ${(
            variant.priceInCents / 100
          )
            .toFixed(2)
            .replace(".", ",")}`}</p>
          <span>
            ou 12x de R${" "}
            {(variant.priceInCents / 100 / 12).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="p-4">
          <VariantSelector variants={variant.product.variants} />
        </div>
        <div>
          <div className="p-4">
            <h2 className="text-lg mb-2">Selecione o tamanho</h2>
            <div className="flex gap-1.5 w-full flex-wrap">
              <SizeSelector sizes={variantSizes} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <Button className="w-full" size="lg">
            Comprar agora
          </Button>
          <AddToBagButton productVariantSizeId={selectedProductVariantSizeId} />
        </div>
        <div></div>
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="1">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-lg leading-6 font-semibold transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                  Descrição
                  <PlusIcon
                    size={20}
                    className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent>
                <p className="text-neutral-600 leading-6">
                  {variant.product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-lg leading-6 font-semibold transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                  Informações técnicas
                  <PlusIcon
                    size={20}
                    className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent>
                <p className="text-neutral-600 leading-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
