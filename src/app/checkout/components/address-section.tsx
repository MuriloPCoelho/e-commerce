"use client";

import { Button } from "@/components/ui/button";

const AddressSection = () => {
  return (
    <div className="bg-white p-4 rounded-xs">
      <div className="flex justify-between mb-3">
        <h4 className="font-semibold text-lg">Address</h4>
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
  );
};

export default AddressSection;
