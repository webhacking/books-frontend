import Document, { Head, Main, NextScript, DocumentProps, DocumentContext } from 'next/document';
import { extractCritical } from 'emotion-server';
import { EmotionCritical } from 'create-emotion-server';
import Favicon from 'src/pages/Favicon';
import Meta from 'src/pages/Meta';
import { PartialSeparator } from 'src/components/Misc';
import cheerio from 'cheerio';
import * as React from 'react';
import { cache } from 'emotion';
import { CacheProvider } from '@emotion/core';

interface StoreDocumentProps extends DocumentProps, EmotionCritical {
  nonce: string;
}

export default class StoreDocument extends Document<StoreDocumentProps> {
  public constructor(props: StoreDocumentProps) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      // @ts-ignore
      __NEXT_DATA__.ids = ids;
    }
  }

  public static async getInitialProps(context: DocumentContext) {
    const originalRenderPage = context.renderPage;

    context.renderPage = () => {
      return originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: App => props => <App {...props} />,
        // useful for wrapping in a per-page basis
        enhanceComponent: Component => Component,
      });
    };
    const page = context.renderPage();

    // @ts-ignore
    const { locals } = context.res;

    // @ts-ignore
    if (page.html) {
      // @ts-ignore
      const $ = cheerio.load(page.html);
      $('style').attr('nonce', locals.nonce);
      // @ts-ignore
      const styles = extractCritical($.html());
      return { ...page, ...styles, nonce: locals.nonce };
    }

    // @ts-ignore
    return { ...page, nonce: locals.nonce };
  }
  public render() {
    const isPartials = !!this.props.__NEXT_DATA__.page.match(/\/partials\//);
    const { nonce } = this.props;
    cache.nonce = nonce;
    return (
      <html lang="ko">
        <PartialSeparator name={'HEADER'} wrapped={isPartials}>
          <Head nonce={nonce}>
            {!isPartials && (
              <>
                <Meta />
                <Favicon />
                <link rel="manifest" href="/manifest.webmanifest" />
              </>
            )}
            <style nonce={nonce} dangerouslySetInnerHTML={{ __html: this.props.css }} />
          </Head>
        </PartialSeparator>
        <body>
          <CacheProvider value={cache}>
            <PartialSeparator name={'CONTENT'} wrapped={isPartials}>
              <Main />
            </PartialSeparator>
            <PartialSeparator name={'BOTTOM_SCRIPT'} wrapped={isPartials}>
              <NextScript nonce={nonce} />
            </PartialSeparator>
          </CacheProvider>
        </body>
      </html>
    );
  }
}
