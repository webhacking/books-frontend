import { css } from '@emotion/core';

import ridiRobotoRegularWoff2 from 'src/assets/fonts/ridi-roboto-regular-webfont.woff2';
import ridiRobotoRegularWoff from 'src/assets/fonts/ridi-roboto-regular-webfont.woff';
import ridiRobotoRegularTtf from 'src/assets/fonts/ridi-roboto-regular.ttf';
import ridiRobotoBoldWoff2 from 'src/assets/fonts/ridi-roboto-bold-webfont.woff2';
import ridiRobotoBoldWoff from 'src/assets/fonts/ridi-roboto-bold-webfont.woff';
import ridiRobotoBoldTtf from 'src/assets/fonts/ridi-roboto-bold.ttf';

export default css`
  @font-face {
    font-family: 'ridi-roboto';
    src: url(${ridiRobotoRegularWoff2}) format('woff2'),
      url(${ridiRobotoRegularWoff}) format('woff'),
      url(${ridiRobotoRegularTtf}) format('truetype');
    font-display: swap;
    font-weight: normal;
  }

  @font-face {
    font-family: 'ridi-roboto';
    src: url(${ridiRobotoBoldWoff2}) format('woff2'),
      url(${ridiRobotoBoldWoff}) format('woff'),
      url(${ridiRobotoBoldTtf}) format('truetype');
    font-display: swap;
    font-weight: bold;
  }
`;
