import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
}

const SITE_NAME = 'Pet Shop';

export default function Seo({ title, description, image }: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={image ? 'product' : 'website'} />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
