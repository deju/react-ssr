import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import {
  convertAttrToString,
  getHeadHtml,
} from './helpers';

const Head = require('./head');

const { ServerStyleSheet } = require('styled-components');

export default (app: React.ReactElement, pageId: string, props: string, htmlExtra: { head?: string; body?: string; }) => {
  const sheet = new ServerStyleSheet();
  try {
    const html = ReactDOMServer.renderToString(sheet.collectStyles(app));
    const styleTags = sheet.getStyleTags();

    const $ = cheerio.load(html);
    const scriptTags = $.html($('body script'));
    const bodyWithoutScriptTags = ($('body').html() || '').replace(scriptTags, '');

    return `<!DOCTYPE html><html${convertAttrToString($('html').attr())}><head>${getHeadHtml(Head.rewind())}<link rel="preload" href="/_react-ssr/${pageId}.js" as="script"><link rel="preload" href="/_react-ssr/${pageId}.css" as="style"><link rel="stylesheet" href="/_react-ssr/${pageId}.css">${styleTags}${htmlExtra.head || ''}</head><body${convertAttrToString($('body').attr())}><div id="react-ssr-root">${bodyWithoutScriptTags}</div><script id="react-ssr-script" src="/_react-ssr/${pageId}.js" data-props="${props}" defer></script>${scriptTags}${htmlExtra.body || ''}</body></html>`;
  } finally {
    sheet.seal();
  }
};
