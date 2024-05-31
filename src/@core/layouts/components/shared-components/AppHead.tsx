import Head from 'next/head'

export type Metadata = {
  viewport?: string
  title: string
  keywords: string
  description: string
  subject: string
  language: string
  robots: string
  revised: string
  abstract: string
  topic: string
  summary: string
  classification: string
  author: string
  designer: string
  replyTo: string
  owner: string
  url: string
  identifierURL: string
  directory: string
  category: string
  coverage: string
  distribution: string
  rating: string
  revisitAfter: string
  themeColor: string
  icon: string
  ogTitle: string
  ogType: string
  ogUrl: string
  ogImage: string
  ogSiteName: string
  ogDescription: string
  ogEmail: string
  ogPhoneNumber: string
  ogFaxNumber: string
  ogLatitude: string
  ogLongitude: string
  ogStreetAddress: string
  ogLocality: string
  ogRegion: string
  ogPostalCode: string
  ogCountryName: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  twitterUrl: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  appleMobileWebAppTitle: string
  applicationName: string
  msapplicationTileColor: string
  msapplicationTileImage: string
  msapplicationConfig?: string
  canonicalLink: string
}

interface Props {
  metadata: Metadata
}

export default function AppHead(props: Props) {
  return (
    <Head>
      {/* Viewport Meta Tag for Mobile Devices */}
      {props.metadata.viewport && <meta name='viewport' content={props.metadata.viewport} />}

      {/* Basic HTML Meta Tags */}
      <title>{props.metadata.title}</title>
      <meta name='keywords' content={props.metadata.keywords} />
      <meta name='description' content={props.metadata.description} />
      <meta name='subject' content={props.metadata.subject} />
      <meta name='language' content={props.metadata.language} />
      <meta name='robots' content={props.metadata.robots} />
      <meta name='revised' content={props.metadata.revised} />
      <meta name='abstract' content={props.metadata.abstract} />
      <meta name='topic' content={props.metadata.topic} />
      <meta name='summary' content={props.metadata.summary} />
      <meta name='Classification' content={props.metadata.classification} />
      <meta name='author' content={props.metadata.author} />
      <meta name='designer' content={props.metadata.designer} />
      <meta name='reply-to' content={props.metadata.replyTo} />
      <meta name='owner' content={props.metadata.owner} />
      <meta name='url' content={props.metadata.url} />
      <meta name='identifier-URL' content={props.metadata.identifierURL} />
      <meta name='directory' content={props.metadata.directory} />
      <meta name='category' content={props.metadata.category} />
      <meta name='coverage' content={props.metadata.coverage} />
      <meta name='distribution' content={props.metadata.distribution} />
      <meta name='rating' content={props.metadata.rating} />
      <meta name='revisit-after' content={props.metadata.revisitAfter} />
      <meta name='theme-color' content={props.metadata.themeColor} />
      <link rel='icon' href={props.metadata.icon} />

      {/* OpenGraph Meta Tags */}
      <meta property='og:title' content={props.metadata.ogTitle} />
      <meta property='og:type' content={props.metadata.ogType} />
      <meta property='og:url' content={props.metadata.ogUrl} />
      <meta property='og:image' content={props.metadata.ogImage} />
      <meta property='og:site_name' content={props.metadata.ogSiteName} />
      <meta property='og:description' content={props.metadata.ogDescription} />
      <meta property='og:email' content={props.metadata.ogEmail} />
      <meta property='og:phone_number' content={props.metadata.ogPhoneNumber} />
      <meta property='og:fax_number' content={props.metadata.ogFaxNumber} />
      <meta property='og:latitude' content={props.metadata.ogLatitude} />
      <meta property='og:longitude' content={props.metadata.ogLongitude} />
      <meta property='og:street-address' content={props.metadata.ogStreetAddress} />
      <meta property='og:locality' content={props.metadata.ogLocality} />
      <meta property='og:region' content={props.metadata.ogRegion} />
      <meta property='og:postal-code' content={props.metadata.ogPostalCode} />
      <meta property='og:country-name' content={props.metadata.ogCountryName} />

      {/* Twitter Meta Tags */}
      <meta name='twitter:card' content={props.metadata.twitterCard} />
      <meta name='twitter:site' content={props.metadata.twitterSite} />
      <meta name='twitter:creator' content={props.metadata.twitterCreator} />
      <meta name='twitter:url' content={props.metadata.twitterUrl} />
      <meta name='twitter:title' content={props.metadata.twitterTitle} />
      <meta name='twitter:description' content={props.metadata.twitterDescription} />
      <meta name='twitter:image' content={props.metadata.twitterImage} />

      {/* Additional Meta Tags */}
      <meta name='apple-mobile-web-app-title' content={props.metadata.appleMobileWebAppTitle} />
      <meta name='application-name' content={props.metadata.applicationName} />
      <meta name='msapplication-TileColor' content={props.metadata.msapplicationTileColor} />
      <meta name='msapplication-TileImage' content={props.metadata.msapplicationTileImage} />
      {props.metadata.msapplicationConfig && (
        <meta name='msapplication-config' content={props.metadata.msapplicationConfig} />
      )}
      <meta name='theme-color' content={props.metadata.themeColor} />

      {/* Canonical Link */}
      <link rel='canonical' href={props.metadata.canonicalLink} />
    </Head>
  )
}
