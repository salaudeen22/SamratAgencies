import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Samrat Agencies - Furniture Expert | Samsung Dealer | Bangalore',
  description = 'Samrat Agencies - Premium Furniture & Samsung Dealer in Bangalore. Established 1991. Rated 5.0★ with 108+ reviews.',
  keywords = 'furniture bangalore, samsung dealer, premium furniture, home furniture, office furniture, samrat agencies',
  image = '/samrat-logo.png',
  url = window.location.href,
  type = 'website',
  structuredData = null,
  product = null
}) => {
  const siteUrl = window.location.origin;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Generate product structured data if product is provided
  const getProductStructuredData = () => {
    if (!product) return null;

    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.map(img => img.url) || [fullImage],
      sku: product.sku || product._id,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Samrat Agencies'
      },
      offers: {
        '@type': 'Offer',
        url: fullUrl,
        priceCurrency: 'INR',
        price: product.price,
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Samrat Agencies'
        }
      },
      aggregateRating: product.rating && product.numReviews ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews
      } : undefined
    };
  };

  // Generate organization structured data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Samrat Agencies',
    image: fullImage,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+91-9880914457',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressRegion: 'KA',
      addressCountry: 'IN'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '108'
    },
    priceRange: '₹₹₹'
  };

  const finalStructuredData = structuredData || (product ? getProductStructuredData() : organizationStructuredData);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Samrat Agencies" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Samrat Agencies" />

      {/* Structured Data (JSON-LD) */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
