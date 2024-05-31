import sgMail from '@sendgrid/mail'
import formidable from 'formidable'
import * as fs from 'fs'
import NextCors from 'nextjs-cors'
import Template from 'src/email/contact'
import { HTTP } from 'src/types/enums'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 32,
  allowEmptyFiles: false,
  multiples: false
}

function formidablePromise(req: any, opts: any) {
  return new Promise((accept, reject) => {
    const form = formidable(opts)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      return accept({ fields, files })
    })
  })
}

function buildHtml(fields: any, fileNames: any) {
  const keys = Object.keys(fields)
  let htmlMiddlePart = ``

  for (let i = 2; i < keys.length; i++) {
    const key = keys[i]
    const field = fields[key]

    if (!field) continue

    const p = `<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" > <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; color: #000000; border-top: 1px solid #f5f5f5; border-right: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5; border-left: 1px solid #f5f5f5; border-radius: 0; width: 600px; margin-top: 8px; " width="600" > <tbody> <tr> <td class="column column-1" width="100%" style=" mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 15px; padding-right: 15px; vertical-align: middle; padding-top: 15px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; " > <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" > <tr> <td class="pad" style="width: 100%; text-align: center"> <h3 style=" margin: 0; color: #000000; font-size: 24px; font-family: IBM Plex Sans Arabic, Verdana, Geneva, sans-serif; line-height: 200%; text-align: left; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0; text-transform: capitalize;" > <span class="tinyMce-placeholder">${key}</span> </h3> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word" > <tr> <td class="pad"> <div style=" color: #47da99; font-size: 16px; font-family: IBM Plex Sans Arabic, Verdana, Geneva, sans-serif; font-weight: 400; line-height: 200%; text-align: left; direction: ltr; letter-spacing: 0px; mso-line-height-alt: 32px; " > <p style="margin: 0">${field}</p> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>`

    htmlMiddlePart += p
  }

  for (let j = 0; j < fileNames.length; j++) {
    const fileName = fileNames[j]

    const p = `<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" > <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style=" mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5; color: #000000; border-top: 1px solid #f5f5f5; border-right: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5; border-left: 1px solid #f5f5f5; border-radius: 0; width: 600px; margin-top: 8px; " width="600" > <tbody> <tr> <td class="column column-1" width="100%" style=" mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 15px; padding-right: 15px; vertical-align: middle; padding-top: 15px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; " > <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" > <tr> <td class="pad" style="width: 100%; text-align: center"> <h3 style=" margin: 0; color: #000000; font-size: 24px; font-family: IBM Plex Sans Arabic, Verdana, Geneva, sans-serif; line-height: 200%; text-align: left; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0; text-transform: capitalize;" > <span class="tinyMce-placeholder">${fileName}</span> </h3> </td> </tr> </table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word" > <tr> <td class="pad"> <div style=" color: #47da99; font-size: 16px; font-family: IBM Plex Sans Arabic, Verdana, Geneva, sans-serif; font-weight: 400; line-height: 200%; text-align: left; direction: ltr; letter-spacing: 0px; mso-line-height-alt: 32px; " > <p style="margin: 0">See email attachment.</p> </div> </td> </tr> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>`

    htmlMiddlePart += p
  }

  const template: any = Template
  const html = template.htmlUpperPart + htmlMiddlePart + template.htmlLowerPart

  return html
}

function buildAttachments(filesNames: any, files: any) {
  return filesNames
    ? filesNames.map((f: any) => {
        const file = files[f][0]

        return {
          filename: file.originalFilename,
          type: file.mimetype,
          content: Buffer.from(fs.readFileSync(file.filepath)).toString('base64'),
          disposition: 'attachment'
        }
      })
    : null
}

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Sends an email with attachments
 *     description: Sends an email with attachments
 *     responses:
 *       200:
 *         description: Successfully sent an email with attachments
 *       400:
 *         description: Failed to send an email with attachments
 *       401:
 *         description: Unauthorized request
 *       405:
 *         description: Requested method is not allowed
 *       500:
 *         description: Internal server error occured
 */

export async function handler(req: any, res: any) {
  try {
    await NextCors(req, res, {
      methods: ['HEAD', 'POST'],
      origin: '*',
      optionsSuccessStatus: HTTP.OK
    })

    if (!req.headers.origin) {
      return res.status(HTTP.UNAUTHORIZED).json({ error: 'Access denied' })
    }

    if (req.method !== 'POST')
      return res.status(HTTP.METHOD_NOT_ALLOWED).json({ error: `Method ${req.method} Not Allowed.` })

    const { fields, files }: any = await formidablePromise(req, {
      ...formidableConfig
    })

    const to = fields['to'][0]
    const subject = fields['sub'][0]
    const from = 'noreply@safha.com'

    if (!to || !subject)
      return res.status(HTTP.BAD_REQUEST).json({
        error: `You didn't specify 'to' or 'sub' fields.`
      })

    const filesNames = Object.keys(files)
    const html = buildHtml(fields, filesNames)
    const attachments = buildAttachments(filesNames, files)

    const msg: any = {
      from,
      to,
      subject,
      html,
      attachments
    }

    await sgMail.send(msg)

    return res.status(HTTP.OK).json({
      message: `Sent the email to ${to}.`
    })
  } catch (err: any) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
