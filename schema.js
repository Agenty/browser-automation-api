const Joi = require('@hapi/joi');

const waitFor = [Joi.string(), Joi.number()];

const gotoOptions = Joi.object().keys({
  timeout: Joi.number().min(100).max(60000).default(30000),
  waitUntil: Joi.string()
    .valid('load', 'domcontentloaded', 'networkidle0', 'networkidle2')
    .default('networkidle2'),
  referer: Joi.string()
});

const authenticate = Joi.object().keys({
  password: Joi.string(),
  username: Joi.string(),
});

const setExtraHTTPHeaders = Joi.object().unknown();

const setJavaScriptEnabled = Joi.boolean();

const rejectRequestPattern = Joi.array().items(Joi.string()).default([]);

const addScriptTag = Joi.array().items(Joi.object().keys({
  url: Joi.string(),
  path: Joi.string(),
  content: Joi.string(),
  type: Joi.string(),
})).default([]);

const addStyleTag = Joi.array().items(Joi.object().keys({
  url: Joi.string(),
  path: Joi.string(),
  content: Joi.string(),
})).default([]);

const requestInterceptors = Joi.array().items(Joi.object().keys({
  pattern: Joi.string().required(),
  response: Joi.object().keys({
    body: Joi.alternatives([
      Joi.string(),
      Joi.binary(),
    ]).required(),
    contentType: Joi.string().required(),
    headers: Joi.object(),
    status: Joi.number().required(),
  }),
})).default([]);

const cookies = Joi.array().items(Joi.object({
  domain: Joi.string(),
  expires: Joi.number().min(0),
  httpOnly: Joi.boolean(),
  name: Joi.string().required(),
  path: Joi.string(),
  sameSite: Joi.string().valid('Strict', 'Lax'),
  secure: Joi.boolean(),
  url: Joi.string(),
  value: Joi.string().required(),
})).default([]);

const viewport = Joi.object().keys({
  deviceScaleFactor: Joi.number().min(0.01).max(100),
  hasTouch: Joi.boolean(),
  height: Joi.number().min(0).required(),
  isLandscape: Joi.boolean(),
  isMobile: Joi.boolean(),
  width: Joi.number().min(0).required(),
});

