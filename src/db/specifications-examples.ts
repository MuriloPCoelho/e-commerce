import type {
  ClothingSpecification,
  FootwearSpecification,
  AccessorySpecification,
} from "@/lib/product-specifications";

/**
 * Exemplos de especificações por tipo de produto
 * Use estas como referência ao adicionar produtos no seed
 */

// ==================== EXEMPLOS DE ROUPAS ====================

export const tShirtSpecification: ClothingSpecification = {
  type: "clothing",
  material: ["Algodão"],
  composition: ["100% Algodão"],
  fabricType: "Malha",
  weight: "180g (tamanho M)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  fit: "regular",
  neckline: "Gola careca",
  sleeveLength: "short",
  pattern: "Liso",
  season: "all-season",
  washInstructions: [
    "Lavar à máquina até 30°C",
    "Não usar alvejante",
    "Não secar na máquina",
    "Passar em temperatura média",
  ],
};

export const sportShirtSpecification: ClothingSpecification = {
  type: "clothing",
  material: ["Poliéster"],
  composition: ["100% Poliéster reciclado"],
  fabricType: "Malha Dri-FIT",
  weight: "150g",
  warranty: "6 meses. Contra defeitos de fabricação.",
  fit: "regular",
  neckline: "Gola careca",
  sleeveLength: "short",
  pattern: "Liso",
  technologies: ["Dri-FIT", "Tecnologia de evaporação rápida", "Anti-odor"],
  season: "summer",
  washInstructions: [
    "Lavar à máquina até 40°C",
    "Não usar alvejante",
    "Secar à sombra",
  ],
};

export const hoodieSpecification: ClothingSpecification = {
  type: "clothing",
  material: ["Moletom"],
  composition: ["80% Algodão", "20% Poliéster"],
  fabricType: "Moletom Flanelado",
  weight: "320g (tamanho M)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  fit: "regular",
  sleeveLength: "long",
  pattern: "Liso",
  season: "winter",
  washInstructions: [
    "Lavar à máquina até 30°C",
    "Não usar alvejante",
    "Não secar na máquina",
    "Lavar do avesso",
  ],
};

export const shortsSpecification: ClothingSpecification = {
  type: "clothing",
  material: ["Poliéster"],
  composition: ["100% Poliéster"],
  fabricType: "Tafetá",
  weight: "200g (tamanho M)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  fit: "regular",
  pattern: "Liso",
  technologies: ["Dry-Fit", "Elástico com cordão ajustável"],
  season: "summer",
  washInstructions: [
    "Lavar à máquina até 30°C",
    "Não usar alvejante",
    "Secar à sombra",
  ],
};

// ==================== EXEMPLOS DE CALÇADOS ====================

export const sneakerSpecification: FootwearSpecification = {
  type: "footwear",
  upperMaterial: "Couro sintético e mesh",
  soleMaterial: "Borracha",
  innerMaterial: "Tecido respirável",
  weight: "320g (tamanho 42)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  closure: "lace",
  cushioning: "Espuma EVA",
  technologies: ["Air Max", "Sola de borracha com ranhuras de tração"],
  recommendedUse: ["Casual", "Dia a dia"],
  terrain: "road",
  waterproof: false,
  flexibility: "medium",
};

export const runningShoeSpecification: FootwearSpecification = {
  type: "footwear",
  upperMaterial: "Mesh Flyknit",
  soleMaterial: "Borracha e espuma React",
  innerMaterial: "Palmilha em EVA",
  weight: "280g (tamanho 42)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  closure: "lace",
  cushioning: "Nike React Foam",
  technologies: ["React Foam", "Flyknit", "Sola de borracha com design waffle"],
  recommendedUse: ["Corrida", "Treino"],
  terrain: "road",
  waterproof: false,
  flexibility: "high",
};

export const basketballShoeSpecification: FootwearSpecification = {
  type: "footwear",
  upperMaterial: "Couro sintético",
  soleMaterial: "Borracha sólida",
  innerMaterial: "Espuma Air",
  weight: "450g (par tamanho 42)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  closure: "lace",
  heelHeight: "4cm",
  cushioning: "Air Unit no calcanhar",
  technologies: ["Air Cushioning", "Suporte lateral reforçado", "Pivot Point"],
  recommendedUse: ["Basquete", "Esportes indoor"],
  terrain: "indoor",
  waterproof: false,

  flexibility: "low",
};

