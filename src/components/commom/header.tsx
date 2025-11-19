import { getMenus } from "@/actions/get-menus";
import Bag from "./bag";
import NavigationDrawer from "./navigation-drawer";
import { UserDropdown } from "./user-dropdown";

const Header = async () => {
  const menus = await getMenus();
  
  return (
    <header className="pb-16 relative z-30">
      <div className="w-full flex items-center h-16 justify-between px-4 py-3 border-b border-neutral-100 fixed bg-white" >
        <div>
          <NavigationDrawer menus={menus} />
        </div>
        <div className="flex items-center gap-1">
          <UserDropdown />
          <Bag />
        </div>
      </div>
    </header>
  );
};

export default Header;
