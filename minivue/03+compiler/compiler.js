class Compiler {
    constructor(vm){
        this.el = vm.$el  // 记录模版
        this.vm = vm // 记录是列
        this.compile(this.el) // 模版编译
    }

    // 编译模版 处理文本节点和元素节点
    compile(el){
        let childNodes = el.childNodes  // el中的第一个子节点遍历
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if(this.isTextNode(node)){
                this.compileText(node)
            } else if (this.isElementNode) {
                // 处理元素节点
                this.compileElement(node)
            }

            // 那么如果node节点下面还有自己点呢？ 
            // 所以判断node节点，是否有子节点，然后在递归调用compile
            if(node.childNodes && node.childNodes.length){
                this.compile(node)
            }
        })

    }
    // 编译元素节点  处理指令
    compileElement(node){
        console.log(node.attributes)
        // 遍历所有属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令 
            let attrName = attr.name
            if(this.isDireactive(attrName)) {
                // v-text -->变成 text  把v-给去掉
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    //
    update(node, key, attrName){
        let updateFn = this[attrName + "Updater"]
        updateFn && updateFn(node, this.vm[key])
    }

    // 处理v-text指令
    textUpdater( node, value) {
        node.textContent = value
    }
    // 处理v-model指令
    modelUpdater(node, value){
         node.value = value
    }
    // 编译文本节点， 处理差值表达式
    compileText(node) {
        // console.dir(node)
        // {{ mag }}
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()  // $1是第一个分组的内容，写几代表就是第几个分组的内容
            node.textContent = value.replace(reg, this.vm[key])
        }
    }

    // 判断元素属性是否是指令
    isDireactive(attrName){
        return attrName.startsWith('v-') // 判断是否为指令就是判断是不是以v-开头
    }

    // 判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }

    // 判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }

}