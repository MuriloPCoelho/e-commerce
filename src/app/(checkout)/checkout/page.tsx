import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CheckoutPage = async () => {
  return (
    <div className="grid p-4 gap-4">
      <div className="bg-white p-4 rounded-xs">
        <div className="flex justify-between mb-3">
          <h4 className="font-semibold text-lg">Addresses</h4>
          <Button variant="link" size="xs" className="underline">
            Change
          </Button>
        </div>
        <div className="text-xs">
          <div className="flex gap-4">
            <span className="font-bold">Murilo Pereira Coelho</span>
            <span>(51) 999999999</span>
          </div>
          <div className="text-neutral-500">
            <div>Rua Exemplo, 123 | Complemento - Bairro</div>
            <div>Cidade/UF - 99999-999</div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xs">
        <div className="flex justify-between mb-3">
          <h4 className="font-semibold text-lg">Payment</h4>
          <Button variant="link" size="xs" className="underline">
            Change
          </Button>
        </div>
        <div>
          <RadioGroup>
            <div className="flex">
              <RadioGroupItem value="credit-card" id="credit-card"/>
              <Label htmlFor="credit-card">Credit Card</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xs">
        <h4 className="font-semibold text-lg mb-3">Delivery</h4>
      </div>
      <div className="bg-white p-4 rounded-xs">
        <h4 className="font-semibold text-lg mb-3">Summary</h4>
      </div>
    </div>
  );
};

export default CheckoutPage;
