import { FaStar } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Yamuna Sharma',
      location: 'Bangalore • Google Review',
      initial: 'Y',
      bgColor: '#816047',
      review: "I purchased a sofa and storage cot and duroflex mattress from samrat agencies my experience has been excellent so far. The products are of great quality. I would especially like to thank Azar for assisting us throughout the process. He was extremely patient, polite, and answered all our queries clearly.",
    },
    {
      name: 'Kumuda T',
      location: 'Bangalore • Google Review',
      initial: 'K',
      bgColor: '#2F1A0F',
      review: "We bought peps mattress and a corner sofa from Samrat Agencies. The quality and selection provided by the shop was too good. The owner sent a temporary sofa to my home for the intermediate time so that I have place to sit! This is a commendable act for any shop owner!!",
    },
    {
      name: 'Deepak Pandey',
      location: 'Bangalore • Google Review',
      initial: 'D',
      bgColor: '#816047',
      review: "Had a great shopping experience at Samrat Agencies at Begur road. The quality of the products is excellent and the way the owner explains us in detail about each product made it easy for us to choose the right product. We are happy with our purchase and would recommend Samrat Agencies to everyone!",
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
