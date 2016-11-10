function isObject(value) {
    var type = typeof value;
    return type === 'function' || (!!value && type == 'object');
}

function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

function guid(id) {
    var t = {};
    id = id || 'v';
    return t[id] ? t[id] += 1 : t[id] = 1, id + t[id]
}

function createDiv() {
    return document.createElement('div');
}

function toArray(obj) {
    return obj && obj.length ? Array.prototype.slice.call(obj) : [];
}

function mix() {
    var t = this.toArray(arguments),
        newObj = t[0];
    if (newObj === !0) {
        newObj = t[1];
        for (var i = 2; i < t.length; i++) {
            var item = t[i];
            combine(newObj, item);
        }
    } else {
        for (var i = 1; i < t.length; i++) {
            var item = t[i];
            for (var a in item)
                item.hasOwnProperty(a) && "constructor" !== a && (newObj[a] = item[a]);
        }
        return newObj;
    }
}

function combine(dest, source, r) {
    var a = 5;
    r = r || 0;
    for (var i in source)
        if (source.hasOwnProperty(i)) {
            var o = source[i];
            null !== o && s.isObject(o) ? (s.isObject(dest[i]) || (dest[i] = {}),
                r < a ? n(dest[i], source[i], r + 1) : dest[i] = source[i]) : s.isArray(o) ? (dest[i] = [],
                dest[i] = dest[i].concat(o)) : void 0 !== o && (dest[i] = source[i])
        }
}

export default {
    guid: guid,
    createDiv: createDiv,
    mix: mix,
    toArray: toArray,
};