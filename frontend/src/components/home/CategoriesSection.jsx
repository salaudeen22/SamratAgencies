import { Link } from 'react-router-dom';
import { MdChair, MdOutlineBedroomParent, MdTableRestaurant } from 'react-icons/md';
import { GiSofa } from 'react-icons/gi';

const CategoriesSection = () => {
  const categories = [
    { name: 'Sofas', icon: GiSofa, link: '/products?category=sofas-sofa-sets' },
    { name: 'Beds', icon: MdOutlineBedroomParent, link: '/products?category=bedroom-furniture' },
    { name: 'Dining', icon: MdTableRestaurant, link: '/products?category=dining-room-furniture' },
    { name: 'Living Room', icon: MdChair, link: '/products?category=living-room-furniture' },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#2F1A0F' }}>Everything Your Home Needs</h2>
          <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>From cozy corners to statement pieces, we've got you covered</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.name} to={category.link}>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border-2" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#816047'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                  <div className="flex justify-center items-center mb-2 sm:mb-4" style={{ color: '#816047' }}>
                    <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#2F1A0F' }}>{category.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
