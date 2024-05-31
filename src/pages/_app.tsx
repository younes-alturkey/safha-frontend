import type { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import moment from 'moment'
import 'moment/locale/ar'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism-tomorrow.css'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Providers as AuthProvider } from 'src/@core/auth/providers'
import WindowWrapper from 'src/@core/components/window-wrapper'
import { SettingsConsumer, SettingsProvider, restoreSettings } from 'src/@core/context/settingsContext'
import ContainerLayout from 'src/@core/layouts/ContainerLayout'
import AppHead from 'src/@core/layouts/components/shared-components/AppHead'
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import * as utils from 'src/@core/utils'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import 'src/@fake-db'
import 'src/configs/i18n'
import metadata from 'src/configs/metadata'
import themeConfig from 'src/configs/themeConfig'
import 'src/iconify-bundle/icons-bundle-react'
import { store } from 'src/store'
import { APP_VERSION_BUILD } from 'src/types/constants'
import 'styles/globals.css'

const persistor = persistStore(store)

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { i18n } = useTranslation()
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const setConfig = Component.setConfig ?? undefined

  const initAppVersion = () => {
    const app_version_from_storage = localStorage.getItem('app_version')
    const app_version = app_version_from_storage ? JSON.parse(app_version_from_storage) : null
    if (!app_version) {
      localStorage.setItem('app_version', JSON.stringify(APP_VERSION_BUILD))

      return
    }
    const isNewer = utils.compareVersionStrings(app_version, APP_VERSION_BUILD) === 1
    if (isNewer) {
      localStorage.setItem('app_version', JSON.stringify(APP_VERSION_BUILD))
    }
  }

  const initSystem = () => {
    initAppVersion()
    utils.getUniqueId()
    const settings = restoreSettings()
    const language = settings?.language || 'en'
    i18n.changeLanguage(language)
    moment.locale(language)
    utils.reverseCrisp(language === 'ar')
    utils.safeCrisp()
  }

  useEffect(() => {
    initSystem()
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <AppHead metadata={metadata} />
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <ContainerLayout>
                        <WindowWrapper>
                          <Component {...pageProps} />
                        </WindowWrapper>
                      </ContainerLayout>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: 'react-hot-toast', duration: 5000 }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </CacheProvider>
  )
}

export default App
