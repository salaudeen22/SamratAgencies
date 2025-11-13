import { FaStar } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Mumbai • Young Family',
      initial: 'R',
      bgColor: '#895F42',
      review: "We didn't think we could afford a sofa this beautiful! It's become the heart of our living room where the family gathers every evening. Worth every rupee.",
    },
    {
      name: 'Priya Sharma',
      location: 'Delhi • First Home',
      initial: 'P',
      bgColor: '#1F2D38',
      review: "Setting up our first home felt overwhelming until we found Samrat. The team understood exactly what we needed and made it so easy. Our bedroom looks straight out of a magazine!",
    },
    {
      name: 'Amit Patel',
      location: 'Bangalore • Loyal Customer',
      initial: 'A',
      bgColor: '#895F42',
      review: "Three years later, our dining table still looks brand new. Quality that lasts is rare these days. We've recommended Samrat to all our friends—they're family now!",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Real Homes, Real Stories</h2>
          <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Hear from families who found their perfect fit</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"{testimonial.review}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: testimonial.bgColor, color: '#E5EFF3' }}>
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>{testimonial.name}</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>{testimonial.location}</div>
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
