const { Index, Document, Worker } = require("flexsearch");
const nodejieba = require("nodejieba");
const readline = require('readline');
const Koa = require('koa2');
const KoaStatic = require("koa-static")
const Router = require('koa2-router')
const app = new Koa();
const router = new Router();
const fs = require("fs")
const path = require('path')


// 部署到vecel后，编译后的public文件夹会被上传到容器根目录
// 
const statcPath = path.resolve(__dirname, '../public')
const file = fs.readFileSync(statcPath+"/site.json")

rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

options = {
    // encode: str => str.replace(/[\x00-\x7F]/g, "").split("")
    encode: str => nodejieba.cutForSearch(str.toLowerCase())
}

// const index = new Index(options);
const document = new Document({
    index: ["tag", "title", "text"],
    encode:options.encode
});
// // const worker = new Worker(options);

// title = "golang+iris简易聊天室实战项目示例"
// content = "多表 Gorm Gorm在我的一个简易demoiris项目实战简易聊天室中使用到， 其中Gorm在另一个简单的demo中尝试使用，Gorm在项目中用到级联查询的时候非常难受，翻看了很多遍官方文档，官方文档在这一块说得不是很清楚，也没有什么示例，最后是自己不断尝试组合实现的。 Xorm 由于还没有使用过Xorm做项目，只是写了简单的单表示例，Xorm似乎也支持级联查询，但我更看重的是Xorm在文档中提供了直接执行SQL的方法，我更倾向于使用原生SQL加传入结构体指针扫描的形式完成级联查询，接下来打算将iris项目实战简易聊天室用xorm重构，看看效果后再对本文进行更新，不过个人感觉xorm应该是会更好用的。"
let jsondata = JSON.parse(file)

jsondata.forEach((val, idx) => {
    document.add({
        id:idx,
        title:val.title,
        text:val.content
    })
})
// console.log(nodejieba.cutForSearch("多表 Gorm Gorm在我的一个简易demoiris项目实战简易聊天室中使用到， 其中Gorm在另一个简单的demo中尝试使用，Gorm在项目中用到级联查询的时候非常难受，翻看了很多遍官方文档，官方文档在这一块说得不是很清楚，也没有什么示例，最后是自己不断尝试组合实现的。 Xorm 由于还没有使用过Xorm做项目，只是写了简单的单表示例，Xorm似乎也支持级联查询，但我更看重的是Xorm在文档中提供了直接执行SQL的方法，我更倾向于使用原生SQL加传入结构体指针扫描的形式完成级联查询，接下来打算将iris项目实战简易聊天室用xorm重构，看看效果后再对本文进行更新，不过个人感觉xorm应该是会更好用的。"))


router.get("/search", (ctx)=>{
    let req_query = ctx.request.query
    console.log(req_query.keywords)
    res = document.search(req_query.keywords)
    ctx.body = {
        results: res
    }
})
app.use(router)

console.log(__dirname);

app.use(KoaStatic(statcPath));
// app.listen(3000, () => {
//     console.log('[demo] request get is starting at port 3000')
// })

module.exports = app
