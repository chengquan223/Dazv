var defaults = {
    width: 1000,
    height: 500,
    viewCfg: {
        margin: [20, 60, 60, 60]
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
        rows: 12, //行
        cols: 31, //列
        space: 0, //间距
        isIntersect: true //网格背景交叉
    },
    legend: {
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
        left: 16, //左侧图表距离
        bottom: 5, //右侧图表距离
        calculable: true, //是否启用值域漫游，当piecewise时有效，值域显示为线性渐变
        textStyle: {
            fontSize: 12,
            fontFamily: '"Microsoft YaHei", "微软雅黑", SimSun, "sans-serif"',
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
        show: true,
        position: [5, 5],
        triggerOn: 'mousemove', //触发条件mousemove，click
        style: 'position:absolute;background-Color:rgba(0,0,0,0.7);transition:top 0.2s,left 0.2s;border-radius: 2px;color:#fff;line-height: 16px;padding:5px 10px;'
    }
};