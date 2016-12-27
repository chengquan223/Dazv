// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // For node-canvas
    '[object Image]': 1,
    '[object Canvas]': 1
};
var TYPED_ARRAY = {
    '[object Int8Array]': 1,
    '[object Uint8Array]': 1,
    '[object Uint8ClampedArray]': 1,
    '[object Int16Array]': 1,
    '[object Uint16Array]': 1,
    '[object Int32Array]': 1,
    '[object Uint32Array]': 1,
    '[object Float32Array]': 1,
    '[object Float64Array]': 1
};
var objToString = Object.prototype.toString;

function isObject(value) {
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}

function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

function isDom(value) {
    return typeof value === 'object' &&
        typeof value.nodeType === 'number' &&
        typeof value.ownerDocument === 'object';
}

function isBuildInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

function clone(source) {
    if (source == null || typeof source != 'object') {
        return source;
    }

    var result = source;
    var typeStr = objToString.call(source);

    if (typeStr === '[object Array]') {
        result = [];
        for (var i = 0, len = source.length; i < len; i++) {
            result[i] = clone(source[i]);
        }
    } else if (TYPED_ARRAY[typeStr]) {
        result = source.constructor.from(source);
    } else if (!BUILTIN_OBJECT[typeStr] && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }

    return result;
}

function merge(target, source, overwrite) {
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

function guid(id) {
    var t = {};
    id = id || 'v';
    return t[id] ? t[id] += 1 : t[id] = 1, id + t[id]
}

function createDiv() {
    return document.createElement('div');
}

//是否在矩形内
function isPointInRect(point, bound) {
    var wn = bound.wn; //西北
    var es = bound.es; //东南
    return (point.x >= wn.x && point.x <= es.x && point.y >= wn.y && point.y <= es.y);
}

//是否在园内
function isPointInCircle(point, center, radius) {
    var dis = utilLib.getDistance(point, center);
    return dis <= radius;
}

//两点间距离
function getDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

export default {
    merge: merge,
    guid: guid,
    createDiv: createDiv,
    isPointInRect: isPointInRect,
    isPointInCircle: isPointInCircle,
    getDistance: getDistance
};