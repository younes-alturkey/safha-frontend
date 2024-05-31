import Mixpanel from 'mixpanel'

const globalForMixpanel: any = global

const mixpanel = globalForMixpanel.mixpanel || Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN as string)

globalForMixpanel.mixpanel = mixpanel

export default mixpanel
