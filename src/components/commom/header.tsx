import { getMenus } from "@/actions/get-menus";
import Bag from "./bag";
import NavigationDrawer from "./navigation-drawer";

const Header = async () => {
  const menus = await getMenus();
  
  return (
    <header className="pb-16 relative z-30">
      <div className="w-full flex items-center justify-between h-16 px-4 border-b border-neutral-100 fixed bg-white" >
        <div>
          <NavigationDrawer menus={menus} />
        </div>
        <div>
          <Bag />
        </div>
      </div>
    </header>
  );
};

export default Header;
