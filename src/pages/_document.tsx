import Document, { Head, Main, NextScript, DocumentProps, DocumentContext } from 'next/document';
import { extractCritical } from 'emotion-server';
import { EmotionCritical } from 'create-emotion-server';
import Favicon from 'src/pages/Favicon';
import Meta from 'src/pages/Meta';
import { PartialSeparator } from 'src/components/Misc';
import * as React from 'react';

interface StoreDocumentProps extends DocumentProps, EmotionCritical {}

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
    const page = context.renderPage();

    // @ts-ignore
    if (page.html) {
      // @ts-ignore
      const styles = extractCritical(page.html);
      return { ...page, ...styles };
    }
    return { ...page };
  }
  public render() {
    const isPartials = !!this.props.__NEXT_DATA__.page.match(/\/partials\//);
    return (
      <html lang="ko">
        <PartialSeparator name={'HEADER'} wrapped={isPartials}>
          <Head>
            {!isPartials && (
              <>
                <Meta />
                <Favicon />
                <link rel="manifest" href="/manifest.webmanifest" />
              </>
            )}
            <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          </Head>
        </PartialSeparator>
        <body>
          <PartialSeparator name={'CONTENT'} wrapped={isPartials}>
            <Main />
          </PartialSeparator>
          <PartialSeparator name={'BOTTOM_SCRIPT'} wrapped={isPartials}>
            <NextScript />
          </PartialSeparator>
        </body>
      </html>
    );
  }
}
