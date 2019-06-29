"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _findReferenceRemovalPath = _interopRequireDefault(require("./findReferenceRemovalPath"));

var _removeExportSpecifier = _interopRequireDefault(require("./removeExportSpecifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const removeReferences = (path, specifier) => {
  if (!path.scope.getBinding(specifier)) return;

  const _path$scope$getBindin = path.scope.getBinding(specifier),
        referencePaths = _path$scope$getBindin.referencePaths;

  _lodash.default.forEach(referencePaths, referencePath => {
    const removalPath = (0, _findReferenceRemovalPath.default)(referencePath);
    if (removalPath.removed) return;

    if (t.isArrowFunctionExpression(removalPath)) {
      removalPath.get('body').remove();
      return;
    }

    if (t.isExportSpecifier(removalPath)) {
      (0, _removeExportSpecifier.default)(removalPath);
      return;
    }

    if (t.isVariableDeclarator(removalPath)) removeReferences(removalPath, _lodash.default.get(removalPath, 'node.id.name'));
    removalPath.remove();

    if (t.isDecorator(removalPath)) {
      let decorators = removalPath.parentPath.node.decorators;

      if (decorators && decorators.length === 0) {
        removalPath.parentPath.node.decorators = undefined;
      }
    }
  });
};

var _default = removeReferences;
exports.default = _default;