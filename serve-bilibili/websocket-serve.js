var ws = require("nodejs-websocket")

// 创建一个服务server,每次用户链接，函数就会被执行，并给当前用户创建一个connect对象
var server = ws.createServer(connect => {
    console.log('new connection');
    // 每当接收到用户传递过来的数据，就会触发text事件，并传入数据
    connect.on("text", data => {
        // 给用户响应数据
        // connect.sendText(data.toUpperCase()+"!!!") //转换大小写并并拼接字符串
        // 广播数据
        boardcast(data)
        connect.send(data + 'websocket')
    })

    //监听websocket断开链接
    connect.on("close", () => {
        console.log("websocket连接断开....")
    })

    //监听websocket异常信息
    connect.on("error", () => {
        console.log("websocket连接异常....")
    })

    function boardcast(str){  // 广播 //
            // server.connections  保存每个连接进来的用户 //
        server.connections.forEach(connect => {   //  .forEach 是调用数组里每个元素  //
            connect.sendText(str)
        })
    }
})
server.listen(3001, () => {
    console.log("websocket running")
})