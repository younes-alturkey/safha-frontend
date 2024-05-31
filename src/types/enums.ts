export enum Events {
  SIGNED_UP = 'signed_up',
  SIGNED_IN = 'signed_in',
  SIGNED_OUT = 'signed_out',
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  SUBMITTED_PROMPT = 'submitted_prompt',
  SWITCHED_LOCALE = 'switched_locale',
  SWITCHED_MODE = 'switched_mode',
  GENERATED_SITE_SHOT = 'generated_site_shot'
}

export enum HTTP {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  PAYLOAD_TOO_LARGE = 413,
  UNSUPPORTED_MEDIA_TYPE = 415,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

export enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  get = 'get',
  delete = 'delete',
  head = 'head',
  HEAD = 'HEAD',
  options = 'options',
  OPTIONS = 'OPTIONS',
  post = 'post',
  put = 'put',
  patch = 'patch',
  PATCH = 'PATCH',
  purge = 'purge',
  PURGE = 'PURGE',
  link = 'link',
  LINK = 'LINK',
  unlink = 'unlink',
  UNLINK = 'UNLINK'
}
