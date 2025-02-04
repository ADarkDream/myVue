// 本脚本用来更新站点地图 sitemap.xml
// 控制台输入 `npm run sitemap` 来生成
// 生成的 sitemap.xml 和 sitemap.xml.gz 文件将存放在public目录下,部署时放到服务器项目根目录即可

import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable, pipeline } from "stream";
import { promisify } from "util";
import { createGzip } from "zlib";

const pipelineAsync = promisify(pipeline);

async function generateSitemap() {
  const links = [
    {
      url: "/",
      changefreq: "monthly",
      priority: 1,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/reverse1999/download",
      changefreq: "monthly",
      priority: 1,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/reverse1999/roles",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/reverse1999/images",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/forum",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/music",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
    //二级域名
    {
      url: "https://demos.muxidream.cn/sitemap.xml",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
  ];

  const stream = new SitemapStream({
    hostname: "https://muxidream.cn",
  });

  try {
    // 生成 XML 内容
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    let sitemapContent = data.toString();

    // 移除多余命名空间
    sitemapContent = sitemapContent.replace(
      /<urlset[^>]+>/,
      "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>"
    );

    // 检查并移除无效的 <script/> 元素
    sitemapContent = sitemapContent.replace(/<script\/>/g, "");

    // 写入 sitemap.xml 文件
    fs.writeFileSync("./public/sitemap.xml", sitemapContent, "utf8");
    console.log("sitemap.xml 已成功生成。");
  } catch (error) {
    console.error("生成 sitemap.xml 时发生错误：", error);
    throw error;
  }
}

// 将 sitemap.xml 压缩为 sitemap.xml.gz
async function createGzipFile() {
  const inputFile = "./public/sitemap.xml";
  const outputFile = "./public/sitemap.xml.gz";

  try {
    // 创建文件流并使用 gzip 压缩
    const input = fs.createReadStream(inputFile);
    const output = fs.createWriteStream(outputFile);
    const gzip = createGzip();

    // 异步执行压缩
    await pipelineAsync(input, gzip, output);
    console.log("Sitemap 已成功压缩为 sitemap.xml.gz。");
  } catch (error) {
    console.error("压缩 sitemap.xml 时发生错误：", error);
    throw error;
  }
}

// 主函数：依次执行生成和压缩操作
async function main() {
  try {
    console.log("正在生成 sitemap.xml...");
    await generateSitemap();

    console.log("正在压缩 sitemap.xml...");
    await createGzipFile();

    console.warn("Sitemap 已成功生成并压缩。");
  } catch (error) {
    console.error("生成或压缩 sitemap 时出错：", error);
  }
}

// 调用主函数执行脚本
main();
