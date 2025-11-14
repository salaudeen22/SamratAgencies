import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(['overview', 'catalog', 'sales', 'system']);

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const navigationStructure = [
    {
      category: 'overview',
      label: 'Overview',
      items: [
        {
          path: '/admin',
          label: 'Dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'catalog',
      label: 'Catalog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        {
          path: '/admin/categories',
          label: 'Categories',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        },
        {
          path: '/admin/attributes',
          label: 'Attributes',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          )
        },
        {
          path: '/admin/attribute-sets',
          label: 'Attribute Sets',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          )
        },
        {
          path: '/admin/products',
          label: 'Products',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'sales',
      label: 'Sales',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      items: [
        {
          path: '/admin/orders',
          label: 'Orders',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'system',
      label: 'System',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      items: [
        {
          path: '/admin/users',
          label: 'Users',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#f8fafc', overscrollBehavior: 'none' }}>
      {/* Top Navigation */}
      <div className="bg-white border-b fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              style={{ color: '#64748b' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm lg:text-base" style={{ backgroundColor: '#895F42' }}>
                SA
              </div>
              <div>
                <h1 className="text-base lg:text-xl font-bold" style={{ color: '#1e293b' }}>Admin Panel</h1>
                <p className="hidden lg:block text-xs" style={{ color: '#94a3b8' }}>Samrat Agencies</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: '#895F42' }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium" style={{ color: '#334155' }}>{user?.name}</span>
            </div>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors" style={{ color: '#64748b', backgroundColor: 'white', border: '1px solid #e2e8f0' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Site
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-white rounded-lg transition-all hover:shadow-md"
              style={{ backgroundColor: '#ef4444' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex relative pt-[65px] lg:pt-[73px]">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            style={{ top: '65px' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-[65px] lg:top-[73px] bottom-0 left-0 z-50
            w-64 lg:w-72 shadow-2xl flex flex-col
            h-[calc(100vh-65px)] lg:h-[calc(100vh-73px)]
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ backgroundColor: '#1e293b', borderRight: '1px solid #334155' }}
        >
          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-3 lg:p-4">
            <div className="space-y-4 lg:space-y-6">
              {navigationStructure.map((section) => (
                <div key={section.category}>
                  {section.items.length === 1 && section.category === 'overview' ? (
                    // Single item without category header
                    <Link
                      to={section.items[0].path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        group flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg
                        transition-all duration-200 font-medium text-sm lg:text-base
                        ${location.pathname === section.items[0].path
                          ? 'text-white shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-slate-700'
                        }
                      `}
                      style={location.pathname === section.items[0].path ? { backgroundColor: '#895F42' } : {}}
                    >
                      <div className={`${location.pathname === section.items[0].path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                        {section.items[0].icon}
                      </div>
                      <span>{section.items[0].label}</span>
                    </Link>
                  ) : (
                    // Category with subcategories
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleCategory(section.category)}
                        className="w-full flex items-center justify-between px-3 lg:px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
                            {section.icon}
                          </div>
                          <span className="text-xs lg:text-sm uppercase font-bold tracking-wide text-slate-400 group-hover:text-slate-200 transition-colors">
                            {section.label}
                          </span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-all duration-300 ${
                            expandedCategories.includes(section.category) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedCategories.includes(section.category) && (
                        <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-slate-700 ml-5">
                          {section.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`
                                group flex items-center gap-3 px-3 py-2 rounded-lg
                                transition-all duration-200 text-sm font-medium
                                ${location.pathname === item.path
                                  ? 'text-white shadow-md'
                                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
                                }
                              `}
                              style={location.pathname === item.path ? { backgroundColor: '#895F42' } : {}}
                            >
                              <div className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform shrink-0`}>
                                {item.icon}
                              </div>
                              <span className="truncate">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Fixed Footer at Bottom */}
          <div className="border-t-2 border-slate-700 p-3 lg:p-4 shrink-0">
            <div className="px-3 lg:px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-750 transition-colors mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0" style={{ backgroundColor: '#895F42' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">Administrator</p>
                </div>
              </div>
            </div>
            <div className="px-3 lg:px-4 text-right">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} Samrat Agencies
              </p>
              <p className="text-xs text-slate-600 mt-1">v1.0.0</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 w-full lg:ml-72">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
