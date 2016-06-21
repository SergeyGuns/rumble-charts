'use strict';

var React = require('react'),
    helpers = require('./helpers');

/**
 * Creates a new layer using specific `width` and `height` at specific `position`. It's useful when
 * you have two or more graphics on the same chart. Or in case you to have a margins.
 *
 * @example ../docs/examples/Layer.md
 */
var Layer = React.createClass({

    displayName: 'Layer',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        series: React.PropTypes.array,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        children: React.PropTypes.node
    },

    // init

    getDefaultProps() {
        return {
            width: '100%',
            height: '100%',
            position: 'middle center'
        };
    },

    // helpers

    getWidth() {
        var {width, layerWidth} = this.props;
        return helpers.normalizeNumber(width, layerWidth);
    },

    getHeight() {
        var {height, layerHeight} = this.props;
        return helpers.normalizeNumber(height, layerHeight);
    },

    getCoords() {
        var {position, layerWidth, layerHeight} = this.props;
        return helpers.getCoords(position, layerWidth, layerHeight, this.getWidth(), this.getHeight());
    },

    // render

    render: function () {
        let {className, scaleX, scaleY, style} = this.props;

        let layerWidth = this.getWidth();
        let layerHeight = this.getHeight();

        let {x, y} = this.getCoords();

        let children = helpers.proxyChildren(
            this.props.children,
            this.props,
            {
                layerWidth,
                layerHeight,
                scaleX,
                scaleY
            }
        );

        return <g
            className={className}
            transform={'translate(' + x + ' ' + y + ')'}
            style={style}>
            {children}
        </g>;
    }

});

module.exports = Layer;