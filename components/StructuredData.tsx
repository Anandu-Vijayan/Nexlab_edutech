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
      telephone: '+91-8848271413',
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
          name: 'Nexseed course (Prekg to +2) (foundation)',
          description: 'Foundation course from Prekg to +2',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Course',
          name: 'Nexup course (Prekg to +2) (academics)',
          description: 'Academic course from Prekg to +2',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Course',
          name: 'Vedic maths 5 to 10',
          description: 'Vedic maths course for grades 5 to 10',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Course',
          name: 'Speak lab course',
          description: 'Language and communication development course',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Course',
          name: 'Vacation courses',
          description: 'Short-term courses during vacation periods',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'Course',
          name: 'Madrasa classes',
          description: 'Structured madrasa learning classes',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 7,
        item: {
          '@type': 'Course',
          name: 'Arabic reading and writing',
          description: 'Arabic reading and writing classes for learners',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'NeXlab Edu Hub',
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
