const UserDataModel = require('../mongo/model')

module.exports = function(app) {
    // 查询用户名
    app.get('/getUserName', (req, res) => {
        if (req.session.isLogin) {
            res.send({
                code: 0,
                userName: req.session.userInfo.userName
            })
        } else {
            res.send({
                code: -1,
                msg: '请登录！'
            })
        }
    });
    // 查询用户问卷数据
    app.get('/getUserQnData', (req, res) => {
        if (req.session.isLogin) {
            UserDataModel.findOne({ email: req.session.userInfo.userEmail }, { qnData: 1, _id: 0 },
                function(err, userData) {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    }
                    if (userData === null) {
                        res.send({
                            code: -1,
                            msg: 'No documents found!'
                        })
                    } else {
                        if (!!req.query.qnId) {
                            for (var i = 0; i < userData.qnData.length; i++) {
                                if (userData.qnData[i].qnId === req.query.qnId) {
                                    res.send({
                                        code: 1,
                                        msg: `userData'qnId is ${req.query.qnId}`,
                                        data: userData.qnData[i]
                                    })
                                    break
                                }
                            }
                        } else {
                            res.send({
                                code: 0,
                                msg: 'OK',
                                data: userData.qnData
                            })
                        }
                    }
                })
        } else {
            res.send({
                code: -2,
                msg: 'Please Login!'
            })
        }
    });
    // 批量删除问卷
    app.post('/deleteUserQn', (req, res) => {
        if (req.session.isLogin) {
            if (req.body.qnList) {
                var qnList = JSON.parse(req.body.qnList)
                var len = qnList.length
                var qnDeleted = 0
                qnList.forEach(function(qnId) {
                    UserDataModel.update({ email: req.session.userInfo.userEmail }, { $pull: { "qnData": { "qnId": qnId } } },
                        function(err) {
                            if (err) {
                                res.send({
                                    code: -1,
                                    msg: '问卷 ' + qnId + ' 删除失败！'
                                })
                                return console.log(qnId + '删除问卷失败')
                            }
                            qnDeleted++
                            if (qnDeleted === len) {
                                res.send({
                                    code: 0,
                                    msg: '删除成功！'
                                })
                            }
                        })
                })
            }
            if (req.body.qnId) {
                var qnId = req.body.qnId
                UserDataModel.update({ email: req.session.userInfo.userEmail }, { $pull: { "qnData": { "qnId": qnId } } },
                    function(err) {
                        if (err) {
                            res.send({
                                code: -1,
                                msg: '问卷 ' + qnId + ' 删除失败！'
                            })
                            return console.log(qnId + '删除问卷失败')
                        }
                        res.send({
                            code: 1,
                            msg: '删除成功！'
                        })
                    });
            }
        }
    });
    // 更新用户问卷数据
    app.post('/updateUserQnData', (req, res) => {
        if (req.session.isLogin) {
            var crtQnData = JSON.parse(req.body.qnData)
            var editMode = req.body.editMode
            if (editMode === 'modify') {
                // 先删除旧的问卷
                UserDataModel.update({ email: req.session.userInfo.userEmail }, { $pull: { "qnData": { "qnId": crtQnData.qnId } } },
                    function(err) {
                        if (err) return console.log('问卷 ' + qnId + ' 删除失败')
                    });
                // 再插入编辑好的问卷
                UserDataModel.update({ email: req.session.userInfo.userEmail }, { $push: { qnData: crtQnData } },
                    function(err) {
                        if (err) {
                            res.send({
                                code: -3,
                                msg: '编辑问卷失败'
                            })
                            return console.log('编辑问卷失败：', err)
                        }
                        res.send({
                            code: 1,
                            msg: '编辑问卷成功'
                        })
                        console.log('编辑问卷成功')
                    })
            } else {
                // 插入新建的问卷
                UserDataModel.update({ email: req.session.userInfo.userEmail }, { $push: { qnData: crtQnData } },
                    function(err) {
                        if (err) {
                            res.send({
                                code: -2,
                                msg: '新增问卷失败'
                            })
                            return console.log('新增问卷失败：', err)
                        }
                        res.send({
                            code: 0,
                            msg: '新增问卷成功'
                        })
                        console.log('新增问卷成功')
                    })
            }
        } else {
            res.send({
                code: -1,
                msg: '用户未登陆'
            })
        }
    });
    // 通过邮箱查询数据
    app.get('/getdatabyemail', (req, res) => {
        var email = req.query.email || ''
        UserDataModel.findOne({ email: email }, { email: 1, _id: 0 }, function(err, doc) {
            if (err) {
                console.log(err)
                res.send(err)
            }
            if (doc === null) {
                res.send({
                    code: -1,
                    msg: 'No documents found!'
                })
            } else {
                res.send({
                    code: 0,
                    msg: 'The email already exists!'
                })
            }
        })
    });
    // 用户注册
    app.post('/signup', (req, res) => {
        const { signupName, signupEmail, signupPassword } = req.body;
        let _userData = new UserDataModel({
            name: signupName,
            email: signupEmail,
            password: signupPassword
        });
        // 生成 salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
                return console.log(err)
            }
            // 给密码加 salt
            bcrypt.hash(signupPassword, salt, function(err, hash) {
                if (err) {
                    return console.log(err)
                }
                _userData.password = hash
                    // 保存密码
                _userData.save(function(err, results) {
                    if (err) {
                        console.log(err)
                        res.send({
                            code: -1,
                            msg: 'Something error!'
                        })
                    }
                    req.session.isLogin = true
                    req.session.userInfo = {
                        userName: signupName,
                        userEmail: signupEmail
                    }
                    res.send({
                        code: 0,
                        msg: 'The registration is successful!'
                    })
                })
            })
        })
    });
    // 用户登录
    app.post('/login', (req, res) => {
        const { loginEmail, loginPsd } = req.body
        UserDataModel.findOne({ email: loginEmail }, {
            name: 1,
            password: 1,
            email: 1
        }, function(err, userInfo) {
            if (err) {
                console.log(err)
            }
            if (!userInfo) {
                res.send({
                    code: -1,
                    msg: '用户不存在'
                })
                return console.log('用户不存在！')
            }
            userInfo.comparePassword(loginPsd, function(err, isMatch) {
                if (err) {
                    console.log(err)
                }
                if (isMatch) {
                    req.session.isLogin = true
                    req.session.userInfo = {
                        userName: userInfo.name,
                        userEmail: userInfo.email
                    }
                    res.send({
                        code: 0,
                        msg: '登录成功！'
                    })
                } else {
                    res.send({
                        code: -2,
                        msg: '密码错误'
                    })
                }
            })
        })
    });
    // 用户登出
    app.post('/signout', (req, res) => {
        req.session.isLogin = false
        res.send({
            code: 0,
            msg: '登出成功！'
        })
    });
};