import { FaStar } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Mumbai • Young Family',
      initial: 'R',
      bgColor: '#816047',
      review: "We didn't think we could afford a sofa this beautiful! It's become the heart of our living room where the family gathers every evening. Worth every rupee.",
    },
    {
      name: 'Priya Sharma',
      location: 'Delhi • First Home',
      initial: 'P',
      bgColor: '#2F1A0F',
      review: "Setting up our first home felt overwhelming until we found Samrat. The team understood exactly what we needed and made it so easy. Our bedroom looks straight out of a magazine!",
    },
    {
      name: 'Amit Patel',
      location: 'Bangalore • Loyal Customer',
      initial: 'A',
      bgColor: '#816047',
      review: "Three years later, our dining table still looks brand new. Quality that lasts is rare these days. We've recommended Samrat to all our friends—they're family now!",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#2F1A0F' }}>Real Homes, Real Stories</h2>
          <p className="text-base sm:text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Hear from families who found their perfect fit</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #D7B790' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#D7B790' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#2F1A0F' }}>"{testimonial.review}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: testimonial.bgColor, color: '#E6CDB1' }}>
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: '#2F1A0F' }}>{testimonial.name}</div>
                  <div className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
