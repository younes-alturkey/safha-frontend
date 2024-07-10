import createEmotionServer from '@emotion/server/create-instance'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// const renderCrispSnippet = () => {
//   return `window.$crisp=[];window.CRISP_WEBSITE_ID="9d9ec0fe-6972-4c67-8437-062fde4c5fc4";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`
// }

// // const renderFeedBearSnippet = () => {
// //   return `(function (w, d, s, o, f, js, fjs) { w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) }; js = d.createElement(s), fjs = d.getElementsByTagName(s)[0]; js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs); }(window, document, 'script', 'FeedBear', 'https://sdk.feedbear.com/widget.js'));
// //   FeedBear("button", {
// //   element: document.querySelector("[data-feedbear-button]"),
// //   project: "safha",
// //   board: "ideas",
// //   jwt: "fbear-jwt-qwD6EVKSuCER7zUvHdjNEAnX",
// //   });`
// // }

// const renderGoogleTagManagerSnippet = (measurementId: string) => {
//   return ` window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', '${measurementId}', {
//       page_path: window.location.pathname,
//   });`
// }

class CustomDocument extends Document {
  render() {
    return (
      <Html id='html' data-testid='html'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
          <link
            href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap'
            rel='stylesheet'
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <Script
            id='crisp-script'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: renderCrispSnippet()
            }}
          />
          <Script
            id='gtag-script'
            strategy='afterInteractive'
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
          />
          <Script
            id='gtag-manager'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: renderGoogleTagManagerSnippet(process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID as string)
            }}
          /> */}
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        )
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
