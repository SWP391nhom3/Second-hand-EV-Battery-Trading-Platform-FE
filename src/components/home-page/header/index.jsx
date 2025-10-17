import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false); // ✅ thêm
  const toggleAvatar = () => setIsAvatarOpen(!isAvatarOpen); // ✅ thêm

  const navItems = [
    { id: 1, name: "Home", href: "#" },
    { id: 2, name: "Products", href: "#" },
    { id: 3, name: "Categories", href: "#" },
    { id: 4, name: "About", href: "#" },
    { id: 5, name: "Contact", href: "#" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  //   return (
  //     <header
  //       className={`fixed w-full top-0 z-50 ${
  //         isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
  //       } shadow-md transition-colors duration-300`}
  //     >
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="flex items-center justify-between h-16">
  //           <div className="flex-shrink-0">
  //             <img
  //               className="h-8 w-auto"
  //               src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
  //               alt="Logo"
  //               onError={(e) => {
  //                 e.target.onerror = null;
  //                 e.target.src = "https://via.placeholder.com/150";
  //               }}
  //             />
  //           </div>

  //           <nav className="hidden md:flex space-x-8">
  //             {navItems.map((item) => (
  //               <a
  //                 key={item.id}
  //                 href={item.href}
  //                 className="text-sm font-medium hover:text-blue-500 transition-colors duration-200"
  //               >
  //                 {item.name}
  //               </a>
  //             ))}
  //           </nav>

  //           <div className="flex items-center space-x-4">
  //             <button
  //               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  //               onClick={toggleDarkMode}
  //               aria-label="Toggle dark mode"
  //             >
  //               {isDarkMode ? "🌞" : "🌙"}
  //             </button>

  //             <div className="relative">
  //               <button
  //                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  //                 onClick={toggleCart}
  //                 aria-label="Shopping cart"
  //               >
  //                 <FiShoppingCart className="h-5 w-5" />
  //                 {cartCount > 0 && (
  //                   <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
  //                     {cartCount}
  //                   </span>
  //                 )}
  //               </button>

  //               {isCartOpen && (
  //                 <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
  //                   <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
  //                   <p className="text-gray-500 dark:text-gray-400">
  //                     Your cart is empty
  //                   </p>
  //                 </div>
  //               )}
  //             </div>

  //             <button
  //               className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  //               onClick={toggleMenu}
  //               aria-label="Toggle menu"
  //             >
  //               {isMenuOpen ? (
  //                 <FiX className="h-6 w-6" />
  //               ) : (
  //                 <FiMenu className="h-6 w-6" />
  //               )}
  //             </button>
  //           </div>
  //         </div>

  //         {isMenuOpen && (
  //           <div className="md:hidden">
  //             <div className="px-2 pt-2 pb-3 space-y-1">
  //               {navItems.map((item) => (
  //                 <a
  //                   key={item.id}
  //                   href={item.href}
  //                   className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  //                 >
  //                   {item.name}
  //                 </a>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </header>
  //   );
  // };
  // return (
  //   <header
  //     className={`fixed w-full top-0 z-50 ${
  //       isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
  //     } shadow-md transition-colors duration-300`}
  //   >
  //     <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
  //       <div className="flex items-center justify-between h-16">
  //         {/* Logo */}
  //         <div className="flex items-center gap-2">
  //           <img
  //             className="h-10 w-10 rounded-full shadow-sm"
  //             src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Volkswagen_logo_2019.svg"
  //             alt="Logo"
  //           />
  //           <span className="font-bold text-lg tracking-wide">E-Vehicle</span>
  //         </div>

  //         {/* Nav links */}
  //         <nav className="hidden md:flex items-center gap-8">
  //           {navItems.map((item) => (
  //             <a
  //               key={item.id}
  //               href={item.href}
  //               className="text-sm font-medium relative group"
  //             >
  //               {item.name}
  //               <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
  //             </a>
  //           ))}
  //         </nav>

  //         {/* Actions */}
  //         <div className="flex items-center gap-4">
  //           {/* Dark mode */}
  //           <button
  //             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  //             onClick={toggleDarkMode}
  //             aria-label="Toggle dark mode"
  //           >
  //             {isDarkMode ? "🌞" : "🌙"}
  //           </button>

  //           {/* Cart */}
  //           <div className="relative">
  //             <button
  //               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  //               onClick={toggleCart}
  //               aria-label="Shopping cart"
  //             >
  //               <FiShoppingCart className="h-5 w-5" />
  //               {cartCount > 0 && (
  //                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
  //                   {cartCount}
  //                 </span>
  //               )}
  //             </button>

  //             {isCartOpen && (
  //               <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700">
  //                 <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
  //                 <p className="text-gray-500 dark:text-gray-400 text-sm">
  //                   Your cart is empty
  //                 </p>
  //               </div>
  //             )}
  //           </div>

  //           {/* Mobile menu button */}
  //           <button
  //             className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  //             onClick={toggleMenu}
  //             aria-label="Toggle menu"
  //           >
  //             {isMenuOpen ? (
  //               <FiX className="h-6 w-6" />
  //             ) : (
  //               <FiMenu className="h-6 w-6" />
  //             )}
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Mobile menu */}
  //     {isMenuOpen && (
  //       <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
  //         <div className="px-4 py-3 space-y-2">
  //           {navItems.map((item) => (
  //             <a
  //               key={item.id}
  //               href={item.href}
  //               className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  //             >
  //               {item.name}
  //             </a>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </header>
  // );
  return (
    <header
      className={`fixed w-full top-0 z-50 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-md transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* --- Logo --- */}
          <div className="flex items-center gap-2">
            <img
              className="h-10 w-10 rounded-full shadow-sm"
              src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Volkswagen_logo_2019.svg"
              alt="Logo"
            />
            <span className="font-bold text-lg tracking-wide">E-Vehicle</span>
          </div>

          {/* --- Navigation (ẩn khi mobile) --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* --- Actions bên phải --- */}
          <div className="flex items-center gap-4">
            {/* Dark mode */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "🌞" : "🌙"}
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Your cart is empty
                  </p>
                </div>
              )}
            </div>

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-400 transition"
                onClick={toggleAvatar}
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User avatar"
                  className="rounded-full"
                />
              </button>
              {isAvatarOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    👤 Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ⚙️ Settings
                  </a>
                  <button
                    onClick={() => alert("Logged out!")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile menu --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