export const sandalSpecification: FootwearSpecification = {
  type: "footwear",
  upperMaterial: "Sintético com alças ajustáveis",
  soleMaterial: "EVA",
  innerMaterial: "EVA moldado",
  weight: "180g (par tamanho 42)",
  warranty: "6 meses. Contra defeitos de fabricação.",
  closure: "slip-on",
  cushioning: "EVA macio",
  technologies: ["Palmilha anatômica", "Tiras ajustáveis"],
  recommendedUse: ["Casual", "Piscina", "Praia"],
  terrain: "mixed",
  waterproof: true,
  flexibility: "high",
};

// ==================== EXEMPLOS DE ACESSÓRIOS ====================

export const backpackSpecification: AccessorySpecification = {
  type: "accessory",
  material: ["Poliéster 600D"],
  dimensions: {
    height: "45cm",
    width: "30cm",
    depth: "15cm",
  },
  weight: "450g",
  warranty: "1 ano. Contra defeitos de fabricação.",
  capacity: "20 litros",
  pockets: 4,
  closure: "Zíper principal + bolsos laterais",
  adjustable: true,
  waterResistant: true,
  features: [
    'Compartimento acolchoado para notebook até 15"',
    "Bolso frontal organizador",
    "Alças ajustáveis e acolchoadas",
    "Porta-garrafa lateral",
    "Costas ventiladas",
  ],
};

export const capSpecification: AccessorySpecification = {
  type: "accessory",
  material: ["Algodão twill"],
  dimensions: {
    length: "Regulável (56-62cm)",
  },
  weight: "80g",
  warranty: "6 meses. Contra defeitos de fabricação.",
  closure: "Fivela ajustável",
  adjustable: true,
  waterResistant: false,
  features: [
    "Aba curva",
    "Bordado frontal",
    "6 painéis",
    "Ilhós de ventilação",
  ],
};

export const socksSpecification: AccessorySpecification = {
  type: "accessory",
  material: ["Algodão", "Poliéster", "Elastano"],
  composition: "Tecido misto de 70% Algodão, 27% Poliéster, 3% Elastano",
  weight: "40g (par)",
  warranty: "3 meses. Contra defeitos de fabricação.",
  features: [
    "Cano alto",
    "Arco compressivo",
    "Reforço no calcanhar e dedos",
    "Tecnologia anti-odor",
    "Lavar à máquina até 40°C",
    "Não usar alvejante",
  ],
};

// ==================== HELPER PARA OBTER SPEC POR CATEGORIA ====================

/**
 * Retorna uma especificação exemplo baseada no nome da categoria/produto
 */
export function getSpecificationByCategory(
  categoryName: string,
  productName?: string
):
  | ClothingSpecification
  | FootwearSpecification
  | AccessorySpecification
  | null {
  const name = (productName || categoryName).toLowerCase();

  // Roupas
  if (
    name.includes("camiseta") ||
    name.includes("t-shirt") ||
    name.includes("camisa")
  ) {
    if (
      name.includes("treino") ||
      name.includes("sport") ||
      name.includes("running")
    ) {
      return sportShirtSpecification;
    }
    return tShirtSpecification;
  }
  if (
    name.includes("moletom") ||
    name.includes("hoodie") ||
    name.includes("jaqueta")
  ) {
    return hoodieSpecification;
  }
  if (name.includes("short") || name.includes("bermuda")) {
    return shortsSpecification;
  }

  // Calçados
  if (name.includes("tênis") || name.includes("sneaker")) {
    if (name.includes("corrida") || name.includes("running")) {
      return runningShoeSpecification;
    }
    if (name.includes("basquete") || name.includes("basketball")) {
      return basketballShoeSpecification;
    }
    return sneakerSpecification;
  }
  if (
    name.includes("chinelo") ||
    name.includes("sandália") ||
    name.includes("slide")
  ) {
    return sandalSpecification;
  }

  // Acessórios
  if (name.includes("mochila") || name.includes("backpack")) {
    return backpackSpecification;
  }
  if (
    name.includes("boné") ||
    name.includes("cap") ||
    name.includes("chapéu")
  ) {
    return capSpecification;
  }
  if (name.includes("meia") || name.includes("sock")) {
    return socksSpecification;
  }

  return null;
}
