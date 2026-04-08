import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <aside className="h-screen w-0 md:w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col py-8 px-6 z-50 overflow-y-auto overflow-x-hidden transition-all duration-300 -translate-x-full md:translate-x-0 border-r border-outline-variant/20 hidden md:flex font-manrope">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tighter text-on-surface">StoreMini</div>
            <div className="text-[10px] uppercase tracking-widest text-outline font-bold">Inventory System</div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {/* Dashboard (Inactive) */}
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight text-on-surface-variant hover:text-primary transition-colors duration-200 group">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            <span>Dashboard</span>
          </a>
          
          {/* Products (Active) */}
          <Link
            to="/products"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight transition-all relative ${
              isActive('/products') || location.pathname === '/' 
                ? "text-primary before:content-[''] before:absolute before:left-0 before:w-1 before:h-8 before:bg-primary before:rounded-r-full"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
            <span>Products</span>
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/products/new"
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight transition-all relative ${
                isActive('/products/new') 
                  ? "text-primary before:content-[''] before:absolute before:left-0 before:w-1 before:h-8 before:bg-primary before:rounded-r-full"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
              <span>Add Product</span>
            </Link>
          )}

          {/* Settings (Inactive) */}
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight text-on-surface-variant hover:text-primary transition-colors duration-200">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        
        <div className="mt-auto space-y-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-error py-3 px-4 rounded-lg font-manrope text-sm font-bold border border-error/20 hover:bg-error-container/50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-primary py-3 px-4 rounded-lg font-manrope text-sm font-bold border border-primary/20 hover:bg-primary-container/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Log In
            </button>
          )}
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-40 border-b border-outline-variant/20 md:border-none">
        
        {/* Mobile Hamburger Layout (Since Sidebar is hidden on mobile) */}
        <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-sm" data-icon="inventory_2">inventory_2</span>
            </div>
            <span className="text-sm font-bold tracking-tighter text-on-surface">StoreMini</span>
        </div>

        <div className="hidden md:flex items-center bg-surface-container-high px-4 py-2 rounded-lg w-96 transition-all focus-within:ring-2 ring-primary/20">
          <span className="material-symbols-outlined text-outline mr-2" data-icon="search">search</span>
          <input 
            type="text" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-body text-on-surface placeholder:text-outline" 
            placeholder="Search inventory..." 
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <button className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
            <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
          </button>
          <div className="hidden sm:block h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-on-surface">{user ? user.name : 'Guest'}</div>
              <div className="text-[10px] text-outline">{user ? 'Administrator' : 'Visitor'}</div>
            </div>
            {user ? (
               <img 
                 src={user.avatar} 
                 alt={user.name}
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4648d4&color=fff`
                 }}
                 className="w-8 h-8 rounded-full border-2 border-surface shadow-sm object-cover bg-surface-variant" 
               />
            ) : (
               <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">person</span>
               </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
