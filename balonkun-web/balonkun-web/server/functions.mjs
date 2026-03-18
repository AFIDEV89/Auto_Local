// import puppeteer from 'puppeteer';
// import miniy from 'html-minifier';
// import { BLOCKED_RESOURCE_TYPES, CACHE_REFRESH_RATE, MINIFIER_CONFIG, SKIPPED_RESOURCES } from './constants.mjs';

// const RENDER_CACHE = new Map();

// export async function ssr(url, browserWSEndpoint) {

//     if (RENDER_CACHE.has(url)) {
//         const cached = RENDER_CACHE.get(url);

//         if (Date.now() - cached.renderedAt > CACHE_REFRESH_RATE && !(CACHE_REFRESH_RATE <= 0)) {
//             RENDER_CACHE.delete(url);
//         }

//         return {
//             html: cached.html,
//             status: 200
//         };
//     }

//     const browser = await puppeteer.connect({ browserWSEndpoint });

//     try {
//         const page = await browser.newPage();
//         await page.setRequestInterception(true);

//         page.on('request', request => {
//             const requestUrl = request.url();

//             if (request.isInterceptResolutionHandled())
//                 return;

//             if (
//                 BLOCKED_RESOURCE_TYPES.indexOf(request.resourceType()) !== -1 ||
//                 SKIPPED_RESOURCES.some(resource => requestUrl.indexOf(resource) !== -1)
//             ) {
//                 request.abort();
//             } else {
//                 request.continue();
//             }
//         })

//         const response = await page.goto(url, {
//             timeout: 25000,
//             waitUntil: 'networkidle0'
//         });

//         // Inject <base> on page to relative resources load properly.
//         await page.evaluate(url => {
//             const base = document.createElement('base');
//             base.href = `http://3.111.177.99:3001`;

//             document.head.prepend(base);
//         }, url);

//         // Remove scripts and html imports. They've already executed.
//         await page.evaluate(() => {
//             const elements = document.querySelectorAll('script:not([type="application/ld+json"]), link[rel="import"]');
//             elements.forEach(e => e.remove());
//         });

//         const html = await page.content();
//         const minifiedContent = miniy.minify(html, MINIFIER_CONFIG)

//         // Close the page we opened here (not the browser).
//         await page.close();

//         // Set the cache
//         RENDER_CACHE.set(url, {
//             html: minifiedContent,
//             renderedAt: Date.now()
//         });

//         return {
//             html: minifiedContent,
//             status: response.status()
//         }
//     }
//     catch (e) {
//         const html = e.toString();

//         console.warn({ message: `URL: ${url} Failed with message: ${html}` })
//         return { html, status: 500 }
//     }

// };