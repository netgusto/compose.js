'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _merge = require('merge');

var _merge2 = _interopRequireDefault(_merge);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var stdprops = ['init', 'expects', 'props', 'methods', 'create', 'compose'];

var sym = Symbol('compose');

function _compose() {
    var _Object, _Object2, _Object3;

    for (var _len = arguments.length, factories = Array(_len), _key = 0; _key < _len; _key++) {
        factories[_key] = arguments[_key];
    }

    var factobjects = factories.map(function (factory) {
        if (typeof factory === 'function' && _typeof(factory[sym]) === 'object') {
            return factory[sym];
        }

        return factory;
    });

    var basefactoryobject = (_Object = Object).assign.apply(_Object, [{}].concat(_toConsumableArray(factobjects.map(function (factory) {
        return Object.getOwnPropertyNames(factory).filter(function (name) {
            return stdprops.indexOf(name) === -1;
        }).reduce(function (obj, name) {
            obj[name] = factory[name];
            return obj;
        }, {});
    }))));

    var res = Object.assign({}, basefactoryobject, {
        init: function init() {
            var _this = this;

            factobjects.map(function (factory) {
                return 'init' in factory ? factory.init.apply(_this) : null;
            });
        },
        expects: (_Object2 = Object).assign.apply(_Object2, [{}].concat(_toConsumableArray(factobjects.map(function (factory) {
            return 'expects' in factory ? factory.expects : {};
        })))),
        props: _merge2.default.recursive.apply(_merge2.default, [{}].concat(_toConsumableArray(factobjects.map(function (factory) {
            return 'props' in factory ? factory.props : {};
        })))),
        methods: (_Object3 = Object).assign.apply(_Object3, [{}].concat(_toConsumableArray(factobjects.map(function (factory) {
            return 'methods' in factory ? factory.methods : {};
        })))),
        create: function create() {
            var _this2 = this;

            var buildprops = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


            var compiled = Object.assign({}, (0, _clone2.default)(this.props, false), this.methods, buildprops);

            Object.keys(this.expects).map(function (expectationname) {
                if (!(expectationname in compiled)) {
                    throw new Error('Failed expectation for ' + expectationname + '; property is missing.');
                }
                var expectationtype = _this2.expects[expectationname];

                if (compiled[expectationname].constructor !== expectationtype) {
                    throw new Error('Failed expectation for ' + expectationname + '; type mismatch; expected ' + expectationtype.name + ', got ' + compiled[expectationname].constructor.name);
                }
            });

            this.init.apply(compiled);
            return compiled;
        },
        compose: function compose() {
            for (var _len2 = arguments.length, factoriez = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                factoriez[_key2] = arguments[_key2];
            }

            return _compose.apply(null, [this].concat(factoriez));
        }
    });

    var f = function f() {
        var buildprops = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return res.create(buildprops);
    };
    f[sym] = res;
    f.create = f;
    f.compose = function () {
        for (var _len3 = arguments.length, factoriez = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            factoriez[_key3] = arguments[_key3];
        }

        return _compose.apply(undefined, [res].concat(factoriez));
    };
    Object.getOwnPropertyNames(basefactoryobject).map(function (name) {
        return f[name] = basefactoryobject[name];
    });

    return f;
}exports.default = _compose;
;
