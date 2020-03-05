const puppeteer = require('puppeteer');

function durationToString(duration) {
  if (duration < 1.2e3) {
    return `${duration}µs`;
  } else if (duration < 1.2e6) {
    return `${(duration / 1e3).toFixed(2)}ms`;
  } else {
    return `${(duration / 1e6).toFixed(2)}s`;
  }
}

function bytesToString(bytes) {
  if (bytes < 1.2e3) {
    return `${bytes}B`;
  } else if (bytes < 1.2e6) {
    return `${(bytes / 1e3).toFixed(2)}kB`;
  } else if (bytes < 1.2e9) {
    return `${(bytes / 1e6).toFixed(2)}MB`;
  } else {
    return `${(bytes / 1e9).toFixed(2)}GB`;
  }
}

function printEvent(event, name, baseTs) {
  if (event != null && event.ts >= baseTs) {
    console.log(`${name} at ${durationToString(event.ts - baseTs)}`);
  }
}

function printAnalysis(traceEvents) {
  let baseEvent;
  let hydrationStartEvent;
  let hydrationEndEvent;
  let firstPaintEvent;
  let firstMeaningfulPaintEvent;
  let firstContentfulPaintEvent;
  let onloadEvent;
  const counters = [];
  for (const event of traceEvents) {
    switch (event.name) {
      case 'TracingStartedInBrowser':
        baseEvent = event;
        break;
      case 'Next.js-hydration':
        if (event.ph === 'b') {
          hydrationStartEvent = event;
        } else {
          hydrationEndEvent = event;
        }
        break;
      case 'firstPaint':
        firstPaintEvent = event;
        break;
      case 'firstMeaningfulPaint':
        firstMeaningfulPaintEvent = event;
        break;
      case 'firstContentfulPaint':
        firstContentfulPaintEvent = event;
        break;
      case 'loadEventEnd':
        onloadEvent = event;
        break;
      case 'UpdateCounters':
        counters.push(event);
        break;
    }
  }

  const baseTs = baseEvent.ts;
  if (hydrationStartEvent != null && hydrationEndEvent != null) {
    const startedAt = hydrationStartEvent.ts - baseTs;
    const duration = hydrationEndEvent.ts - hydrationStartEvent.ts;
    console.log(
      `Hydration started at ${durationToString(startedAt)}, ` +
        `took ${durationToString(duration)}`,
    );
  }
  printEvent(firstPaintEvent, 'First Paint', baseTs);
  printEvent(firstMeaningfulPaintEvent, 'First Meaningful Paint', baseTs);
  printEvent(firstContentfulPaintEvent, 'First Contentful Paint', baseTs);
  printEvent(onloadEvent, 'onload', baseTs);

  let minHeap = +Infinity;
  let maxHeap = 0;
  let maxHeapAt = 0;
  let minNodeCount = +Infinity;
  let maxNodeCount = 0;
  let maxNodeCountAt = 0;
  for (const counter of counters) {
    const { nodes, jsHeapSizeUsed } = counter.args.data;
    if (jsHeapSizeUsed < minHeap) {
      minHeap = jsHeapSizeUsed;
    }
    if (jsHeapSizeUsed > maxHeap) {
      maxHeap = jsHeapSizeUsed;
      maxHeapAt = counter.ts;
    }
    if (nodes < minNodeCount) {
      minNodeCount = nodes;
    }
    if (nodes > maxNodeCount) {
      maxNodeCount = nodes;
      maxNodeCountAt = counter.ts;
    }
  }

  if (maxHeap > 0) {
    console.log(
      `JS heap size ${bytesToString(minHeap)} - ${bytesToString(maxHeap)}, ` +
        `max at ${durationToString(maxHeapAt - baseTs)}`,
    );
  }
  if (maxNodeCount > 0) {
    console.log(
      `DOM node count ${minNodeCount} - ${maxNodeCount}, ` +
        `max at ${durationToString(maxNodeCountAt - baseTs)}`,
    );
  }
}

async function runWithViewport(browser, url, viewport) {
  console.log(
    `=== ${viewport.width}x${viewport.height}, DPR: ${viewport.deviceScaleFactor} ===`,
  );

  const page = await browser.newPage();
  await page.bringToFront();
  await page.setViewport(viewport);

  await page.tracing.start({
    path: `./tracing-${viewport.width}x${viewport.height}x${viewport.deviceScaleFactor}.json`,
    screenshots: false,
  });
  await page.goto(url, { waitUntil: 'load' });
  const result = await page.tracing.stop();

  const parsed = JSON.parse(result.toString());
  const traceEvents = parsed.traceEvents;
  printAnalysis(traceEvents);

  await page.close();
  console.log();
}

async function profile(url) {
  console.error(`Tracing ${url}`);
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-web-security',
    ],
  });
  let page;

  console.error('Warming up...');
  page = await browser.newPage();
  await page.bringToFront();
  await page.goto(url, { waitUntil: 'load' });
  await page.close();

  await runWithViewport(browser, url, { width: 360, height: 740, deviceScaleFactor: 4 });
  await runWithViewport(browser, url, { width: 768, height: 1024, deviceScaleFactor: 2 });
  await runWithViewport(browser, url, { width: 1024, height: 768, deviceScaleFactor: 2 });
  await runWithViewport(browser, url, {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await runWithViewport(browser, url, {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
  });

  await browser.close();
}

module.exports = {
  profile,
};
