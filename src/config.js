var platform = '';
// Navigator not exists in node
if (typeof navigator !== 'undefined') {
    platform = navigator.platform || '';
}

var defaults = {
    width: 1000,
    height: 500,
    fontSize: 12,
    // fontFamily: '"Helvetica Neue",Helvetica,"Hiragino Sans GB","STHeitiSC-LIght","Microsoft YaHei","微软雅黑",Arial,sans-serif',
    fontFamily: platform.match(/^Win/) ? 'Microsoft YaHei' : 'sans-serif',
    textStyle: {
        fontFamily: platform.match(/^Win/) ? 'Microsoft YaHei' : 'sans-serif',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
    viewCfg: {
        margin: [20, 60, 60, 60]
    },
    xAxis: {
        type: 'value', //坐标轴类型，category必须要设置data类数据
        name: '日期（day）', //坐标轴名称
        nameLocation: 'middle', //坐标轴名称显示位置
        nameGap: 42, //坐标轴名称与轴线距离
        min: 1,
        max: 31,
        splitNumber: 5,
        interval: 1, //坐标轴分隔间隔，无法在类目轴中使用
        textStyle: {
            color: '#3c3c3c',
            fontStyle: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 12
        },
        line: {
            show: true, //是否显示坐标轴线
            onZero: true, //周线是否在另一个轴的0刻度上
            style: {
                color: '#ccc', //坐标轴线颜色
                lineWidth: 1, //线的宽度
                type: 'solid' //线的类型
            }
        },
        tick: {
            show: true, //是否显示刻度
            interval: 0, //刻度的显示间隔，0显示全部刻度，1表示隔一个标签显示一个,以此类推
            length: 5, //刻度长度
            style: {
                color: '#ccc', //刻度颜色
                lineWidth: 1 //刻度宽度
            }
        },
        label: {
            show: true,
            interval: 0,
            rotate: 0, //刻度标签旋转角度，-90°到90°
            offset: 10, //刻度标签与轴线之间的距离
            formatter: null, //如：'{value} kg'
            style: {
                color: '#3c3c3c',
                fontStyle: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 12
            }
        }
    },
    yAxis: {
        type: 'category', //坐标轴类型，category必须要设置data类数据,value必须设置min、max
        name: '月份（month）', //坐标轴名称
        nameLocation: 'middle', //坐标轴名称显示位置
        nameGap: 42, //坐标轴名称与轴线距离
        textStyle: {
            color: '#3c3c3c',
            fontStyle: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 12
        },
        line: {
            show: true, //是否显示坐标轴线
            onZero: true, //周线是否在另一个轴的0刻度上
            style: {
                color: '#ccc', //坐标轴线颜色
                lineWidth: 1, //线的宽度
                type: 'solid' //线的类型
            }
        },
        tick: {
            show: true, //是否显示刻度
            interval: 0, //刻度的显示间隔，0显示全部刻度，1表示隔一个标签显示一个,以此类推
            length: 5, //刻度长度
            style: {
                color: '#ccc', //刻度颜色
                lineWidth: 1 //刻度宽度
            }
        },
        label: {
            show: true,
            interval: 0,
            rotate: 0, //刻度标签旋转角度，-90°到90°
            offset: 10, //刻度标签与轴线之间的距离
            formatter: '{value}月', //如：'{value} kg'
            style: {
                color: '#3c3c3c',
                fontStyle: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 12
            }
        }
    },
    axisCfg: {
        line: {
            lineWidth: 1, //线的宽度
            stroke: '#ccc', //线的颜色
            fill: '#f1f1f1', //网格背景颜色
        },
        labels: {
            fontSize: 12, //文本大小
            fill: '#3c3c3c', //文本颜色
        },
        title: {
            fontSize: 12, //同上
            fill: '#999',
        },
        tickLine: {
            lineWidth: 1, //坐标点对应的线宽度
            stroke: '#ccc',
            value: 5, //坐标点对应的线长度
        },
        titleOffset: 42, //标题距离坐标轴的距离
        lableOffset: 10, //文本距离坐标轴的距离
        grid: {
            line: {
                lineWidth: 1,
                stroke: '#d9d9d9',
            }
        },
        gridAlign: 'start', //栅格的位置跟坐标点(tick)的对齐方式，当前仅支持 start和middle
        rows: 12, //行
        cols: 31, //列
        space: 0, //间距
        isIntersect: true //网格背景交叉
    },
    calendarCfg: {
        rows: 3,
        cols: 4,
        margin: [0, 10, 8, 0],
        monthStyle: {
            height: 21,
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#f7f7f7',
            color: '#666'
        },
        weekStyle: {
            height: 21,
            fontSize: 12,
            fill: '#fff',
            color: '#999',
        },
        dayStyle: {
            fontSize: 12,
            stroke: '#ccc',
            color: '#3c3c3c',
        },
        itemStyle: {
            stroke: '#eee',
            fill: '#ddd',
            lineWidth: .5,
        }
    },
    legendCfg: {
        show: true,
        type: 'piecewise', //continuous,piecewise 连续,分段
        min: 0,
        max: 300,
        width: 13,
        height: 180,
        textGap: 10, //两端文字间距离
        selectedMode: 'multiple', //multiple,single 多选,单选
        itemSymbol: 'circle', //circle,rect,roundRect
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 14,
        wordSpaceing: 8, //marker与文字间距离
        left: 15, //左侧图表距离
        bottom: 5, //底部图表距离
        calculable: true, //是否启用值域漫游，当piecewise时有效，值域显示为线性渐变
        textStyle: {
            fontSize: 12,
            color: '#3c3c3c'
        },
        gradient: {
            0.1: '#fe0000',
            0.2: '#ff3801',
            0.3: '#ff7300',
            0.4: '#ffaa01',
            0.5: '#fae200',
            0.6: '#e5f500',
            0.7: '#b0e000',
            0.8: '#84cf00',
            0.9: '#5aba00',
            1.0: '#38a702'
        },
        splitList: [{
            start: 0,
            end: 50,
            color: '#00E400',
            level: '优'
        }, {
            start: 50,
            end: 100,
            color: '#FFFF00',
            level: '良'
        }, {
            start: 100,
            end: 150,
            color: '#FF7E00',
            level: '轻度污染'
        }, {
            start: 150,
            end: 200,
            color: '#FF0000',
            level: '中度污染'
        }, {
            start: 200,
            end: 300,
            color: '#99004C',
            level: '重度污染'
        }, {
            start: 300,
            color: '#7E0023',
            level: '严重污染'
        }]
    },
    toolTip: {
        isShow: true,
        position: [5, 5],
        style: 'position:absolute;visibility:hidden;background-Color:rgba(0,0,0,0.7);transition:top 0.2s,left 0.2s;border-radius: 2px;color:#fff;line-height: 16px;padding:5px 10px;'
    }
};

export default defaults;