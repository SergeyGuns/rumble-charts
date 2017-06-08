'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

/**
 * Renders lines for your line chart.
 *
 * @example ../docs/examples/Lines.md
 */
const Lines = React.createClass({

    displayName: 'Lines',

    propTypes: {
        className: PropTypes.string,
        style: PropTypes.object,
        colors: PropTypes.oneOfType([
            PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.func
        ]),
        opacity: PropTypes.number,

        asAreas: PropTypes.bool,
        interpolation: PropTypes.oneOf([
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]),

        seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

        lineVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        lineAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        lineStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

        lineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),

        scaleX: PropTypes.object,
        scaleY: PropTypes.object,
        minX: PropTypes.number,
        maxX: PropTypes.number,
        minY: PropTypes.number,
        maxY: PropTypes.number,
        seriesIndex: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.array,
            PropTypes.func
        ]),
        series: helpers.propTypes.series
    },

    // init

    getDefaultProps() {
        return {
            colors: 'category20',
            interpolation: 'monotone',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3
        };
    },

    // render

    render: function () {
        let {props} = this;
        let {className, style, scaleX, scaleY, minY, asAreas, colors, series, opacity} = props;

        let rotate = scaleX.swap || scaleY.swap;

        let x = scaleX.factory(props);
        let y = scaleY.factory(props);

        let _y0 = y(minY || 0);
        let color = helpers.colorFunc(colors);

        return <g className={className} style={style} opacity={opacity}>
            {_.map(series, (series, index) => {

                let {seriesVisible, seriesStyle, seriesAttributes} = props;
                let {lineVisible, lineStyle, lineAttributes, lineWidth} = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex: index, series, props});

                let linePath;
                lineVisible = helpers.value(lineVisible, {seriesIndex: index, series, props});
                if (lineVisible) {
                    let line;
                    if (rotate) {
                        line = asAreas ?
                            d3.svg.area()
                                .x0(point => point.y0 ? y(point.y0) : _y0)
                                .x1(point => y(point.y)) :
                            d3.svg.line()
                                .x(point => y(point.y));

                        line.y(point => x(point.x));
                    } else {
                        line = asAreas ?
                            d3.svg.area()
                                .y0(point => point.y0 ? y(point.y0) : _y0)
                                .y1(point => y(point.y)) :
                            d3.svg.line()
                                .y(point => y(point.y));

                        line.x(point => x(point.x));
                    }

                    let lineColor = series.color || color(index);

                    line.defined(point => _.isNumber(point.y))
                        .interpolate(this.props.interpolation);

                    lineAttributes = helpers.value(lineAttributes, {seriesIndex: index, series, props});
                    lineStyle = helpers.value([series.style, lineStyle], {seriesIndex: index, series, props});
                    lineWidth = helpers.value(lineWidth, {seriesIndex: index, series, props});
                    linePath = <path
                        style={lineStyle}
                        fill={asAreas ? lineColor : 'transparent'}
                        stroke={asAreas ? 'transparent' : lineColor}
                        strokeWidth={lineWidth}
                        d={line(series.data)}
                        {...lineAttributes}
                    />;
                }

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    opacity={series.opacity}
                    {...seriesAttributes}>
                    {linePath}
                </g>;
            })}
        </g>;

    }

});

module.exports = Lines;
