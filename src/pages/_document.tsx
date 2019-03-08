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
import getConfig from 'next-server/config';

const { publicRuntimeConfig } = getConfig();

interface StoreDocumentProps extends DocumentProps, EmotionCritical {}

// Todo _document.tsx 의 '/static/**' 리소스 assetPrefix 맞춰 CloudFront 바라보게끔 수정
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
    return (
      <html lang="ko">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <meta
            name="google-site-verification"
            content="Ej_LuvDzCxS1Ck6Sa5AN_OVntufSGfi8VfuytSrHaPk"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href={`${publicRuntimeConfig.STATIC_CDN_URL}/static/favicon.ico`}
          />
          <link
            rel="manifest"
            crossOrigin="anonymous"
            href={`${publicRuntimeConfig.STATIC_CDN_URL}/static/manifest.webmanifest`}
          />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
