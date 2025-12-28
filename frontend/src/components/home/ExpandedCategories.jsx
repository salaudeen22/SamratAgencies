import { Link } from 'react-router-dom';
import {
  MdChair,
  MdTableRestaurant,
  MdTv,
  MdTableBar,
  MdDoorSliding,
  MdStoreMallDirectory
} from 'react-icons/md';
import { GiSofa, GiOfficeChair, GiWoodenChair, GiLockers } from 'react-icons/gi';
import { FaBed } from 'react-icons/fa';
import { BiCabinet } from 'react-icons/bi';

const ExpandedCategories = () => {
  const categories = [
    {
      name: 'Study Tables',
      slug: 'study-tables-desks',
      icon: MdTableBar,
      badge: 'Popular',
      color: '#816047'
    },
    {
      name: 'Steel Almirahs',
      slug: 'steel-almirah',
      icon: GiLockers,
      badge: 'Best Seller',
      color: '#D7B790'
    },
    {
      name: 'TV Units',
      slug: 'tv-units-cabinets',
      icon: MdTv,
      color: '#816047'
    },
    {
      name: 'Sofas',
      slug: 'sofas-sofa-sets',
      icon: GiSofa,
      color: '#CDAA82'
    },
    {
      name: 'Beds',
      slug: 'beds',
      icon: FaBed,
      color: '#816047'
    },
    {
      name: 'Mattresses',
      slug: 'mattresses',
      icon: FaBed,
      color: '#D7B790'
    },
    {
      name: 'Dining Sets',
      slug: 'dining-sets',
      icon: MdTableRestaurant,
      color: '#CDAA82'
    },
    {
      name: 'Office Furniture',
      slug: 'office-study-furniture',
      icon: GiOfficeChair,
      color: '#816047'
    },
    {
      name: 'Wardrobes',
      slug: 'wardrobes-almirahs',
      icon: BiCabinet,
      color: '#D7B790'
    },
    {
      name: 'Living Room',
      slug: 'living-room-furniture',
      icon: MdChair,
      color: '#CDAA82'
    },
    {
      name: 'Storage',
      slug: 'storage-utility-furniture',
      icon: MdStoreMallDirectory,
      color: '#816047'
    },
    {
      name: 'Dressing Tables',
      slug: 'dressers-mirrors',
      icon: MdDoorSliding,
      color: '#D7B790'
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: '#2F1A0F' }}>
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base md:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
            Find exactly what you need for every room
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group relative"
              >
                <div
                  className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-2xl p-3 sm:p-4 md:p-6 text-center transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 cursor-pointer border-2 relative overflow-hidden"
                  style={{ borderColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = category.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {category.badge && (
                    <div
                      className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold"
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      {category.badge}
                    </div>
                  )}

                  <div
                    className="flex justify-center items-center mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: category.color }}
                  >
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                  </div>
                  <h3
                    className="text-xs sm:text-sm md:text-base font-bold transition-colors duration-300 leading-tight"
                    style={{ color: '#2F1A0F' }}
                  >
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExpandedCategories;