const screenshotSchema = Joi.object().keys({
  authenticate,
  addScriptTag,
  addStyleTag,
  cookies,
  gotoOptions,
  html: Joi.string(),
  userAgent: Joi.string(),
  manipulate: Joi.object().keys({
    resize: Joi.object().keys({
      width: Joi.number().integer().positive(),
      height: Joi.number().integer().positive(),
      fit: Joi.string()
        .valid('cover', 'contain', 'fill', 'inside', 'outside'),
      position: Joi.string()
        .valid('top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top')
    }),
    flip: Joi.boolean(),
    flop: Joi.boolean(),
    rotate: Joi.number(),
  }),
  options: Joi.object().keys({
    clip: Joi.object().keys({
      height: Joi.number().min(0),
      width: Joi.number().min(0),
      x: Joi.number().min(0),
      y: Joi.number().min(0),
    }),
    fullPage: Joi.boolean().default(true),
    omitBackground: Joi.boolean(),
    quality: Joi.number().min(0).max(100),
    type: Joi.string().valid('jpeg', 'png').default('png'),
  }).default(),
  rejectRequestPattern,
  rejectResourceTypes: Joi.array()
    .items(Joi.string())
    .default(['csp_report']),
  requestInterceptors,
  setExtraHTTPHeaders,
  setJavaScriptEnabled,
  url: Joi.string().uri().when('html', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
  viewport : Joi.object().keys({
    deviceScaleFactor: Joi.number().min(0.01).max(100).default(2),
    hasTouch: Joi.boolean().default(false),
    height: Joi.number().min(0).default(800),
    isLandscape: Joi.boolean().default(false),
    isMobile: Joi.boolean().default(false),
    width: Joi.number().min(0).default(1280),
  }).default(),
  waitFor,
  blockAds: Joi.boolean().default(false),
  anonymous: Joi.object().keys({
    proxy: Joi.alternatives().try(
      Joi.string().required(),
      Joi.boolean()
    ).default(false),
    skipResourceTypes: Joi.array()
      .items(Joi.string())
      .default(['image', 'stylesheet', 'font']),
  }).default(),

});

const contentSchema = Joi.object().keys({
  authenticate,
  addScriptTag,
  addStyleTag,
  cookies,
  gotoOptions,
  userAgent: Joi.string(),
  rejectRequestPattern,
  rejectResourceTypes: Joi.array()
    .items(Joi.string())
    .default(['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset']),
  requestInterceptors,
  setExtraHTTPHeaders,
  setJavaScriptEnabled,
  url: Joi.string().required().uri(),
  waitFor,
  blockAds: Joi.boolean().default(true),
  anonymous: Joi.object().keys({
    proxy: Joi.alternatives().try(
      Joi.string().required(),
      Joi.boolean()
    ).default(false),
    skipResourceTypes: Joi.array()
      .items(Joi.string())
      .default(['image', 'stylesheet', 'font']),
  }).default(),
});

const redirectSchema = Joi.object().keys({
  authenticate,
  addScriptTag,
  addStyleTag,
  cookies,
  gotoOptions,
  userAgent: Joi.string(),
  rejectRequestPattern,
  rejectResourceTypes: Joi.array()
    .items(Joi.string())
    .default(['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset']),
  requestInterceptors,
  setExtraHTTPHeaders,
  setJavaScriptEnabled,
  url: Joi.string().required().uri(),
  waitFor,
  blockAds: Joi.boolean().default(true),
  anonymous: Joi.object().keys({
    proxy: Joi.alternatives().try(
      Joi.string().required(),
      Joi.boolean()
    ).default(false),
    skipResourceTypes: Joi.array()
      .items(Joi.string())
      .default(['image', 'stylesheet', 'font']),
  }).default(),
});

const pdfSchema = Joi.object().keys({
  authenticate,
  addScriptTag,
  addStyleTag,
  cookies,
  emulateMedia: Joi.string().valid('screen', 'print'),
  gotoOptions,
  html: Joi.string(),
  userAgent: Joi.string(),
  options: Joi.object().keys({
    displayHeaderFooter: Joi.boolean(),
    footerTemplate: Joi.string(),
    format: Joi.string()
      .valid('Letter', 'Legal', 'Tabloid', 'Ledger', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6'),
    headerTemplate: Joi.string(),
    height: Joi.any().optional(),
    landscape: Joi.boolean(),
    margin: Joi.object().keys({
      bottom: Joi.string(),
      left: Joi.string(),
      right: Joi.string(),
      top: Joi.string(),
    }),
    pageRanges: Joi.string(),
    preferCSSPageSize: Joi.boolean(),
    printBackground: Joi.boolean(),
    scale: Joi.number().min(0),
    width: Joi.any().optional(),
  }),
  rejectRequestPattern,
  rejectResourceTypes: Joi.array()
    .items(Joi.string())
    .default(['csp_report']),
  requestInterceptors,
  rotate: Joi.number().valid(90, -90, 180),
  setExtraHTTPHeaders,
  setJavaScriptEnabled,
  url: Joi.string().uri(),
  viewport,
  waitFor,
  blockAds: Joi.boolean().default(false),
  anonymous: Joi.object().keys({
    proxy: Joi.alternatives().try(
      Joi.string().required(),
      Joi.boolean()
    ).default(false),
    skipResourceTypes: Joi.array()
      .items(Joi.string())
      .default(['image', 'stylesheet', 'font']),
  }).default(),
});

const scrapeSchema = Joi.object().keys({
  authenticate,
  addScriptTag,
  addStyleTag,
  cookies,
  debug: Joi.object().keys({
    console: Joi.boolean().default(false),
    cookies: Joi.boolean().default(false),
    html: Joi.boolean().default(false),
    network: Joi.boolean().default(false),
    screenshot: Joi.boolean().default(false),
  }),
  elements: Joi.array().items(Joi.object({
    selector: Joi.string(),
    timeout: Joi.number(),
  })).required(),
  gotoOptions,
  userAgent: Joi.string(),
  rejectRequestPattern,
  rejectResourceTypes: Joi.array()
    .items(Joi.string())
    .default(['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset']),
  requestInterceptors,
  setExtraHTTPHeaders,
  url: Joi.string().required().uri(),
  waitFor,
  blockAds: Joi.boolean().default(true),
  anonymous: Joi.object().keys({
    proxy: Joi.alternatives().try(
      Joi.string().required(),
      Joi.boolean()
    ).default(false),
    skipResourceTypes: Joi.array()
      .items(Joi.string())
      .default(['image', 'stylesheet', 'font']),
  }).default(),
});

const functionSchema = Joi.object().keys({
  code: Joi.string().required(),
  request: Joi.object(),
  logs: Joi.boolean().default(true),
  anonymous: Joi.object().keys({
    proxy: Joi.boolean().default(true),
    proxyAuthenticate : Joi.object().keys({
      username : Joi.string(),
      password : Joi.string()
    })
  }).default(),
});

module.exports = { screenshotSchema, contentSchema, redirectSchema, pdfSchema, scrapeSchema, functionSchema };
