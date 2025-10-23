import { Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

const QuantitySelector = () => {
  return ( 
    <ButtonGroup>
      <Button variant="outline" size="xs"><Minus /></Button>
      <Input type="number" min="1" defaultValue={1}  size="xs" max="999" maxLength={3} className="w-16 text-center"/>
      <Button variant="outline" size="xs"><Plus /></Button>
    </ButtonGroup>
   );
}
 
export default QuantitySelector;