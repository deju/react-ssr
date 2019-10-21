import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { SsrProvider } from './ssr';
import { Config } from './config';
import {
  getBabelrc,
  getPageId,
} from './helpers';

const codec = require('json-url')('lzw');

let babelRegistered = false;

export const render = async (file: string, props: object, config: Config): Promise<string> => {
  if (!babelRegistered) {
    require('@babel/register')({
      extends: getBabelrc(),
    });
    babelRegistered = true;
  }

  const script = `/_react-ssr/${getPageId(file, config, '/')}.js?props=${await codec.compress(props)}`;

  let Page = require(file);

  console.log('test');

  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToStaticMarkup(
    <SsrProvider script={script}>
      <Page {...props} />
    </SsrProvider>
  );

  return html;
};
