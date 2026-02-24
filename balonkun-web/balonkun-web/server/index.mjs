// import express from "express";
// import puppeteer from "puppeteer";
// import * as path from 'path';
// import { ssr } from './functions.mjs'
// import { BOT_USER_AGENTS, CLIENT_PORT, DOMAIN, EXPRESS_PORT } from "./constants.mjs";

// const __dirname = path.resolve();

// const app = express();

// let browserWSEndpoint = null;

// // Array containing paths and/or extentions that will be excluded from being prerendered by the ssr service
// const excludeArray = [".xml", ".ico", ".txt", ".json", ".png", ".svg", ".jpg", ".jpeg", ".gif"];

// app.get('/*', async (req, res, next) => {
//     const userAgent = req.headers['user-agent'];

//     const isWebCrawler = new RegExp(BOT_USER_AGENTS.join("|").slice(0, -1), "i").test(userAgent);

//     const exclude = !new RegExp([...excludeArray].join("|").slice(0, -1)).test(req.originalUrl);

//     if(!isWebCrawler || !exclude) {
//         return next();
//     }

//     if (!browserWSEndpoint) {
//         const browser = await puppeteer.launch({
//             headless: 'new',
//             args: ["--single-process", "--no-zygote", "--no-sandbox"],
//         });
//         browserWSEndpoint = await browser.wsEndpoint();
//     }

//     if (isWebCrawler) {
//         const { html } = await ssr(`${DOMAIN}:${CLIENT_PORT}${req.originalUrl}`, browserWSEndpoint, next);

//         return res.send(html);
//     }
// })

// // Server client side rendered app
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(EXPRESS_PORT, () => {
//     console.log("Server started...")
// })