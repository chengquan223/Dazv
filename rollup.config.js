import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'index.js', //入口
    dest: 'build/calendar.js', //最终文件
    format: 'umd', //amd、es、iife、umd
    moduleName: 'Dazv', //iife或umd模式下，若入口文件含 export，必须加上该属性
    sourceMap: false, //方便调试编译后文件，自动生成一个 build/index.js.map 关联到buildrel/index.js 中，sourceMap: 'inline'独立生成一个map文件
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
    ]
};