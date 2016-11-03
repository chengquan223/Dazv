var coordOption = {
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
    }
};

export default coordOption;