// 本脚本用来更新站点地图sitemap.xml
// 控制台输入 `node updateSitemap.js` 来生成
//将生成的sitemap.xml和gz文件存放到前端HTML项目的根目录下

import {SitemapStream, streamToPromise} from 'sitemap'
import {Readable} from 'stream'
import fs from 'fs'
import {pipeline} from 'stream'
import {promisify} from 'util'
import {createGzip} from 'zlib'

const pipelineAsync = promisify(pipeline)

async function generateSitemap() {
    // 包含链接的数组, changefreq设置链接的抓取频率，priority表示链接的优先级，0-1.0之间，1.0为高优先级
    const links = [
        {url: '/', changefreq: 'monthly', priority: 1, lastmod: new Date().toISOString()},
        {url: '/reverse1999/download', changefreq: 'monthly', priority: 1, lastmod: new Date().toISOString()},
        {url: '/reverse1999/roles', changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString()},
        {url: '/reverse1999/images', changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString()},
        {url: '/forum', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString()},
        {url: '/music', changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString()}
    ]

    // 创建写入流
    const stream = new SitemapStream({
        hostname: 'https://muxidream.cn',
        xmlNs: { // 禁用或启用特定的命名空间，xmlns默认为全开
            news: false,//如果网站包含新闻内容，并希望 Google 新闻更好地抓取它们，可以使用这个命名空间。允许定义新闻文章的发布时间、标题等。
            image: false,//在网站地图中为每个 URL 提供与之相关的图片信息，可以定义图片的 URL、标题、描述等。
            video: false,//为每个 URL 提供与之相关的视频信息，可以定义视频的缩略图、标题、描述、内容链接等。
            xhtml: false,//可以在网站地图中为同一个 URL 提供不同语言的版本，指向同一页面的其他语言版本。
        }
    })

    // 返回一个 promise，解析为 XML 字符串
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
        const str = data.toString()
        // 移除xmlNs配置
        const newStr = str.replace(/<urlset[^>]+>/, '<urlset>')
        fs.writeFileSync('sitemap.xml', newStr)
    })
}

async function createGzipFile() {
    const input = fs.createReadStream('sitemap.xml')
    const output = fs.createWriteStream('sitemap.xml.gz')
    const gzip = createGzip()

    await pipelineAsync(input, gzip, output)
    console.log('Sitemap 已成功压缩为 sitemap.xml.gz')
}

async function main() {
    try {
        await generateSitemap()
        await createGzipFile()
        console.log('Sitemap 已成功生成在当前目录下。')
    } catch (error) {
        console.error('生成 sitemap 时出错：', error)
    }
}

// 调用主函数执行脚本
main()
