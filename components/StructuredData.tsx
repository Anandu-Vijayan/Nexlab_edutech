export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'NeXlab Edu Hub',
    alternateName: 'NeXlab',
    url: 'https://nexlab.in',
    logo: 'https://nexlab.in/images/nexlab-logo.png',
    description:
      "India's first immersive learning platform delivering next-level, hands-on educational experiences through VR, AR, AI tutors, and AVGC studios.",
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9895767256',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Malayalam'],
    },
    sameAs: ['https://instagram.com/nexlab', 'https://linkedin.com/company/nexlab', 'https://youtube.com/@nexlab'],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Course',
          name: 'VR Science Lab',
          description: 'Step inside science with VR experiences designed for grades 6-10',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '4999',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Course',
          name: 'AR Math Adventures',
          description: 'Learn math through augmented reality for grades 4-8',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '3499',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Course',
          name: 'Game Design 101',
          description: 'Learn game design fundamentals for ages 12+',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '6999',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Course',
          name: 'Animation & VFX',
          description: 'Learn animation and visual effects for ages 14+',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '8499',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Course',
          name: 'AI for Teens',
          description: 'Introduction to artificial intelligence for ages 13+',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '5999',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'Course',
          name: 'Robotics Studio',
          description: 'Hands-on robotics learning for grades 7-12',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
          offers: {
            '@type': 'Offer',
            price: '7499',
            priceCurrency: 'INR',
          },
        },
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NeXlab Edu Hub',
    url: 'https://nexlab.in',
    description: "India's first immersive learning platform",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nexlab.in/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
