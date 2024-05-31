import { faker } from '@faker-js/faker'
import * as Sentry from '@sentry/nextjs'
import { i18n } from 'i18next'
import moment from 'moment'
import { NextRouter } from 'next/router'
import { Settings } from 'src/@core/context/settingsContext'
import { Mode } from 'src/@core/layouts/types'
import { createEvent, getIPInfo } from 'src/api/analytics'
import { getSiteShot } from 'src/api/website'
import { Events, HTTP } from 'src/types/enums'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function setRootLocale(lang: string) {
  let dir = ''

  switch (lang) {
    case 'ar':
      dir = 'rtl'
      break
    default:
      dir = 'ltr'
      break
  }

  document.documentElement.dir = dir
  document.documentElement.lang = lang
}

export const ARABIC_REGEX = RegExp('^[\u0621-\u064A\u0660-\u0669 1-9]+$')

export const SA_PHONE_REGEX = RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)

export const NATIONAL_ID_REGEX = RegExp('^[0-9]{10}$')

export function compareVersionStrings(v1: string, v2: string): number {
  const splitVersion = (v: string) => v.split('+').shift()!.split('.').map(Number)
  const v1Parts = splitVersion(v1)
  const v2Parts = splitVersion(v2)
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0
    const v2Part = v2Parts[i] || 0
    if (v1Part > v2Part) return -1
    if (v1Part < v2Part) return 1
  }
  const buildNumber1 = parseInt(v1.split('+')[1] || '0', 10)
  const buildNumber2 = parseInt(v2.split('+')[1] || '0', 10)

  return buildNumber1 > buildNumber2 ? -1 : buildNumber1 < buildNumber2 ? 1 : 0
}

export function getArrRandomElements(arr: Array<any>, num = 8) {
  const result = []
  const arrCopy = arr.slice()
  while (result.length < num && arrCopy.length > 0) {
    const index = Math.floor(Math.random() * arrCopy.length)
    result.push(arrCopy.splice(index, 1)[0])
  }

  return result
}

export const colors = [
  '#F0F8FF',
  '#FAEBD7',
  '#00FFFF',
  '#7FFFD4',
  '#F0FFFF',
  '#F5F5DC',
  '#FFE4C4',
  '#000000',
  '#FFEBCD',
  '#0000FF',
  '#8A2BE2',
  '#A52A2A',
  '#DEB887',
  '#5F9EA0',
  '#7FFF00',
  '#D2691E',
  '#FF7F50',
  '#6495ED',
  '#FFF8DC',
  '#DC143C',
  '#00FFFF',
  '#00008B',
  '#008B8B',
  '#B8860B',
  '#A9A9A9',
  '#006400',
  '#BDB76B',
  '#8B008B',
  '#556B2F',
  '#FF8C00',
  '#9932CC',
  '#8B0000',
  '#E9967A',
  '#8FBC8F',
  '#483D8B',
  '#2F4F4F',
  '#00CED1',
  '#9400D3',
  '#FF1493',
  '#00BFFF',
  '#696969',
  '#1E90FF',
  '#B22222',
  '#FFFAF0',
  '#228B22',
  '#FF00FF',
  '#DCDCDC',
  '#F8F8FF',
  '#FFD700',
  '#DAA520',
  '#808080',
  '#008000',
  '#ADFF2F',
  '#F0FFF0',
  '#FF69B4',
  '#CD5C5C',
  '#4B0082',
  '#FFFFF0',
  '#F0E68C',
  '#E6E6FA',
  '#FFF0F5',
  '#7CFC00',
  '#FFFACD',
  '#ADD8E6',
  '#F08080',
  '#E0FFFF',
  '#FAFAD2',
  '#D3D3D3',
  '#90EE90',
  '#FFB6C1',
  '#FFA07A',
  '#20B2AA',
  '#87CEFA',
  '#778899',
  '#B0C4DE',
  '#FFFFE0'
]

export function extractWebsiteInfo(text: string) {
  const pattern = /\[WEBSITE_INFO_IS_HERE\](.*?)\[WEBSITE_INFO_IS_HERE\]/gs
  const matches = pattern.exec(text)

  return matches ? matches[1].trim() : ''
}

