export const APP_RELEASE_BUILD = 6

export const APP_RELEASE_VERSION = '1.2.3'

export const APP_RELEASE_NAME = 'safha-frontend'

export const APP_VERSION_BUILD = `${APP_RELEASE_VERSION}+${APP_RELEASE_BUILD}`

export const APP_RELEASE = `${APP_RELEASE_NAME}@${APP_VERSION_BUILD}`

export const bucketUrl = process.env.BUCKET_URL || 'https://storage.googleapis.com/safha-public-01'

export const USERS_ASSETS_BUCKET_NAME = process.env.USERS_ASSETS_BUCKET_NAME || 'public-users-assets'
