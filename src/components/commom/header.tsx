"use client";

import Bag from "./bag";
import NavigationDrawer from "./navigation-drawer";

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between h-16 px-4 border-b">
      <div>
        <NavigationDrawer />
      </div>
      <div>
        <Bag />
      </div>
    </header>
  );
};

export default Header;