export function extractConfirmationMessage(text: string) {
  const pattern = /\[CONFIRMATION_MESSAGE_IS_HERE\](.*?)\[CONFIRMATION_MESSAGE_IS_HERE\]/gs
  const matches = pattern.exec(text)

  return matches ? matches[1].trim() : ''
}

export function shortenUuid(str: string) {
  if (str.length <= 8) return str

  return str.substring(0, 4) + '...' + str.substring(str.length - 4)
}

export function openCrisp() {
  // @ts-ignore
  if ($crisp) $crisp.push(['do', 'chat:open'])
}

export function reverseCrisp(reversed: boolean) {
  // @ts-ignore
  if ($crisp) $crisp.push(['config', 'position:reverse', [!reversed]])
}

export function safeCrisp() {
  // @ts-ignore
  if ($crisp) $crisp.push(['safe', true])
}

export function arrToKeyValueObject(array: any[]) {
  return array.reduce((acc, curr) => {
    const [key, value] = curr.split(': ').map((item: any) => item.trim())
    acc[key] = value

    return acc
  }, {})
}

export function objToArrayString(obj: object) {
  return Object.entries(obj).map(([key, value]) => `${key}: ${value}`)
}

export async function handleCreateEvent(name: string, id: string, fields: string[]) {
  try {
    let geo = null
    const ipInfoRes = await getIPInfo()
    if (ipInfoRes.status === HTTP.OK) {
      const info = ipInfoRes.data
      if (info.timezone) info.$timezone = info.timezone
      if (info.country) info.mp_country_code = info.country
      if (info.region) info.$region = info.region.split(' ')[0]
      if (info.city) info.$city = info.city
      if (info.ip) info.ip_address = info.ip
      geo = info
    }

    return await createEvent({
      name,
      id,
      fields: geo ? [...objToArrayString(geo), ...fields] : fields
    })
  } catch (err) {
    Sentry.captureException(err)
    console.error(err)
  }
}

export function generateTempId() {
  return `${faker.person.firstName()}_${faker.person.lastName()}`.toLocaleLowerCase()
}

export function getUniqueId() {
  const temp_id_from_storage = localStorage.getItem('temp_id')

  if (temp_id_from_storage) {
    return JSON.parse(temp_id_from_storage)
  } else {
    const temp_id = generateTempId()
    localStorage.setItem('temp_id', JSON.stringify(temp_id))

    return temp_id
  }
}

export function getAppRelease() {
  const app_version_from_storage = localStorage.getItem('app_version')

  return app_version_from_storage ? JSON.parse(app_version_from_storage) : '0.0.0+0'
}

export async function switchLocale(settings: Settings, saveSettings: (updatedSettings: Settings) => void, i18n: i18n) {
  const language = settings.language === 'ar' ? 'en' : 'ar'
  const direction = language === 'ar' ? 'rtl' : 'ltr'
  await i18n.changeLanguage(language)
  moment.locale(language)
  reverseCrisp(language === 'ar')
  saveSettings({ ...settings, direction: direction, language: language })
}

export function modeToggle(settings: Settings, saveSettings: (updatedSettings: Settings) => void) {
  let mode: Mode = 'light'
  if (settings.mode === 'light') {
    mode = 'dark'
  }
  saveSettings({ ...settings, mode: mode })
}

export function removeHttp(url: string) {
  return url.replace(/https?:\/\//g, '')
}

export function fromNowUnix(time = 1) {
  return Math.floor(Date.now() / 1000) + time
}

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

  let jsonPayload

  if (typeof window === 'undefined') {
    // Node.js environment
    jsonPayload = Buffer.from(base64, 'base64').toString()
  } else {
    // Browser environment
    const binaryString = window.atob(base64) // For broader compatibility, keeping window.atob for browsers
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    jsonPayload = new TextDecoder().decode(bytes)
  }

  return JSON.parse(jsonPayload)
}

export function resizeDimensions(width: number, height: number, maxWidth = 256, maxHeight = 256) {
  let newWidth = width
  let newHeight = height

  if (width > maxWidth) {
    newHeight = (maxWidth / width) * height
    newWidth = maxWidth
  }

  if (newHeight > maxHeight) {
    newWidth = (maxHeight / newHeight) * newWidth
    newHeight = maxHeight
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) }
}

