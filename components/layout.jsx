import Head from 'next/head';

export const siteTitle = "Melody Maker";

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Melody Maker instantly generates sheet music and audio for simple melodies in any key with just a few inputs."
        />
        <meta
          property="og:image"
          content="/logo.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="og:description"
          content="Melody Maker instantly generates sheet music and audio for simple melodies in any key with just a few inputs."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content={siteTitle} />
        <meta name="robots" content="index, follow"/>
        <meta property="og:type" content="Website" />
        <title>{siteTitle}</title>
      </Head>
      <main>
        {children}
      </main>
    </div>
  );
}
