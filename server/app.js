const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const routers = require('./router')

// 密码加密
const bcrypt = require('bcrypt')
const uuid = require('uuid/v4')
const SALT_WORK_FACTOR = 10

const app = express()

// 连接远程数据库
const dbUrl = 'mongodb://localhost:27017/test'
    // var dbUrl = 'mongodb://mertens:test123@ds037205.mlab.com:37205/mertens-qn'
const db = mongoose.connect(dbUrl, { useMongoClient: true })
db.on("error", function(error) {
    console.log("数据库连接失败：" + error)
})
db.once("open", function() {
    console.log("------ 数据库连接成功！------")
})

app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(session({
    secret: uuid(),
    cookie: {
        maxAge: 60 * 1000 * 30, // 过期时间（毫秒）
        httpOnly: true
    },
    store: new MongoStore({
        url: dbUrl,
        touchAfter: 30 * 60
    })
}));

// 路由设置
routers(app);

module.exports = app