export async function removeQueryParams(router: NextRouter) {
  await router.replace(
    {
      pathname: router.pathname,
      query: {}
    },
    undefined,
    { shallow: true }
  )
}

export async function handleUpdateSiteShot(
  url: string,
  siteShotCacheName: string,
  siteShotCacheExpName: string,
  session: any
) {
  const siteShotRes = await getSiteShot(url)
  if (siteShotRes.status === HTTP.OK) {
    const siteShot = siteShotRes.data.image
    localStorage.setItem(siteShotCacheName, JSON.stringify(siteShot))
    localStorage.setItem(siteShotCacheExpName, JSON.stringify(fromNowUnix(4 * 60 * 60)))
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
    handleCreateEvent(Events.GENERATED_SITE_SHOT, email, [`user_email: ${email}`, `url: ${url}`])

    return siteShot
  }

  return null
}

export async function handleGetSiteShot(url: string, session: any) {
  const santizedUrl = removeHttp(url)
  const siteShotCacheName = `site_shot_cache_${santizedUrl}`
  const siteShotCacheExpName = `site_shot_cache_exp_${santizedUrl}`
  const siteShotFromStorage = localStorage.getItem(siteShotCacheName)
  const siteShotExpFromStorage = localStorage.getItem(siteShotCacheExpName)
  if (siteShotExpFromStorage && siteShotFromStorage) {
    const cachedSiteShotExp = JSON.parse(siteShotExpFromStorage)
    const now = Math.floor(Date.now() / 1000)
    if (cachedSiteShotExp && now > cachedSiteShotExp)
      return await handleUpdateSiteShot(url, siteShotCacheName, siteShotCacheExpName, session)
    else return JSON.parse(siteShotFromStorage)
  } else return await handleUpdateSiteShot(url, siteShotCacheName, siteShotCacheExpName, session)
}

export function sortArr(arr: any) {
  const newArr = [...arr]

  return newArr.sort((a: any, b: any) => a.created_at - b.created_at)
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isUrl(value: any): boolean {
  try {
    new URL(value)

    return true
  } catch {
    return false
  }
}

export function jsonToBase64(json: object): string {
  const jsonString = JSON.stringify(json)
  const base64String = Buffer.from(jsonString).toString('base64')

  return base64String
}

export function base64ToJson(base64: string): object {
  const jsonString = Buffer.from(base64, 'base64').toString()
  const json = JSON.parse(jsonString)

  return json
}

export function toMb(megabytes: number): number {
  return megabytes * 1024 * 1024
}

export function deepCompare(obj1: any, obj2: any): boolean {
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || !deepCompare(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export function createObjectURL(obj: any) {
  try {
    return URL.createObjectURL(obj as any)
  } catch (err) {
    return null
  }
}

export function canCreateObjectURL(object: any) {
  return object instanceof Blob || object instanceof File || object instanceof MediaSource
}

export function isTeamFilled(
  team: Array<{
    name: string
    title: string
    bio: string
    photo: any
    uploading: boolean
    deleting: boolean
  }>
): boolean {
  return team.every(member => member.name !== '' && member.title !== '')
}

export function isServicesFilled(
  services: Array<{
    title: string
    description: string
  }>
): boolean {
  return services.every(service => service.title !== '' && service.description !== '')
}

export function isProjectsFilled(
  projects: Array<{
    title: string
    description: string
  }>
): boolean {
  return projects.every(project => project.title !== '' && project.description !== '')
}

export function isProductsFilled(
  products: Array<{
    title: string
    description: string
  }>
): boolean {
  return products.every(product => product.title !== '' && product.description !== '')
}

export function isEndorsementsFilled(
  endorsements: Array<{
    name: string
    endorsement: string
  }>
): boolean {
  return endorsements.every(endorsement => endorsement.name !== '' && endorsement.endorsement !== '')
}

export function isArrayEmpty(arr: any[]): boolean {
  try {
    return arr.length === 0
  } catch (err) {
    return false
  }
}

export function numArray(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i + 1)
}
