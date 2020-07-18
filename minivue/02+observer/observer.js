// 主要是侦测变化
class Observer {
    constructor(data) {
        this.walk(data)
    }
    // 遍历data对象的所有属性 
    walk(data){
        // 为了代码健壮性
        // 1. 判断data是否为对象
        if(!data || typeof data !== 'object') {
            return
        }
        // 2. 遍历data所有属性
        Object.keys(data).forEach(key => {
            // 传入data对象，将其转化为get和set
            this.defineReactive(data, key, data[key])
        })
    }

    // 把所有的数据转化成get和set 变成响应的数据
    defineReactive (obj, key, val) {
        let that = this
        // 这里再次调用walk的原因是，如果val是对象，也要把val对象里面的属性转化为get和set 变成响应式
        this.walk(val)
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get() {
                // 为什在这里返回的是val而不是obj[key],  
                //因为在vue.js里面get方法调用返回data[key]时候，会触发这里的get方法，
                //如果这里再用data[key]又会再次调用这里的get方法，控制台会报堆栈溢出的错误，是因为发生了死递归
                return val
            },
            set(newValue){
                if(newValue === val) {
                    return
                }
                val = newValue
                // 如果给data中给msg赋值为一个对象，那么这个msg里面的对象里面的属性并没有被转化为get和set
                // 所以再次调用walk去转化为get和set 转化为 响应式数据
                that.walk(newValue)
                // 发送通知
            }
        })
    }
}