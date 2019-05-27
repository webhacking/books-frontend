import Document, {
  Head,
  Main,
  NextScript,
  DocumentProps,
  NextDocumentContext,
  RenderPageResponse,
} from 'next/document';
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
      __NEXT_DATA__.ids = ids;
    }
  }

  public static async getInitialProps(context: NextDocumentContext): Promise<RenderPageResponse> {
    const page = context.renderPage();
    if (page.html) {
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
