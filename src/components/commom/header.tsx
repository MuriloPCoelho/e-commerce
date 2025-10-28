import { getMenus } from "@/actions/get-menus";
import Bag from "./bag";
import NavigationDrawer from "./navigation-drawer";

const Header = async () => {
  const menus = await getMenus();
  
  return (
    <header className="w-full flex items-center justify-between h-16 px-4 border-b">
      <div>
        <NavigationDrawer menus={menus} />
      </div>
      <div>
        <Bag />
      </div>
    </header>
  );
};

export default Header;
