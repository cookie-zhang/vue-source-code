class Watcher {
    constructor(vm,key,cb ) {
        this.vm = vm
        // data中的属性名称
        this.key = key
        // 回调函数负责更新试图
        this.cb = cb

        // 把watcher 对象记录到Dep类的静态属性target
        Dep.target = this  // 也就是用target去记录当前的watcher对象
        // 触发get方法，在get方法中回调用addSub   vm[key]就是触发observer中的get方法
        this.oldValue= vm[key]
        //添加后防止重复添加，所以置为空
        Dep.target = null
    }

    // 当数据发生变化的时候更新视图
    update() {
        let newValue = this.vm[this.key]
        if(this.oldValue === newValue){
            return
        }
        this.cb(newValue)
    }
}
