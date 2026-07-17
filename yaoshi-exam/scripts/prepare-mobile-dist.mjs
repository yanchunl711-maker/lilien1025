import { access, readFile, readdir, rm, writeFile } from "node:fs/promises";

const privateBank = new URL("../dist/data/question-bank.json", import.meta.url);
const promotionalFiles = [
  new URL("../dist/xhs-cover.html", import.meta.url),
  new URL("../dist/xhs-product.html", import.meta.url),
  new URL("../dist/xhs-product-ui.png", import.meta.url),
];

await rm(privateBank, { force: true });
await Promise.all(promotionalFiles.map((file) => rm(file, { force: true })));

const assetDirectory = new URL("../dist/assets/", import.meta.url);
const serviceWorker = new URL("../dist/sw.js", import.meta.url);
const generatedAssets = (await readdir(assetDirectory)).map((name) => `./assets/${name}`);
const workerSource = await readFile(serviceWorker, "utf8");
await writeFile(
  serviceWorker,
  workerSource.replace("const generatedAssets = [];", `const generatedAssets = ${JSON.stringify(generatedAssets)};`),
);

try {
  await access(privateBank);
  throw new Error("商业手机版中仍包含私用题库，已停止构建");
} catch (error) {
  if (error instanceof Error && error.message.includes("已停止构建")) throw error;
}

console.log("手机版发布目录已清理：未包含私用题库和发布素材。");
