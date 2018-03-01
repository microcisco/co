////////////////////////////////////////////基于thunk
class CO {
    static getThunk(fn) {   //fn有且只有一个参数(回调函数) cb: {err: res}
        return function (cb) {
            fn(cb);
        };
    }

    static getCO(generator, cb) {
        const gen = generator();

        function next(err, result) {
            if (err) return cb && cb(err);
            let execRes = gen.next(result);
            if (execRes.done) {
                cb && cb(null, execRes.value);
            } else {
                execRes.value(next)
            }
        }

        next();
    }
}

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

////////////////////////////////////////////基于Promise
function co(generator, cb) {
    const gen = generator();

    function next(value) {
        let step = gen.next(value);
        if (step.done) {
            cb && cb(value);
        } else {
            step.value.then(next);
        }
    }

    next();
}

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