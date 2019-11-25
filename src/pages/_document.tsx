import Document, {
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import { extractCritical } from 'emotion-server';
import { EmotionCritical } from 'create-emotion-server';
import Favicon from 'src/pages/Favicon';
import Meta from 'src/pages/Meta';
import { PartialSeparator } from 'src/components/Misc';
// import cheerio from 'cheerio';
import * as React from 'react';
import { css } from '@emotion/core';

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

    context.renderPage = nonce =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        // @ts-ignore
        enhanceApp: App => props => <App {...props} nonce={nonce} />,
        // useful for wrapping in a per-page basis
        enhanceComponent: Component => props => <Component {...props} />,
      });
    // @ts-ignore
    const { locals } = context.res;
    const page = context.renderPage(locals.nonce);

    // @ts-ignore
    if (page.html) {
      // @ts-ignore
      const styles = extractCritical(page.html);
      return { ...page, ...styles, nonce: locals.nonce };
    }

    // @ts-ignore
    return { ...page, nonce: locals.nonce };
  }

  public render() {
    const isPartials = !!this.props.__NEXT_DATA__.page.match(/\/partials\//u);
    const { nonce } = this.props;
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
          {/* eslint-disable-next-line no-process-env */}
          {process.env.NODE_ENV !== 'production' && (
            <p
              title={'Enjoy Development!'}
              css={css`
                //filter: grayscale(2%);
                text-align: center;
                font-size: 14px;
                font-weight: 700;
                color: #fff;
                padding: 4px 0;
                letter-spacing: 1px;

                background: linear-gradient(200deg, #3a9537, #35dc3f, #3159);
                background-size: 600% 600%;

                animation: AnimationName 10s ease infinite;

                @-webkit-keyframes AnimationName {
                  0% {
                    background-position: 74% 0%;
                  }
                  50% {
                    background-position: 27% 100%;
                  }
                  100% {
                    background-position: 74% 0%;
                  }
                }
                @-moz-keyframes AnimationName {
                  0% {
                    background-position: 74% 0%;
                  }
                  50% {
                    background-position: 27% 100%;
                  }
                  100% {
                    background-position: 74% 0%;
                  }
                }
                @-o-keyframes AnimationName {
                  0% {
                    background-position: 74% 0%;
                  }
                  50% {
                    background-position: 27% 100%;
                  }
                  100% {
                    background-position: 74% 0%;
                  }
                }
                @keyframes AnimationName {
                  0% {
                    background-position: 74% 0%;
                  }
                  50% {
                    background-position: 27% 100%;
                  }
                  100% {
                    background-position: 74% 0%;
                  }
                }
              `}>
              DEVELOPMENT
            </p>
          )}
          <PartialSeparator name={'CONTENT'} wrapped={isPartials}>
            <Main />
          </PartialSeparator>
          <PartialSeparator name={'BOTTOM_SCRIPT'} wrapped={isPartials}>
            <NextScript nonce={nonce} />
          </PartialSeparator>
        </body>
      </html>
    );
  }
}
