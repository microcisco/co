JS异步处理
=============
回调函数的各种缺点我就不逼逼了，主要讲下用ES6生成器封的异步处理函数

原理
======
主要利用了函数闭包和generator

思路
=======
co的函数判断next返回状态是否是done,如果是done代表执行结束否则将next作为回掉函数传进去，并且为了传递上一次
yield的值将result作为参数给next

代码
====
```
let fun1 = function (cb) {
    setTimeout(() => {
        cb(null, 666)
    }, 1000)
};
let fun2 = function (cb) {
    require('fs').readFile('./b.txt', 'utf8', cb);
};

CO.getCO(function* () {
    let fileData0 = yield CO.getThunk(fun1);
    console.log(fileData0);
    let fileData1 = yield CO.getThunk(fun2);
    console.log(fileData1);
});
/////////////////////////////
co(function* () {
    let j1 = yield new Promise((r) => {
        setTimeout(() => {
            r(11)
        }, 1000)
    });
    console.log(j1);
    let j2 = yield new Promise((r) => {
        setTimeout(() => {
            r(122)
        }, 2000)
    });
    console.log(j2);
    let j3 = yield new Promise((r) => {
        setTimeout(() => {
            r(33)
        }, 1000)
    });
    console.log(j3);
}, () => {
    console.log('执行结束')
});
```