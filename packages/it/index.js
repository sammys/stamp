var compose = require('@stamp/compose');
var Shortcut = require('@stamp/shortcut');
var isStamp = require('@stamp/is/stamp');
var isObject = require('@stamp/is/object');
var isFunction = require('@stamp/is/function');
var merge = require('@stamp/core/merge');
var assign = require('@stamp/core/assign');

var concat = Array.prototype.concat;
function extractFunctions() {
  var fns = concat.apply([], arguments).filter(isFunction);
  return fns.length === 0 ? undefined : fns;
}

function standardiseDescriptor(descr) {
  if (!isObject(descr)) return descr;

  var methods = descr.methods;
  var properties = descr.properties;
  var props = descr.props;
  var initializers = descr.initializers;
  var init = descr.init;
  var composers = descr.composers;
  var deepProperties = descr.deepProperties;
  var deepProps = descr.deepProps;
  var pd = descr.propertyDescriptors;
  var staticProperties = descr.staticProperties;
  var statics = descr.statics;
  var staticDeepProperties = descr.staticDeepProperties;
  var deepStatics = descr.deepStatics;
  var spd = descr.staticPropertyDescriptors;
  var configuration = descr.configuration;
  var conf = descr.conf;
  var deepConfiguration = descr.deepConfiguration;
  var deepConf = descr.deepConf;

  var p = isObject(props) || isObject(properties) ?
    assign({}, props, properties) : undefined;

  var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
  dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

  var sp = isObject(statics) || isObject(staticProperties) ?
    assign({}, statics, staticProperties) : undefined;

  var sdp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
  sdp = isObject(staticDeepProperties) ? merge(sdp, staticDeepProperties) : sdp;

  var c = isObject(conf) || isObject(configuration) ?
    assign({}, conf, configuration) : undefined;

  var dc = isObject(deepConf) ? merge({}, deepConf) : undefined;
  dc = isObject(deepConfiguration) ? merge(dc, deepConfiguration) : dc;

  var ii = extractFunctions(init, initializers);

  var cc = extractFunctions(composers);

  var descriptor = {};
  if (methods) descriptor.methods = methods;
  if (p) descriptor.properties = p;
  if (ii) descriptor.initializers = ii;
  if (cc) descriptor.composers = cc;
  if (dp) descriptor.deepProperties = dp;
  if (sp) descriptor.staticProperties = sp;
  if (sdp) descriptor.staticDeepProperties = sdp;
  if (pd) descriptor.propertyDescriptors = pd;
  if (spd) descriptor.staticPropertyDescriptors = spd;
  if (c) descriptor.configuration = c;
  if (dc) descriptor.deepConfiguration = dc;

  return descriptor;
}

function stampit() {
  'use strict'; // to make sure `this` is not pointing to `global` or `window`
  var length = arguments.length, args = [];
  for (var i = 0; i < length; i += 1) {
    var arg = arguments[i];
    args.push(isStamp(arg) ? arg : standardiseDescriptor(arg));
  }

  return compose.apply(this || baseStampit, args); // jshint ignore:line
}

var baseStampit = Shortcut.compose({
  composers: [function(opts) {
    opts.stamp.create = opts.stamp;
  }],
  staticProperties: {
    compose: stampit // infecting
  }
});

module.exports = stampit;

//
//
// var test = require('tape');
// var _ = require('lodash');
//
// test('compose in order', function (assert) {
//   var initOrder = [];
//   var getInitDescriptor = function (value) {
//     return {initializers: [function () {initOrder.push(value);}]};
//   };
//
//   var stamp = stampit(
//     stampit(getInitDescriptor(0)),
//     stampit(getInitDescriptor(1), getInitDescriptor(2))
//       .compose(getInitDescriptor(3), getInitDescriptor(4)),
//     getInitDescriptor(5)
//   );
//   stamp();
//   var expected = [0, 1, 2, 3, 4, 5];
//
//   assert.deepEqual(initOrder, expected,
//     'should compose in proper order');
//
//   assert.end();
// });
