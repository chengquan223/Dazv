// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // In node-canvas Image can be Canvas.Image
    '[object Image]': 1
};

var objToString = Object.prototype.toString;

function clone(source) {
    if (typeof source == 'object' && source !== null) {
        var result = source;
        if (source instanceof Array) {
            result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        } else if (!isBuildInObject(source)
            // 是否为 dom 对象
            &&
            !isDom(source)
        ) {
            result = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = clone(source[key]);
                }
            }
        }
        return result;
    }
    return source;
}

function merge(target, source, overwrite) {
    // We should escapse that source is string
    // and enter for ... in ...
    if (!isObject(source) || !isObject(target)) {
        return overwrite ? clone(source) : target;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetProp = target[key];
            var sourceProp = source[key];
            if (isObject(sourceProp) &&
                isObject(targetProp) &&
                !isArray(sourceProp) &&
                !isArray(targetProp) &&
                !isDom(sourceProp) &&
                !isDom(targetProp) &&
                !isBuildInObject(sourceProp) &&
                !isBuildInObject(targetProp)
            ) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            } else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = clone(source[key], true);
            }
        }
    }
    return target;
}

/**
 * 构造类继承关系
 */
function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;

    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();
    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}

function isBuildInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}

function isDom(value) {
    return value && value.nodeType === 1 &&
        typeof (value.nodeName) == 'string';
}

function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

export default {
    clone: clone,
    merge: merge,
    inherits: inherits
};