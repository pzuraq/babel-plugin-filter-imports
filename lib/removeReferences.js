'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _isRemovablePath = require('./isRemovablePath');

var _isRemovablePath2 = _interopRequireDefault(_isRemovablePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var removeReferences = function removeReferences(path, specifier) {
  var _path$scope$getBindin = path.scope.getBinding(specifier),
      referencePaths = _path$scope$getBindin.referencePaths;

  _lodash2.default.forEach(referencePaths, function (referencePath) {
    var parent = referencePath.findParent(_isRemovablePath2.default);
    if (parent.removed) return;

    if (t.isArrowFunctionExpression(parent)) {
      parent.get('body').remove();
      return;
    }
    if (t.isVariableDeclarator(parent)) removeReferences(parent, _lodash2.default.get(parent, 'node.id.name'));
    parent.remove();
  });
};

exports.default = removeReferences;