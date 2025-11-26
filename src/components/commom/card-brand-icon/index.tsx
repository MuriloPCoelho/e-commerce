import UnknownCardIcon from "./unknown-card-icon";

const CardBrandIcon = ({ brand, size }: { brand: string; size: number }) => {
  switch (brand.toLowerCase()) {
    case "visa":
      const VisaIcon = require("./visa-icon").default;
      return <VisaIcon size={size} />;
    case "mastercard":
      const MastercardIcon = require("./mastercard-icon").default;
      return <MastercardIcon size={size} />;
    default:
      return <UnknownCardIcon size={size} />;
  }
};

export default CardBrandIcon;
