'use strict';

var require$$1$2 = require('assert');
var require$$0$2 = require('util');
var require$$0$3 = require('fs');
var path$3 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1$2);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$3);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$3);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function createModule(modulePath) {
	return {
		path: modulePath,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, base == null ? modulePath : base);
		}
	};
}

function commonjsRegister$p (path, loader) {
	DYNAMIC_REQUIRE_LOADERS[path] = loader;
}

const DYNAMIC_REQUIRE_LOADERS = Object.create(null);
const DYNAMIC_REQUIRE_CACHE = Object.create(null);
const DEFAULT_PARENT_MODULE = {
	id: '<' + 'rollup>', exports: {}, parent: undefined, filename: null, loaded: false, children: [], paths: []
};
const CHECKED_EXTENSIONS = ['', '.js', '.json'];

function normalize (path) {
	path = path.replace(/\\/g, '/');
	const parts = path.split('/');
	const slashed = parts[0] === '';
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/')
	  path = '/' + path;
	else if (path.length === 0)
	  path = '.';
	return path;
}

function join () {
	if (arguments.length === 0)
	  return '.';
	let joined;
	for (let i = 0; i < arguments.length; ++i) {
	  let arg = arguments[i];
	  if (arg.length > 0) {
		if (joined === undefined)
		  joined = arg;
		else
		  joined += '/' + arg;
	  }
	}
	if (joined === undefined)
	  return '.';

	return joined;
}

function isPossibleNodeModulesPath (modulePath) {
	let c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\') return false;
	let c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\'))
		return false;
	return true;
}

function dirname (path) {
  if (path.length === 0)
    return '.';

  let i = path.length - 1;
  while (i > 0) {
    const c = path.charCodeAt(i);
    if ((c === 47 || c === 92) && i !== path.length - 1)
      break;
    i--;
  }

  if (i > 0)
    return path.substr(0, i);

  if (path.chartCodeAt(0) === 47 || path.chartCodeAt(0) === 92)
    return path.charAt(0);

  return '.';
}

function commonjsResolveImpl (path, originalModuleDir, testCache) {
	const shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	let relPath;
	if (path[0] === '/') {
		originalModuleDir = '/';
	}
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = originalModuleDir ? normalize(originalModuleDir + '/' + path) : path;
		} else if (originalModuleDir) {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		} else {
			relPath = normalize(join('node_modules', path));
		}

		if (relPath.endsWith('/..')) {
			break; // Travelled too far up, avoid infinite loop
		}

		for (let extensionIndex = 0; extensionIndex < CHECKED_EXTENSIONS.length; extensionIndex++) {
			const resolvedPath = relPath + CHECKED_EXTENSIONS[extensionIndex];
			if (DYNAMIC_REQUIRE_CACHE[resolvedPath]) {
				return resolvedPath;
			}			if (DYNAMIC_REQUIRE_LOADERS[resolvedPath]) {
				return resolvedPath;
			}		}
		if (!shouldTryNodeModules) break;
		const nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return null;
}

function commonjsResolve (path, originalModuleDir) {
	const resolvedPath = commonjsResolveImpl(path, originalModuleDir);
	if (resolvedPath !== null) {
		return resolvedPath;
	}
	return require.resolve(path);
}

function commonjsRequire (path, originalModuleDir) {
	const resolvedPath = commonjsResolveImpl(path, originalModuleDir);
	if (resolvedPath !== null) {
    let cachedModule = DYNAMIC_REQUIRE_CACHE[resolvedPath];
    if (cachedModule) return cachedModule.exports;
    const loader = DYNAMIC_REQUIRE_LOADERS[resolvedPath];
    if (loader) {
      DYNAMIC_REQUIRE_CACHE[resolvedPath] = cachedModule = {
        id: resolvedPath,
        filename: resolvedPath,
        path: dirname(resolvedPath),
        exports: {},
        parent: DEFAULT_PARENT_MODULE,
        loaded: false,
        children: [],
        paths: [],
        require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? cachedModule.path : base);
        }
      };
      try {
        loader.call(commonjsGlobal, cachedModule, cachedModule.exports);
      } catch (error) {
        delete DYNAMIC_REQUIRE_CACHE[resolvedPath];
        throw error;
      }
      cachedModule.loaded = true;
      return cachedModule.exports;
    }	}
	return require(path);
}

commonjsRequire.cache = DYNAMIC_REQUIRE_CACHE;
commonjsRequire.resolve = commonjsResolve;

const commonjsRegister$o = commonjsRegister$p;
commonjsRegister$o("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/ArrayExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromArrayExpression;
/**
 * Extractor function for an ArrayExpression type value node.
 * An array expression is an expression with [] syntax.
 *
 * @returns - An array of the extracted elements.
 */
function extractValueFromArrayExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return value.elements.map(function (element) {
    return getValue(element);
  });
}
});

const commonjsRegister$n = commonjsRegister$p;
commonjsRegister$n("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/AssignmentExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromAssignmentExpression;
/**
 * Extractor function for a AssignmentExpression type value node.
 * An assignment expression looks like `x = y` or `x += y` in expression position.
 * This will return the assignment as the value.
 *
 * @param - value - AST Value object with type `AssignmentExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromAssignmentExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return getValue(value.left) + ' ' + value.operator + ' ' + getValue(value.right);
}
});

const commonjsRegister$m = commonjsRegister$p;
commonjsRegister$m("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/BinaryExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromBinaryExpression;
/**
 * Extractor function for a BinaryExpression type value node.
 * A binary expression has a left and right side separated by an operator
 * such as `a + b`.
 *
 * @param - value - AST Value object with type `BinaryExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromBinaryExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var operator = value.operator,
      left = value.left,
      right = value.right;

  var leftVal = getValue(left);
  var rightVal = getValue(right);

  switch (operator) {
    case '==':
      return leftVal == rightVal; // eslint-disable-line
    case '!=':
      return leftVal != rightVal; // eslint-disable-line
    case '===':
      return leftVal === rightVal;
    case '!==':
      return leftVal !== rightVal;
    case '<':
      return leftVal < rightVal;
    case '<=':
      return leftVal <= rightVal;
    case '>':
      return leftVal > rightVal;
    case '>=':
      return leftVal >= rightVal;
    case '<<':
      return leftVal << rightVal; // eslint-disable-line no-bitwise
    case '>>':
      return leftVal >> rightVal; // eslint-disable-line no-bitwise
    case '>>>':
      return leftVal >>> rightVal; // eslint-disable-line no-bitwise
    case '+':
      return leftVal + rightVal;
    case '-':
      return leftVal - rightVal;
    case '*':
      return leftVal * rightVal;
    case '/':
      return leftVal / rightVal;
    case '%':
      return leftVal % rightVal;
    case '|':
      return leftVal | rightVal; // eslint-disable-line no-bitwise
    case '^':
      return leftVal ^ rightVal; // eslint-disable-line no-bitwise
    case '&':
      return leftVal & rightVal; // eslint-disable-line no-bitwise
    case 'in':
      try {
        return leftVal in rightVal;
      } catch (err) {
        return false;
      }
    case 'instanceof':
      if (typeof rightVal !== 'function') {
        return false;
      }
      return leftVal instanceof rightVal;
    default:
      return undefined;
  }
}
});

const commonjsRegister$l = commonjsRegister$p;
commonjsRegister$l("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/BindExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromBindExpression;
/**
 * Extractor function for a BindExpression type value node.
 * A bind expression looks like `::this.foo`
 * This will return `this.foo.bind(this)` as the value to indicate its existence,
 * since we can not execute the function this.foo.bind(this) in a static environment.
 *
 * @param - value - AST Value object with type `BindExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromBindExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var callee = getValue(value.callee);

  // If value.object === null, the callee must be a MemberExpression.
  // https://github.com/babel/babylon/blob/master/ast/spec.md#bindexpression
  var object = value.object === null ? getValue(value.callee.object) : getValue(value.object);

  if (value.object && value.object.property) {
    return object + '.' + callee + '.bind(' + object + ')';
  }

  return callee + '.bind(' + object + ')';
}
});

const commonjsRegister$k = commonjsRegister$p;
commonjsRegister$k("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/CallExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromCallExpression;
/**
 * Extractor function for a CallExpression type value node.
 * A call expression looks like `bar()`
 * This will return `bar` as the value to indicate its existence,
 * since we can not execute the function bar in a static environment.
 *
 * @param - value - AST Value object with type `CallExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromCallExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var args = Array.isArray(value.arguments) ? value.arguments.map(function (x) {
    return getValue(x);
  }).join(', ') : '';
  return '' + getValue(value.callee) + (value.optional ? '?.' : '') + '(' + args + ')';
}
});

const commonjsRegister$j = commonjsRegister$p;
commonjsRegister$j("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/ChainExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromChainExpression;
/**
 * Extractor function for a ChainExpression type value node.
 * A member expression is accessing a property on an object `obj.property`.
 *
 * @param - value - AST Value object with type `ChainExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj?.property` convention.
 */
function extractValueFromChainExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return getValue(value.expression);
}
});

const commonjsRegister$i = commonjsRegister$p;
commonjsRegister$i("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/ConditionalExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromConditionalExpression;
/**
 * Extractor function for a ConditionalExpression type value node.
 *
 * @param - value - AST Value object with type `ConditionalExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromConditionalExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var test = value.test,
      alternate = value.alternate,
      consequent = value.consequent;


  return getValue(test) ? getValue(consequent) : getValue(alternate);
}
});

const commonjsRegister$h = commonjsRegister$p;
commonjsRegister$h("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/FunctionExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromFunctionExpression;
/**
 * Extractor function for a FunctionExpression type value node.
 * Statically, we can't execute the given function, so just return a function
 * to indicate that the value is present.
 *
 * @param - value - AST Value object with type `FunctionExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromFunctionExpression(value) {
  return function () {
    return value;
  };
}
});

const commonjsRegister$g = commonjsRegister$p;
commonjsRegister$g("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/Identifier.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromIdentifier;
var JS_RESERVED = {
  Array: Array,
  Date: Date,
  Infinity: Infinity,
  Math: Math,
  Number: Number,
  Object: Object,
  String: String,
  undefined: undefined
};

/**
 * Extractor function for a Identifier type value node.
 * An Identifier is usually a reference to a variable.
 * Just return variable name to determine its existence.
 *
 * @param - value - AST Value object with type `Identifier`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromIdentifier(value) {
  var name = value.name;


  if (Object.hasOwnProperty.call(JS_RESERVED, name)) {
    return JS_RESERVED[name];
  }

  return name;
}
});

var Literal = {};

Object.defineProperty(Literal, "__esModule", {
  value: true
});
Literal.default = extractValueFromLiteral;
/**
 * Extractor function for a Literal type value node.
 *
 * @param - value - AST Value object with type `Literal`
 * @returns { String|Boolean } - The extracted value converted to correct type.
 */
function extractValueFromLiteral(value) {
  var extractedValue = value.value;


  var normalizedStringValue = typeof extractedValue === 'string' && extractedValue.toLowerCase();
  if (normalizedStringValue === 'true') {
    return true;
  }

  if (normalizedStringValue === 'false') {
    return false;
  }

  return extractedValue;
}

var JSXElement = {};

Object.defineProperty(JSXElement, "__esModule", {
  value: true
});
JSXElement.default = extractValueFromJSXElement;
/**
 * Extractor function for a JSXElement type value node.
 *
 * Returns self-closing element with correct name.
 */
function extractValueFromJSXElement(value) {
  return "<" + value.openingElement.name.name + " />";
}

const commonjsRegister$f = commonjsRegister$p;
commonjsRegister$f("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/index.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = extract;
exports.extractLiteral = extractLiteral;

var _Literal = Literal;

var _Literal2 = _interopRequireDefault(_Literal);

var _JSXElement = JSXElement;

var _JSXElement2 = _interopRequireDefault(_JSXElement);

var _Identifier = commonjsRequire("./Identifier", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _Identifier2 = _interopRequireDefault(_Identifier);

var _TaggedTemplateExpression = commonjsRequire("./TaggedTemplateExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _TaggedTemplateExpression2 = _interopRequireDefault(_TaggedTemplateExpression);

var _TemplateLiteral = commonjsRequire("./TemplateLiteral", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _TemplateLiteral2 = _interopRequireDefault(_TemplateLiteral);

var _FunctionExpression = commonjsRequire("./FunctionExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _FunctionExpression2 = _interopRequireDefault(_FunctionExpression);

var _LogicalExpression = commonjsRequire("./LogicalExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _LogicalExpression2 = _interopRequireDefault(_LogicalExpression);

var _MemberExpression = commonjsRequire("./MemberExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _MemberExpression2 = _interopRequireDefault(_MemberExpression);

var _ChainExpression = commonjsRequire("./ChainExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _ChainExpression2 = _interopRequireDefault(_ChainExpression);

var _OptionalCallExpression = commonjsRequire("./OptionalCallExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _OptionalCallExpression2 = _interopRequireDefault(_OptionalCallExpression);

var _OptionalMemberExpression = commonjsRequire("./OptionalMemberExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _OptionalMemberExpression2 = _interopRequireDefault(_OptionalMemberExpression);

var _CallExpression = commonjsRequire("./CallExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _CallExpression2 = _interopRequireDefault(_CallExpression);

var _UnaryExpression = commonjsRequire("./UnaryExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _UnaryExpression2 = _interopRequireDefault(_UnaryExpression);

var _ThisExpression = commonjsRequire("./ThisExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _ThisExpression2 = _interopRequireDefault(_ThisExpression);

var _ConditionalExpression = commonjsRequire("./ConditionalExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _ConditionalExpression2 = _interopRequireDefault(_ConditionalExpression);

var _BinaryExpression = commonjsRequire("./BinaryExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _BinaryExpression2 = _interopRequireDefault(_BinaryExpression);

var _ObjectExpression = commonjsRequire("./ObjectExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _ObjectExpression2 = _interopRequireDefault(_ObjectExpression);

var _NewExpression = commonjsRequire("./NewExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _NewExpression2 = _interopRequireDefault(_NewExpression);

var _UpdateExpression = commonjsRequire("./UpdateExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _UpdateExpression2 = _interopRequireDefault(_UpdateExpression);

var _ArrayExpression = commonjsRequire("./ArrayExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _ArrayExpression2 = _interopRequireDefault(_ArrayExpression);

var _BindExpression = commonjsRequire("./BindExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _BindExpression2 = _interopRequireDefault(_BindExpression);

var _SpreadElement = commonjsRequire("./SpreadElement", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _SpreadElement2 = _interopRequireDefault(_SpreadElement);

var _TypeCastExpression = commonjsRequire("./TypeCastExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _TypeCastExpression2 = _interopRequireDefault(_TypeCastExpression);

var _SequenceExpression = commonjsRequire("./SequenceExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _SequenceExpression2 = _interopRequireDefault(_SequenceExpression);

var _TSNonNullExpression = commonjsRequire("./TSNonNullExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _TSNonNullExpression2 = _interopRequireDefault(_TSNonNullExpression);

var _AssignmentExpression = commonjsRequire("./AssignmentExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _AssignmentExpression2 = _interopRequireDefault(_AssignmentExpression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Composition map of types to their extractor functions.
var TYPES = {
  Identifier: _Identifier2.default,
  Literal: _Literal2.default,
  JSXElement: _JSXElement2.default,
  TaggedTemplateExpression: _TaggedTemplateExpression2.default,
  TemplateLiteral: _TemplateLiteral2.default,
  ArrowFunctionExpression: _FunctionExpression2.default,
  FunctionExpression: _FunctionExpression2.default,
  LogicalExpression: _LogicalExpression2.default,
  MemberExpression: _MemberExpression2.default,
  ChainExpression: _ChainExpression2.default,
  OptionalCallExpression: _OptionalCallExpression2.default,
  OptionalMemberExpression: _OptionalMemberExpression2.default,
  CallExpression: _CallExpression2.default,
  UnaryExpression: _UnaryExpression2.default,
  ThisExpression: _ThisExpression2.default,
  ConditionalExpression: _ConditionalExpression2.default,
  BinaryExpression: _BinaryExpression2.default,
  ObjectExpression: _ObjectExpression2.default,
  NewExpression: _NewExpression2.default,
  UpdateExpression: _UpdateExpression2.default,
  ArrayExpression: _ArrayExpression2.default,
  BindExpression: _BindExpression2.default,
  SpreadElement: _SpreadElement2.default,
  TypeCastExpression: _TypeCastExpression2.default,
  SequenceExpression: _SequenceExpression2.default,
  TSNonNullExpression: _TSNonNullExpression2.default,
  AssignmentExpression: _AssignmentExpression2.default
};

var noop = function noop() {
  return null;
};

var errorMessage = function errorMessage(expression) {
  return 'The prop value with an expression type of ' + expression + ' could not be resolved. Please file issue to get this fixed immediately.';
};

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *all* possible expression types.
 *
 * @param - value - AST Value object with type `JSXExpressionContainer`
 * @returns The extracted value.
 */
function extract(value) {
  // Value will not have the expression property when we recurse.
  // The type for expression on ArrowFunctionExpression is a boolean.
  var expression = void 0;
  if (typeof value.expression !== 'boolean' && value.expression) {
    expression = value.expression; // eslint-disable-line prefer-destructuring
  } else {
    expression = value;
  }
  var _expression = expression,
      type = _expression.type;

  // Typescript NonNull Expression is wrapped & it would end up in the wrong extractor

  if (expression.object && expression.object.type === 'TSNonNullExpression') {
    type = 'TSNonNullExpression';
  }

  while (type === 'TSAsExpression') {
    var _expression2 = expression;
    type = _expression2.type;

    if (expression.expression) {
      var _expression3 = expression;
      expression = _expression3.expression;
    }
  }

  if (TYPES[type] === undefined) {
    // eslint-disable-next-line no-console
    console.error(errorMessage(type));
    return null;
  }

  return TYPES[type](expression);
}

// Composition map of types to their extractor functions to handle literals.
var LITERAL_TYPES = _extends({}, TYPES, {
  Literal: function Literal(value) {
    var extractedVal = TYPES.Literal.call(undefined, value);
    var isNull = extractedVal === null;
    // This will be convention for attributes that have null
    // value explicitly defined (<div prop={null} /> maps to 'null').
    return isNull ? 'null' : extractedVal;
  },
  Identifier: function Identifier(value) {
    var isUndefined = TYPES.Identifier.call(undefined, value) === undefined;
    return isUndefined ? undefined : null;
  },
  JSXElement: noop,
  ArrowFunctionExpression: noop,
  FunctionExpression: noop,
  LogicalExpression: noop,
  MemberExpression: noop,
  OptionalCallExpression: noop,
  OptionalMemberExpression: noop,
  CallExpression: noop,
  UnaryExpression: function UnaryExpression(value) {
    var extractedVal = TYPES.UnaryExpression.call(undefined, value);
    return extractedVal === undefined ? null : extractedVal;
  },
  UpdateExpression: function UpdateExpression(value) {
    var extractedVal = TYPES.UpdateExpression.call(undefined, value);
    return extractedVal === undefined ? null : extractedVal;
  },
  ThisExpression: noop,
  ConditionalExpression: noop,
  BinaryExpression: noop,
  ObjectExpression: noop,
  NewExpression: noop,
  ArrayExpression: function ArrayExpression(value) {
    var extractedVal = TYPES.ArrayExpression.call(undefined, value);
    return extractedVal.filter(function (val) {
      return val !== null;
    });
  },
  BindExpression: noop,
  SpreadElement: noop,
  TSNonNullExpression: noop,
  TSAsExpression: noop,
  TypeCastExpression: noop,
  SequenceExpression: noop
});

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *some* possible types that map to literals.
 *
 * @param - value - AST Value object with type `JSXExpressionContainer`
 * @returns The extracted value.
 */
function extractLiteral(value) {
  // Value will not have the expression property when we recurse.
  var expression = value.expression || value;
  var type = expression.type;


  if (LITERAL_TYPES[type] === undefined) {
    // eslint-disable-next-line no-console
    console.error(errorMessage(type));
    return null;
  }

  return LITERAL_TYPES[type](expression);
}
});

const commonjsRegister$e = commonjsRegister$p;
commonjsRegister$e("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/LogicalExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromLogicalExpression;
/**
 * Extractor function for a LogicalExpression type value node.
 * A logical expression is `a && b` or `a || b`, so we evaluate both sides
 * and return the extracted value of the expression.
 *
 * @param - value - AST Value object with type `LogicalExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromLogicalExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var operator = value.operator,
      left = value.left,
      right = value.right;

  var leftVal = getValue(left);
  var rightVal = getValue(right);

  if (operator === '&&') {
    return leftVal && rightVal;
  }
  if (operator === '??') {
    // return leftVal ?? rightVal; // TODO: update to babel 7
    return leftVal === null || typeof leftVal === 'undefined' ? rightVal : leftVal;
  }
  return leftVal || rightVal;
}
});

const commonjsRegister$d = commonjsRegister$p;
commonjsRegister$d("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/MemberExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromMemberExpression;
/**
 * Extractor function for a MemberExpression type value node.
 * A member expression is accessing a property on an object `obj.property`.
 *
 * @param - value - AST Value object with type `MemberExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj.property` convention.
 */
function extractValueFromMemberExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return '' + getValue(value.object) + (value.optional ? '?.' : '.') + getValue(value.property);
}
});

const commonjsRegister$c = commonjsRegister$p;
commonjsRegister$c("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/NewExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromNewExpression;
/**
 * Extractor function for a NewExpression type value node.
 * A new expression instantiates an object with `new` keyword.
 *
 * @returns - an empty object.
 */
function extractValueFromNewExpression() {
  return new Object(); // eslint-disable-line
}
});

var toStr$a = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr$a.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr$a.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

var keysShim$1;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has$a = Object.prototype.hasOwnProperty;
	var toStr$9 = Object.prototype.toString;
	var isArgs$1 = isArguments; // eslint-disable-line global-require
	var isEnumerable$1 = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable$1.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable$1.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has$a.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim$1 = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr$9.call(object) === '[object Function]';
		var isArguments = isArgs$1(object);
		var isString = isObject && toStr$9.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has$a.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has$a.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has$a.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
var implementation$h = keysShim$1;

var slice$1 = Array.prototype.slice;
var isArgs = isArguments;

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : implementation$h;

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice$1.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

var objectKeys = keysShim;

var keys$1 = objectKeys;
var hasSymbols$8 = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr$8 = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction$1 = function (fn) {
	return typeof fn === 'function' && toStr$8.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction$1(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties$1 = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys$1(map);
	if (hasSymbols$8) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties$1.supportsDescriptors = !!supportsDescriptors;

var defineProperties_1 = defineProperties$1;

var callBind$7 = createModule("/$$rollup_base$$/node_modules/call-bind");

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr$7 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$g = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$7.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var implementation$f = implementation$g;

var functionBind = Function.prototype.bind || implementation$f;

/* eslint complexity: [2, 18], max-statements: [2, 33] */
var shams = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = shams;

var hasSymbols$7 = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

var bind$1 = functionBind;

var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;

var $SyntaxError$1 = SyntaxError;
var $Function = Function;
var $TypeError$s = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD$2 = Object.getOwnPropertyDescriptor;
if ($gOPD$2) {
	try {
		$gOPD$2({}, '');
	} catch (e) {
		$gOPD$2 = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError$s();
};
var ThrowTypeError = $gOPD$2
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD$2(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols$6 = hasSymbols$7();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols$6 ? getProto([][Symbol.iterator]()) : undefined$1,
	'%AsyncFromSyncIteratorPrototype%': undefined$1,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols$6 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$6 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$6 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols$6 ? getProto(''[Symbol.iterator]()) : undefined$1,
	'%Symbol%': hasSymbols$6 ? Symbol : undefined$1,
	'%SyntaxError%': $SyntaxError$1,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError$s,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = functionBind;
var hasOwn$1 = src;
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace$1 = bind.call(Function.call, String.prototype.replace);
var $strSlice$1 = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice$1(string, 0, 1);
	var last = $strSlice$1(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError$1('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError$1('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace$1(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace$1(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn$1(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError$s('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError$1('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError$s('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError$s('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice$1(part, 0, 1);
		var last = $strSlice$1(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError$1('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError$s('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined$1;
			}
			if ($gOPD$2 && (i + 1) >= parts.length) {
				var desc = $gOPD$2(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn$1(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

(function (module) {

var bind = functionBind;
var GetIntrinsic = getIntrinsic;

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}
}(callBind$7));

var GetIntrinsic$H = getIntrinsic;

var callBind$6 = callBind$7.exports;

var $indexOf$1 = callBind$6(GetIntrinsic$H('String.prototype.indexOf'));

var callBound$b = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic$H(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf$1(name, '.prototype.') > -1) {
		return callBind$6(intrinsic);
	}
	return intrinsic;
};

// modified from https://github.com/es-shims/es6-shim
var keys = objectKeys;
var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols$5 = shams();
var callBound$a = callBound$b;
var toObject = Object;
var $push = callBound$a('Array.prototype.push');
var $propIsEnumerable = callBound$a('Object.prototype.propertyIsEnumerable');
var originalGetSymbols = hasSymbols$5 ? Object.getOwnPropertySymbols : null;

// eslint-disable-next-line no-unused-vars
var implementation$e = function assign(target, source1) {
	if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		var getSymbols = hasSymbols$5 && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if ($propIsEnumerable(source, key)) {
					$push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if ($propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

var implementation$d = implementation$e;

var lacksProperEnumerationOrder = function () {
	if (!Object.assign) {
		return false;
	}
	/*
	 * v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	 * note: this does not detect the bug unless there's 20 characters
	 */
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function () {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	/*
	 * Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	 * which is 72% slower than our shim, and Firefox 40's native implementation.
	 */
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

var polyfill$9 = function getPolyfill() {
	if (!Object.assign) {
		return implementation$d;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation$d;
	}
	if (assignHasPendingExceptions()) {
		return implementation$d;
	}
	return Object.assign;
};

var define$8 = defineProperties_1;
var getPolyfill$9 = polyfill$9;

var shim$9 = function shimAssign() {
	var polyfill = getPolyfill$9();
	define$8(
		Object,
		{ assign: polyfill },
		{ assign: function () { return Object.assign !== polyfill; } }
	);
	return polyfill;
};

var defineProperties = defineProperties_1;
var callBind$5 = callBind$7.exports;

var implementation$c = implementation$e;
var getPolyfill$8 = polyfill$9;
var shim$8 = shim$9;

var polyfill$8 = callBind$5.apply(getPolyfill$8());
// eslint-disable-next-line no-unused-vars
var bound = function assign(target, source1) {
	return polyfill$8(Object, arguments);
};

defineProperties(bound, {
	getPolyfill: getPolyfill$8,
	implementation: implementation$c,
	shim: shim$8
});

var object_assign = bound;

const commonjsRegister$b = commonjsRegister$p;
commonjsRegister$b("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/ObjectExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = extractValueFromObjectExpression;

var _object = object_assign;

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extractor function for an ObjectExpression type value node.
 * An object expression is using {}.
 *
 * @returns - a representation of the object
 */
function extractValueFromObjectExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return value.properties.reduce(function (obj, property) {
    var object = _extends({}, obj);
    // Support types: SpreadProperty and ExperimentalSpreadProperty
    if (/^(?:Experimental)?Spread(?:Property|Element)$/.test(property.type)) {
      if (property.argument.type === 'ObjectExpression') {
        return (0, _object2.default)(object, extractValueFromObjectExpression(property.argument));
      }
    } else {
      object[getValue(property.key)] = getValue(property.value);
    }
    return object;
  }, {});
}
});

const commonjsRegister$a = commonjsRegister$p;
commonjsRegister$a("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/OptionalCallExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromOptionalCallExpression;
/**
 * Extractor function for a OptionalCallExpression type value node.
 * A member expression is accessing a property on an object `obj.property` and invoking it.
 *
 * @param - value - AST Value object with type `OptionalCallExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj.property?.()` convention.
 */
function extractValueFromOptionalCallExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return getValue(value.callee) + '?.(' + value.arguments.map(function (x) {
    return getValue(x);
  }).join(', ') + ')';
}
});

const commonjsRegister$9 = commonjsRegister$p;
commonjsRegister$9("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/OptionalMemberExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromOptionalMemberExpression;
/**
 * Extractor function for a OptionalMemberExpression type value node.
 * A member expression is accessing a property on an object `obj.property`.
 *
 * @param - value - AST Value object with type `OptionalMemberExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj?.property` convention.
 */
function extractValueFromOptionalMemberExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return getValue(value.object) + '?.' + getValue(value.property);
}
});

const commonjsRegister$8 = commonjsRegister$p;
commonjsRegister$8("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/SequenceExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromSequenceExpression;
/**
 * Extractor function for a SequenceExpression type value node.
 * A Sequence expression is an object with an attribute named
 * expressions which contains an array of different types
 *  of expression objects.
 *
 * @returns - An array of the extracted elements.
 */
function extractValueFromSequenceExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire(".", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return value.expressions.map(function (element) {
    return getValue(element);
  });
}
});

const commonjsRegister$7 = commonjsRegister$p;
commonjsRegister$7("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/SpreadElement.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromSpreadElement;
/**
 * Extractor function for a SpreadElement type value node.
 * We can't statically evaluate an array spread, so just return
 * undefined.
 *
 * @param - value - AST Value object with type `SpreadElement`
 * @returns - An prototypeless object.
 */
function extractValueFromSpreadElement() {
  return undefined;
}
});

const commonjsRegister$6 = commonjsRegister$p;
commonjsRegister$6("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/TaggedTemplateExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromTaggedTemplateExpression;

var _TemplateLiteral = commonjsRequire("./TemplateLiteral", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var _TemplateLiteral2 = _interopRequireDefault(_TemplateLiteral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the string value of a tagged template literal object.
 * Redirects the bulk of the work to `TemplateLiteral`.
 */
function extractValueFromTaggedTemplateExpression(value) {
  return (0, _TemplateLiteral2.default)(value.quasi);
}
});

const commonjsRegister$5 = commonjsRegister$p;
commonjsRegister$5("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/TemplateLiteral.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromTemplateLiteral;
function sortStarts(a, b) {
  return (a.range ? a.range[0] : a.start) - (b.range ? b.range[0] : b.start);
}

/**
 * Returns the string value of a template literal object.
 * Tries to build it as best as it can based on the passed
 * prop. For instance `This is a ${prop}` will return 'This is a {prop}'.
 *
 * If the template literal builds to undefined (`${undefined}`), then
 * this should return "undefined".
 */
function extractValueFromTemplateLiteral(value) {
  var quasis = value.quasis,
      expressions = value.expressions;

  var partitions = quasis.concat(expressions);

  return partitions.sort(sortStarts).reduce(function (raw, part) {
    var type = part.type;

    if (type === 'TemplateElement') {
      return raw + part.value.raw;
    }

    if (type === 'Identifier') {
      return part.name === 'undefined' ? '' + raw + part.name : raw + '{' + part.name + '}';
    }

    if (type.indexOf('Expression') > -1) {
      return raw + '{' + type + '}';
    }

    return raw;
  }, '');
}
});

const commonjsRegister$4 = commonjsRegister$p;
commonjsRegister$4("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/ThisExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromThisExpression;
/**
 * Extractor function for a ThisExpression type value node.
 * A this expression is using `this` as an identifier.
 *
 * @returns - 'this' as a string.
 */
function extractValueFromThisExpression() {
  return 'this';
}
});

const commonjsRegister$3 = commonjsRegister$p;
commonjsRegister$3("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/TSNonNullExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromTSNonNullExpression;
var extractValueFromThisExpression = commonjsRequire("./ThisExpression", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;

/**
 * Extractor function for a TSNonNullExpression type value node.
 * A TSNonNullExpression is accessing a TypeScript Non-Null Assertion
 * Operator !
 *
 * @param - value - AST Value object with type `TSNonNullExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj.property` convention.
 */
function extractValueFromTSNonNullExpression(value) {
  // eslint-disable-next-line global-require
  // const getValue = require('.').default;
  var errorMessage = 'The prop value with an expression type of TSNonNullExpression could not be resolved. Please file issue to get this fixed immediately.';

  // it's just the name
  if (value.type === 'Identifier') {
    var name = value.name;

    return name;
  }

  if (value.type === 'ThisExpression') {
    return extractValueFromThisExpression();
  }

  // does not contains properties & is not parenthesized
  if (value.type === 'TSNonNullExpression' && (!value.extra || value.extra.parenthesized === false)) {
    var expression = value.expression;

    return extractValueFromTSNonNullExpression(expression) + '!';
  }

  // does not contains properties & is parenthesized
  if (value.type === 'TSNonNullExpression' && value.extra && value.extra.parenthesized === true) {
    var _expression = value.expression;

    return '(' + extractValueFromTSNonNullExpression(_expression) + '!' + ')';
  }

  // contains a property & is not parenthesized
  if (value.type === 'MemberExpression' && (!value.extra || value.extra.parenthesized === false)) {
    return '' + extractValueFromTSNonNullExpression(value.object) + (value.optional ? '?.' : '.') + extractValueFromTSNonNullExpression(value.property);
  }

  // contains a property & is parenthesized
  if (value.type === 'MemberExpression' && value.extra && value.extra.parenthesized === true) {
    return '(' + extractValueFromTSNonNullExpression(value.object) + (value.optional ? '?.' : '.') + extractValueFromTSNonNullExpression(value.property) + ')';
  }

  // try to fail silently, if specs for TSNonNullExpression change
  // not throw, only log error. Similar to how it was done previously
  if (value.expression) {
    var _expression2 = value.expression;

    while (_expression2) {
      if (_expression2.type === 'Identifier') {
        // eslint-disable-next-line no-console
        console.error(errorMessage);
        return _expression2.name;
      }
      var _expression3 = _expression2;
      _expression2 = _expression3.expression;
    }
  }

  // eslint-disable-next-line no-console
  console.error(errorMessage);
  return '';
}
});

const commonjsRegister$2 = commonjsRegister$p;
commonjsRegister$2("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/TypeCastExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromTypeCastExpression;
/**
 * Extractor function for a TypeCastExpression type value node.
 * A type cast expression looks like `(this.handleClick: (event: MouseEvent) => void))`
 * This will return the expression `this.handleClick`.
 *
 * @param - value - AST Value object with type `TypeCastExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromTypeCastExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  return getValue(value.expression);
}
});

const commonjsRegister$1 = commonjsRegister$p;
commonjsRegister$1("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/UnaryExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromUnaryExpression;
/**
 * Extractor function for a UnaryExpression type value node.
 * A unary expression is an expression with a unary operator.
 * For example, !"foobar" will evaluate to false, so this will return false.
 *
 * @param - value - AST Value object with type `UnaryExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromUnaryExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var operator = value.operator,
      argument = value.argument;


  switch (operator) {
    case '-':
      return -getValue(argument);
    case '+':
      return +getValue(argument); // eslint-disable-line no-implicit-coercion
    case '!':
      return !getValue(argument);
    case '~':
      return ~getValue(argument); // eslint-disable-line no-bitwise
    case 'delete':
      // I believe delete statements evaluate to true.
      return true;
    case 'typeof':
    case 'void':
    default:
      return undefined;
  }
}
});

const commonjsRegister = commonjsRegister$p;
commonjsRegister("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/UpdateExpression.js", function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromUpdateExpression;
/**
 * Extractor function for an UpdateExpression type value node.
 * An update expression is an expression with an update operator.
 * For example, foo++ will evaluate to foo + 1.
 *
 * @param - value - AST Value object with type `UpdateExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromUpdateExpression(value) {
  // eslint-disable-next-line global-require
  var getValue = commonjsRequire("./index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions").default;
  var operator = value.operator,
      argument = value.argument,
      prefix = value.prefix;


  var val = getValue(argument);

  switch (operator) {
    case '++':
      return prefix ? ++val : val++; // eslint-disable-line no-plusplus
    case '--':
      return prefix ? --val : val--; // eslint-disable-line no-plusplus
    default:
      return undefined;
  }
}
});

var doctrine = {};

var utils = {};

var ast = createModule("/$$rollup_base$$/node_modules/esutils/lib");

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    function isExpression(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'ArrayExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'FunctionExpression':
            case 'Identifier':
            case 'Literal':
            case 'LogicalExpression':
            case 'MemberExpression':
            case 'NewExpression':
            case 'ObjectExpression':
            case 'SequenceExpression':
            case 'ThisExpression':
            case 'UnaryExpression':
            case 'UpdateExpression':
                return true;
        }
        return false;
    }

    function isIterationStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'WhileStatement':
                return true;
        }
        return false;
    }

    function isStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'BlockStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
            case 'DebuggerStatement':
            case 'DoWhileStatement':
            case 'EmptyStatement':
            case 'ExpressionStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'IfStatement':
            case 'LabeledStatement':
            case 'ReturnStatement':
            case 'SwitchStatement':
            case 'ThrowStatement':
            case 'TryStatement':
            case 'VariableDeclaration':
            case 'WhileStatement':
            case 'WithStatement':
                return true;
        }
        return false;
    }

    function isSourceElement(node) {
      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
    }

    function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
            if (node.alternate != null) {
                return node.alternate;
            }
            return node.consequent;

        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
            return node.body;
        }
        return null;
    }

    function isProblematicIfStatement(node) {
        var current;

        if (node.type !== 'IfStatement') {
            return false;
        }
        if (node.alternate == null) {
            return false;
        }
        current = node.consequent;
        do {
            if (current.type === 'IfStatement') {
                if (current.alternate == null)  {
                    return true;
                }
            }
            current = trailingStatement(current);
        } while (current);

        return false;
    }

    ast.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,

        trailingStatement: trailingStatement
    };
}());

var code = createModule("/$$rollup_base$$/node_modules/esutils/lib");

/*
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

    // See `tools/generate-identifier-regex.js`.
    ES5Regex = {
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    };

    ES6Regex = {
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;  // 0..9
    }

    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
            0x61 <= ch && ch <= 0x66 ||     // a..f
            0x41 <= ch && ch <= 0x46;       // A..F
    }

    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;  // 0..7
    }

    // 7.2 White Space

    NON_ASCII_WHITESPACES = [
        0x1680,
        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
        0x202F, 0x205F,
        0x3000,
        0xFEFF
    ];

    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }

    // 7.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
        return cu1 + cu2;
    }

    IDENTIFIER_START = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_START[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    IDENTIFIER_PART = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_PART[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch >= 0x30 && ch <= 0x39 ||  // 0..9
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    code.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStartES5: isIdentifierStartES5,
        isIdentifierPartES5: isIdentifierPartES5,
        isIdentifierStartES6: isIdentifierStartES6,
        isIdentifierPartES6: isIdentifierPartES6
    };
}());

var keyword = createModule("/$$rollup_base$$/node_modules/esutils/lib");

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    var code$1 = code.exports;

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
    }

    function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierNameES5(id) {
        var i, iz, ch;

        if (id.length === 0) { return false; }

        ch = id.charCodeAt(0);
        if (!code$1.isIdentifierStartES5(ch)) {
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code$1.isIdentifierPartES5(ch)) {
                return false;
            }
        }
        return true;
    }

    function decodeUtf16(lead, trail) {
        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
    }

    function isIdentifierNameES6(id) {
        var i, iz, ch, lowCh, check;

        if (id.length === 0) { return false; }

        check = code$1.isIdentifierStartES6;
        for (i = 0, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                ++i;
                if (i >= iz) { return false; }
                lowCh = id.charCodeAt(i);
                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                    return false;
                }
                ch = decodeUtf16(ch, lowCh);
            }
            if (!check(ch)) {
                return false;
            }
            check = code$1.isIdentifierPartES6;
        }
        return true;
    }

    function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
    }

    function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
    }

    keyword.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierNameES5: isIdentifierNameES5,
        isIdentifierNameES6: isIdentifierNameES6,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
    };
}());

/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function () {

    utils.ast = ast.exports;
    utils.code = code.exports;
    utils.keyword = keyword.exports;
}());

var typed = {};

var utility = {};

var name = "doctrine";
var description = "JSDoc parser";
var homepage = "https://github.com/eslint/doctrine";
var main = "lib/doctrine.js";
var version = "2.1.0";
var engines = {
	node: ">=0.10.0"
};
var directories = {
	lib: "./lib"
};
var files = [
	"lib"
];
var maintainers = [
	{
		name: "Nicholas C. Zakas",
		email: "nicholas+npm@nczconsulting.com",
		web: "https://www.nczonline.net"
	},
	{
		name: "Yusuke Suzuki",
		email: "utatane.tea@gmail.com",
		web: "https://github.com/Constellation"
	}
];
var repository = "eslint/doctrine";
var devDependencies = {
	coveralls: "^2.11.2",
	dateformat: "^1.0.11",
	eslint: "^1.10.3",
	"eslint-release": "^0.10.0",
	linefix: "^0.1.1",
	mocha: "^3.4.2",
	"npm-license": "^0.3.1",
	nyc: "^10.3.2",
	semver: "^5.0.3",
	shelljs: "^0.5.3",
	"shelljs-nodecli": "^0.1.1",
	should: "^5.0.1"
};
var license = "Apache-2.0";
var scripts = {
	pretest: "npm run lint",
	test: "nyc mocha",
	coveralls: "nyc report --reporter=text-lcov | coveralls",
	lint: "eslint lib/",
	release: "eslint-release",
	"ci-release": "eslint-ci-release",
	alpharelease: "eslint-prerelease alpha",
	betarelease: "eslint-prerelease beta"
};
var dependencies = {
	esutils: "^2.0.2"
};
var require$$0$1 = {
	name: name,
	description: description,
	homepage: homepage,
	main: main,
	version: version,
	engines: engines,
	directories: directories,
	files: files,
	maintainers: maintainers,
	repository: repository,
	devDependencies: devDependencies,
	license: license,
	scripts: scripts,
	dependencies: dependencies
};

/*
 * @fileoverview Utilities for Doctrine
 * @author Yusuke Suzuki <utatane.tea@gmail.com>
 */
(function () {

    var VERSION;

    VERSION = require$$0$1.version;
    utility.VERSION = VERSION;

    function DoctrineError(message) {
        this.name = 'DoctrineError';
        this.message = message;
    }
    DoctrineError.prototype = (function () {
        var Middle = function () { };
        Middle.prototype = Error.prototype;
        return new Middle();
    }());
    DoctrineError.prototype.constructor = DoctrineError;
    utility.DoctrineError = DoctrineError;

    function throwError(message) {
        throw new DoctrineError(message);
    }
    utility.throwError = throwError;

    utility.assert = require$$1__default['default'];
}());

/*
 * @fileoverview Type expression parser.
 * @author Yusuke Suzuki <utatane.tea@gmail.com>
 * @author Dan Tao <daniel.tao@gmail.com>
 * @author Andrew Eisenberg <andrew@eisenberg.as>
 */
// "typed", the Type Expression Parser for doctrine.

(function () {

    var Syntax,
        Token,
        source,
        length,
        index,
        previous,
        token,
        value,
        esutils,
        utility$1,
        rangeOffset,
        addRange;

    esutils = utils;
    utility$1 = utility;

    Syntax = {
        NullableLiteral: 'NullableLiteral',
        AllLiteral: 'AllLiteral',
        NullLiteral: 'NullLiteral',
        UndefinedLiteral: 'UndefinedLiteral',
        VoidLiteral: 'VoidLiteral',
        UnionType: 'UnionType',
        ArrayType: 'ArrayType',
        RecordType: 'RecordType',
        FieldType: 'FieldType',
        FunctionType: 'FunctionType',
        ParameterType: 'ParameterType',
        RestType: 'RestType',
        NonNullableType: 'NonNullableType',
        OptionalType: 'OptionalType',
        NullableType: 'NullableType',
        NameExpression: 'NameExpression',
        TypeApplication: 'TypeApplication',
        StringLiteralType: 'StringLiteralType',
        NumericLiteralType: 'NumericLiteralType',
        BooleanLiteralType: 'BooleanLiteralType'
    };

    Token = {
        ILLEGAL: 0,    // ILLEGAL
        DOT_LT: 1,     // .<
        REST: 2,       // ...
        LT: 3,         // <
        GT: 4,         // >
        LPAREN: 5,     // (
        RPAREN: 6,     // )
        LBRACE: 7,     // {
        RBRACE: 8,     // }
        LBRACK: 9,    // [
        RBRACK: 10,    // ]
        COMMA: 11,     // ,
        COLON: 12,     // :
        STAR: 13,      // *
        PIPE: 14,      // |
        QUESTION: 15,  // ?
        BANG: 16,      // !
        EQUAL: 17,     // =
        NAME: 18,      // name token
        STRING: 19,    // string
        NUMBER: 20,    // number
        EOF: 21
    };

    function isTypeName(ch) {
        return '><(){}[],:*|?!='.indexOf(String.fromCharCode(ch)) === -1 && !esutils.code.isWhiteSpace(ch) && !esutils.code.isLineTerminator(ch);
    }

    function Context(previous, index, token, value) {
        this._previous = previous;
        this._index = index;
        this._token = token;
        this._value = value;
    }

    Context.prototype.restore = function () {
        previous = this._previous;
        index = this._index;
        token = this._token;
        value = this._value;
    };

    Context.save = function () {
        return new Context(previous, index, token, value);
    };

    function maybeAddRange(node, range) {
        if (addRange) {
            node.range = [range[0] + rangeOffset, range[1] + rangeOffset];
        }
        return node;
    }

    function advance() {
        var ch = source.charAt(index);
        index += 1;
        return ch;
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && esutils.code.isHexDigit(source.charCodeAt(index))) {
                ch = advance();
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function scanString() {
        var str = '', quote, ch, code, unescaped, restore; //TODO review removal octal = false
        quote = source.charAt(index);
        ++index;

        while (index < length) {
            ch = advance();

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = advance();
                if (!esutils.code.isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'u':
                    case 'x':
                        restore = index;
                        unescaped = scanHexEscape(ch);
                        if (unescaped) {
                            str += unescaped;
                        } else {
                            index = restore;
                            str += ch;
                        }
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\v';
                        break;

                    default:
                        if (esutils.code.isOctalDigit(ch.charCodeAt(0))) {
                            code = '01234567'.indexOf(ch);

                            // \0 is not octal escape sequence
                            // Deprecating unused code. TODO review removal
                            //if (code !== 0) {
                            //    octal = true;
                            //}

                            if (index < length && esutils.code.isOctalDigit(source.charCodeAt(index))) {
                                //TODO Review Removal octal = true;
                                code = code * 8 + '01234567'.indexOf(advance());

                                // 3 digits are only allowed when string starts
                                // with 0, 1, 2, 3
                                if ('0123'.indexOf(ch) >= 0 &&
                                        index < length &&
                                        esutils.code.isOctalDigit(source.charCodeAt(index))) {
                                    code = code * 8 + '01234567'.indexOf(advance());
                                }
                            }
                            str += String.fromCharCode(code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    if (ch ===  '\r' && source.charCodeAt(index) === 0x0A  /* '\n' */) {
                        ++index;
                    }
                }
            } else if (esutils.code.isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            utility$1.throwError('unexpected quote');
        }

        value = str;
        return Token.STRING;
    }

    function scanNumber() {
        var number, ch;

        number = '';
        ch = source.charCodeAt(index);

        if (ch !== 0x2E  /* '.' */) {
            number = advance();
            ch = source.charCodeAt(index);

            if (number === '0') {
                if (ch === 0x78  /* 'x' */ || ch === 0x58  /* 'X' */) {
                    number += advance();
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (!esutils.code.isHexDigit(ch)) {
                            break;
                        }
                        number += advance();
                    }

                    if (number.length <= 2) {
                        // only 0x
                        utility$1.throwError('unexpected token');
                    }

                    if (index < length) {
                        ch = source.charCodeAt(index);
                        if (esutils.code.isIdentifierStartES5(ch)) {
                            utility$1.throwError('unexpected token');
                        }
                    }
                    value = parseInt(number, 16);
                    return Token.NUMBER;
                }

                if (esutils.code.isOctalDigit(ch)) {
                    number += advance();
                    while (index < length) {
                        ch = source.charCodeAt(index);
                        if (!esutils.code.isOctalDigit(ch)) {
                            break;
                        }
                        number += advance();
                    }

                    if (index < length) {
                        ch = source.charCodeAt(index);
                        if (esutils.code.isIdentifierStartES5(ch) || esutils.code.isDecimalDigit(ch)) {
                            utility$1.throwError('unexpected token');
                        }
                    }
                    value = parseInt(number, 8);
                    return Token.NUMBER;
                }

                if (esutils.code.isDecimalDigit(ch)) {
                    utility$1.throwError('unexpected token');
                }
            }

            while (index < length) {
                ch = source.charCodeAt(index);
                if (!esutils.code.isDecimalDigit(ch)) {
                    break;
                }
                number += advance();
            }
        }

        if (ch === 0x2E  /* '.' */) {
            number += advance();
            while (index < length) {
                ch = source.charCodeAt(index);
                if (!esutils.code.isDecimalDigit(ch)) {
                    break;
                }
                number += advance();
            }
        }

        if (ch === 0x65  /* 'e' */ || ch === 0x45  /* 'E' */) {
            number += advance();

            ch = source.charCodeAt(index);
            if (ch === 0x2B  /* '+' */ || ch === 0x2D  /* '-' */) {
                number += advance();
            }

            ch = source.charCodeAt(index);
            if (esutils.code.isDecimalDigit(ch)) {
                number += advance();
                while (index < length) {
                    ch = source.charCodeAt(index);
                    if (!esutils.code.isDecimalDigit(ch)) {
                        break;
                    }
                    number += advance();
                }
            } else {
                utility$1.throwError('unexpected token');
            }
        }

        if (index < length) {
            ch = source.charCodeAt(index);
            if (esutils.code.isIdentifierStartES5(ch)) {
                utility$1.throwError('unexpected token');
            }
        }

        value = parseFloat(number);
        return Token.NUMBER;
    }


    function scanTypeName() {
        var ch, ch2;

        value = advance();
        while (index < length && isTypeName(source.charCodeAt(index))) {
            ch = source.charCodeAt(index);
            if (ch === 0x2E  /* '.' */) {
                if ((index + 1) >= length) {
                    return Token.ILLEGAL;
                }
                ch2 = source.charCodeAt(index + 1);
                if (ch2 === 0x3C  /* '<' */) {
                    break;
                }
            }
            value += advance();
        }
        return Token.NAME;
    }

    function next() {
        var ch;

        previous = index;

        while (index < length && esutils.code.isWhiteSpace(source.charCodeAt(index))) {
            advance();
        }
        if (index >= length) {
            token = Token.EOF;
            return token;
        }

        ch = source.charCodeAt(index);
        switch (ch) {
        case 0x27:  /* ''' */
        case 0x22:  /* '"' */
            token = scanString();
            return token;

        case 0x3A:  /* ':' */
            advance();
            token = Token.COLON;
            return token;

        case 0x2C:  /* ',' */
            advance();
            token = Token.COMMA;
            return token;

        case 0x28:  /* '(' */
            advance();
            token = Token.LPAREN;
            return token;

        case 0x29:  /* ')' */
            advance();
            token = Token.RPAREN;
            return token;

        case 0x5B:  /* '[' */
            advance();
            token = Token.LBRACK;
            return token;

        case 0x5D:  /* ']' */
            advance();
            token = Token.RBRACK;
            return token;

        case 0x7B:  /* '{' */
            advance();
            token = Token.LBRACE;
            return token;

        case 0x7D:  /* '}' */
            advance();
            token = Token.RBRACE;
            return token;

        case 0x2E:  /* '.' */
            if (index + 1 < length) {
                ch = source.charCodeAt(index + 1);
                if (ch === 0x3C  /* '<' */) {
                    advance();  // '.'
                    advance();  // '<'
                    token = Token.DOT_LT;
                    return token;
                }

                if (ch === 0x2E  /* '.' */ && index + 2 < length && source.charCodeAt(index + 2) === 0x2E  /* '.' */) {
                    advance();  // '.'
                    advance();  // '.'
                    advance();  // '.'
                    token = Token.REST;
                    return token;
                }

                if (esutils.code.isDecimalDigit(ch)) {
                    token = scanNumber();
                    return token;
                }
            }
            token = Token.ILLEGAL;
            return token;

        case 0x3C:  /* '<' */
            advance();
            token = Token.LT;
            return token;

        case 0x3E:  /* '>' */
            advance();
            token = Token.GT;
            return token;

        case 0x2A:  /* '*' */
            advance();
            token = Token.STAR;
            return token;

        case 0x7C:  /* '|' */
            advance();
            token = Token.PIPE;
            return token;

        case 0x3F:  /* '?' */
            advance();
            token = Token.QUESTION;
            return token;

        case 0x21:  /* '!' */
            advance();
            token = Token.BANG;
            return token;

        case 0x3D:  /* '=' */
            advance();
            token = Token.EQUAL;
            return token;

        case 0x2D: /* '-' */
            token = scanNumber();
            return token;

        default:
            if (esutils.code.isDecimalDigit(ch)) {
                token = scanNumber();
                return token;
            }

            // type string permits following case,
            //
            // namespace.module.MyClass
            //
            // this reduced 1 token TK_NAME
            utility$1.assert(isTypeName(ch));
            token = scanTypeName();
            return token;
        }
    }

    function consume(target, text) {
        utility$1.assert(token === target, text || 'consumed token not matched');
        next();
    }

    function expect(target, message) {
        if (token !== target) {
            utility$1.throwError(message || 'unexpected token');
        }
        next();
    }

    // UnionType := '(' TypeUnionList ')'
    //
    // TypeUnionList :=
    //     <<empty>>
    //   | NonemptyTypeUnionList
    //
    // NonemptyTypeUnionList :=
    //     TypeExpression
    //   | TypeExpression '|' NonemptyTypeUnionList
    function parseUnionType() {
        var elements, startIndex = index - 1;
        consume(Token.LPAREN, 'UnionType should start with (');
        elements = [];
        if (token !== Token.RPAREN) {
            while (true) {
                elements.push(parseTypeExpression());
                if (token === Token.RPAREN) {
                    break;
                }
                expect(Token.PIPE);
            }
        }
        consume(Token.RPAREN, 'UnionType should end with )');
        return maybeAddRange({
            type: Syntax.UnionType,
            elements: elements
        }, [startIndex, previous]);
    }

    // ArrayType := '[' ElementTypeList ']'
    //
    // ElementTypeList :=
    //     <<empty>>
    //  | TypeExpression
    //  | '...' TypeExpression
    //  | TypeExpression ',' ElementTypeList
    function parseArrayType() {
        var elements, startIndex = index - 1, restStartIndex;
        consume(Token.LBRACK, 'ArrayType should start with [');
        elements = [];
        while (token !== Token.RBRACK) {
            if (token === Token.REST) {
                restStartIndex = index - 3;
                consume(Token.REST);
                elements.push(maybeAddRange({
                    type: Syntax.RestType,
                    expression: parseTypeExpression()
                }, [restStartIndex, previous]));
                break;
            } else {
                elements.push(parseTypeExpression());
            }
            if (token !== Token.RBRACK) {
                expect(Token.COMMA);
            }
        }
        expect(Token.RBRACK);
        return maybeAddRange({
            type: Syntax.ArrayType,
            elements: elements
        }, [startIndex, previous]);
    }

    function parseFieldName() {
        var v = value;
        if (token === Token.NAME || token === Token.STRING) {
            next();
            return v;
        }

        if (token === Token.NUMBER) {
            consume(Token.NUMBER);
            return String(v);
        }

        utility$1.throwError('unexpected token');
    }

    // FieldType :=
    //     FieldName
    //   | FieldName ':' TypeExpression
    //
    // FieldName :=
    //     NameExpression
    //   | StringLiteral
    //   | NumberLiteral
    //   | ReservedIdentifier
    function parseFieldType() {
        var key, rangeStart = previous;

        key = parseFieldName();
        if (token === Token.COLON) {
            consume(Token.COLON);
            return maybeAddRange({
                type: Syntax.FieldType,
                key: key,
                value: parseTypeExpression()
            }, [rangeStart, previous]);
        }
        return maybeAddRange({
            type: Syntax.FieldType,
            key: key,
            value: null
        }, [rangeStart, previous]);
    }

    // RecordType := '{' FieldTypeList '}'
    //
    // FieldTypeList :=
    //     <<empty>>
    //   | FieldType
    //   | FieldType ',' FieldTypeList
    function parseRecordType() {
        var fields, rangeStart = index - 1, rangeEnd;

        consume(Token.LBRACE, 'RecordType should start with {');
        fields = [];
        if (token === Token.COMMA) {
            consume(Token.COMMA);
        } else {
            while (token !== Token.RBRACE) {
                fields.push(parseFieldType());
                if (token !== Token.RBRACE) {
                    expect(Token.COMMA);
                }
            }
        }
        rangeEnd = index;
        expect(Token.RBRACE);
        return maybeAddRange({
            type: Syntax.RecordType,
            fields: fields
        }, [rangeStart, rangeEnd]);
    }

    // NameExpression :=
    //    Identifier
    //  | TagIdentifier ':' Identifier
    //
    // Tag identifier is one of "module", "external" or "event"
    // Identifier is the same as Token.NAME, including any dots, something like
    // namespace.module.MyClass
    function parseNameExpression() {
        var name = value, rangeStart = index - name.length;
        expect(Token.NAME);

        if (token === Token.COLON && (
                name === 'module' ||
                name === 'external' ||
                name === 'event')) {
            consume(Token.COLON);
            name += ':' + value;
            expect(Token.NAME);
        }

        return maybeAddRange({
            type: Syntax.NameExpression,
            name: name
        }, [rangeStart, previous]);
    }

    // TypeExpressionList :=
    //     TopLevelTypeExpression
    //   | TopLevelTypeExpression ',' TypeExpressionList
    function parseTypeExpressionList() {
        var elements = [];

        elements.push(parseTop());
        while (token === Token.COMMA) {
            consume(Token.COMMA);
            elements.push(parseTop());
        }
        return elements;
    }

    // TypeName :=
    //     NameExpression
    //   | NameExpression TypeApplication
    //
    // TypeApplication :=
    //     '.<' TypeExpressionList '>'
    //   | '<' TypeExpressionList '>'   // this is extension of doctrine
    function parseTypeName() {
        var expr, applications, startIndex = index - value.length;

        expr = parseNameExpression();
        if (token === Token.DOT_LT || token === Token.LT) {
            next();
            applications = parseTypeExpressionList();
            expect(Token.GT);
            return maybeAddRange({
                type: Syntax.TypeApplication,
                expression: expr,
                applications: applications
            }, [startIndex, previous]);
        }
        return expr;
    }

    // ResultType :=
    //     <<empty>>
    //   | ':' void
    //   | ':' TypeExpression
    //
    // BNF is above
    // but, we remove <<empty>> pattern, so token is always TypeToken::COLON
    function parseResultType() {
        consume(Token.COLON, 'ResultType should start with :');
        if (token === Token.NAME && value === 'void') {
            consume(Token.NAME);
            return {
                type: Syntax.VoidLiteral
            };
        }
        return parseTypeExpression();
    }

    // ParametersType :=
    //     RestParameterType
    //   | NonRestParametersType
    //   | NonRestParametersType ',' RestParameterType
    //
    // RestParameterType :=
    //     '...'
    //     '...' Identifier
    //
    // NonRestParametersType :=
    //     ParameterType ',' NonRestParametersType
    //   | ParameterType
    //   | OptionalParametersType
    //
    // OptionalParametersType :=
    //     OptionalParameterType
    //   | OptionalParameterType, OptionalParametersType
    //
    // OptionalParameterType := ParameterType=
    //
    // ParameterType := TypeExpression | Identifier ':' TypeExpression
    //
    // Identifier is "new" or "this"
    function parseParametersType() {
        var params = [], optionalSequence = false, expr, rest = false, startIndex, restStartIndex = index - 3, nameStartIndex;

        while (token !== Token.RPAREN) {
            if (token === Token.REST) {
                // RestParameterType
                consume(Token.REST);
                rest = true;
            }

            startIndex = previous;

            expr = parseTypeExpression();
            if (expr.type === Syntax.NameExpression && token === Token.COLON) {
                nameStartIndex = previous - expr.name.length;
                // Identifier ':' TypeExpression
                consume(Token.COLON);
                expr = maybeAddRange({
                    type: Syntax.ParameterType,
                    name: expr.name,
                    expression: parseTypeExpression()
                }, [nameStartIndex, previous]);
            }
            if (token === Token.EQUAL) {
                consume(Token.EQUAL);
                expr = maybeAddRange({
                    type: Syntax.OptionalType,
                    expression: expr
                }, [startIndex, previous]);
                optionalSequence = true;
            } else {
                if (optionalSequence) {
                    utility$1.throwError('unexpected token');
                }
            }
            if (rest) {
                expr = maybeAddRange({
                    type: Syntax.RestType,
                    expression: expr
                }, [restStartIndex, previous]);
            }
            params.push(expr);
            if (token !== Token.RPAREN) {
                expect(Token.COMMA);
            }
        }
        return params;
    }

    // FunctionType := 'function' FunctionSignatureType
    //
    // FunctionSignatureType :=
    //   | TypeParameters '(' ')' ResultType
    //   | TypeParameters '(' ParametersType ')' ResultType
    //   | TypeParameters '(' 'this' ':' TypeName ')' ResultType
    //   | TypeParameters '(' 'this' ':' TypeName ',' ParametersType ')' ResultType
    function parseFunctionType() {
        var isNew, thisBinding, params, result, fnType, startIndex = index - value.length;
        utility$1.assert(token === Token.NAME && value === 'function', 'FunctionType should start with \'function\'');
        consume(Token.NAME);

        // Google Closure Compiler is not implementing TypeParameters.
        // So we do not. if we don't get '(', we see it as error.
        expect(Token.LPAREN);

        isNew = false;
        params = [];
        thisBinding = null;
        if (token !== Token.RPAREN) {
            // ParametersType or 'this'
            if (token === Token.NAME &&
                    (value === 'this' || value === 'new')) {
                // 'this' or 'new'
                // 'new' is Closure Compiler extension
                isNew = value === 'new';
                consume(Token.NAME);
                expect(Token.COLON);
                thisBinding = parseTypeName();
                if (token === Token.COMMA) {
                    consume(Token.COMMA);
                    params = parseParametersType();
                }
            } else {
                params = parseParametersType();
            }
        }

        expect(Token.RPAREN);

        result = null;
        if (token === Token.COLON) {
            result = parseResultType();
        }

        fnType = maybeAddRange({
            type: Syntax.FunctionType,
            params: params,
            result: result
        }, [startIndex, previous]);
        if (thisBinding) {
            // avoid adding null 'new' and 'this' properties
            fnType['this'] = thisBinding;
            if (isNew) {
                fnType['new'] = true;
            }
        }
        return fnType;
    }

    // BasicTypeExpression :=
    //     '*'
    //   | 'null'
    //   | 'undefined'
    //   | TypeName
    //   | FunctionType
    //   | UnionType
    //   | RecordType
    //   | ArrayType
    function parseBasicTypeExpression() {
        var context, startIndex;
        switch (token) {
        case Token.STAR:
            consume(Token.STAR);
            return maybeAddRange({
                type: Syntax.AllLiteral
            }, [previous - 1, previous]);

        case Token.LPAREN:
            return parseUnionType();

        case Token.LBRACK:
            return parseArrayType();

        case Token.LBRACE:
            return parseRecordType();

        case Token.NAME:
            startIndex = index - value.length;

            if (value === 'null') {
                consume(Token.NAME);
                return maybeAddRange({
                    type: Syntax.NullLiteral
                }, [startIndex, previous]);
            }

            if (value === 'undefined') {
                consume(Token.NAME);
                return maybeAddRange({
                    type: Syntax.UndefinedLiteral
                }, [startIndex, previous]);
            }

            if (value === 'true' || value === 'false') {
                consume(Token.NAME);
                return maybeAddRange({
                    type: Syntax.BooleanLiteralType,
                    value: value === 'true'
                }, [startIndex, previous]);
            }

            context = Context.save();
            if (value === 'function') {
                try {
                    return parseFunctionType();
                } catch (e) {
                    context.restore();
                }
            }

            return parseTypeName();

        case Token.STRING:
            next();
            return maybeAddRange({
                type: Syntax.StringLiteralType,
                value: value
            }, [previous - value.length - 2, previous]);

        case Token.NUMBER:
            next();
            return maybeAddRange({
                type: Syntax.NumericLiteralType,
                value: value
            }, [previous - String(value).length, previous]);

        default:
            utility$1.throwError('unexpected token');
        }
    }

    // TypeExpression :=
    //     BasicTypeExpression
    //   | '?' BasicTypeExpression
    //   | '!' BasicTypeExpression
    //   | BasicTypeExpression '?'
    //   | BasicTypeExpression '!'
    //   | '?'
    //   | BasicTypeExpression '[]'
    function parseTypeExpression() {
        var expr, rangeStart;

        if (token === Token.QUESTION) {
            rangeStart = index - 1;
            consume(Token.QUESTION);
            if (token === Token.COMMA || token === Token.EQUAL || token === Token.RBRACE ||
                    token === Token.RPAREN || token === Token.PIPE || token === Token.EOF ||
                    token === Token.RBRACK || token === Token.GT) {
                return maybeAddRange({
                    type: Syntax.NullableLiteral
                }, [rangeStart, previous]);
            }
            return maybeAddRange({
                type: Syntax.NullableType,
                expression: parseBasicTypeExpression(),
                prefix: true
            }, [rangeStart, previous]);
        } else if (token === Token.BANG) {
            rangeStart = index - 1;
            consume(Token.BANG);
            return maybeAddRange({
                type: Syntax.NonNullableType,
                expression: parseBasicTypeExpression(),
                prefix: true
            }, [rangeStart, previous]);
        } else {
            rangeStart = previous;
        }

        expr = parseBasicTypeExpression();
        if (token === Token.BANG) {
            consume(Token.BANG);
            return maybeAddRange({
                type: Syntax.NonNullableType,
                expression: expr,
                prefix: false
            }, [rangeStart, previous]);
        }

        if (token === Token.QUESTION) {
            consume(Token.QUESTION);
            return maybeAddRange({
                type: Syntax.NullableType,
                expression: expr,
                prefix: false
            }, [rangeStart, previous]);
        }

        if (token === Token.LBRACK) {
            consume(Token.LBRACK);
            expect(Token.RBRACK, 'expected an array-style type declaration (' + value + '[])');
            return maybeAddRange({
                type: Syntax.TypeApplication,
                expression: maybeAddRange({
                    type: Syntax.NameExpression,
                    name: 'Array'
                }, [rangeStart, previous]),
                applications: [expr]
            }, [rangeStart, previous]);
        }

        return expr;
    }

    // TopLevelTypeExpression :=
    //      TypeExpression
    //    | TypeUnionList
    //
    // This rule is Google Closure Compiler extension, not ES4
    // like,
    //   { number | string }
    // If strict to ES4, we should write it as
    //   { (number|string) }
    function parseTop() {
        var expr, elements;

        expr = parseTypeExpression();
        if (token !== Token.PIPE) {
            return expr;
        }

        elements = [expr];
        consume(Token.PIPE);
        while (true) {
            elements.push(parseTypeExpression());
            if (token !== Token.PIPE) {
                break;
            }
            consume(Token.PIPE);
        }

        return maybeAddRange({
            type: Syntax.UnionType,
            elements: elements
        }, [0, index]);
    }

    function parseTopParamType() {
        var expr;

        if (token === Token.REST) {
            consume(Token.REST);
            return maybeAddRange({
                type: Syntax.RestType,
                expression: parseTop()
            }, [0, index]);
        }

        expr = parseTop();
        if (token === Token.EQUAL) {
            consume(Token.EQUAL);
            return maybeAddRange({
                type: Syntax.OptionalType,
                expression: expr
            }, [0, index]);
        }

        return expr;
    }

    function parseType(src, opt) {
        var expr;

        source = src;
        length = source.length;
        index = 0;
        previous = 0;
        addRange = opt && opt.range;
        rangeOffset = opt && opt.startIndex || 0;

        next();
        expr = parseTop();

        if (opt && opt.midstream) {
            return {
                expression: expr,
                index: previous
            };
        }

        if (token !== Token.EOF) {
            utility$1.throwError('not reach to EOF');
        }

        return expr;
    }

    function parseParamType(src, opt) {
        var expr;

        source = src;
        length = source.length;
        index = 0;
        previous = 0;
        addRange = opt && opt.range;
        rangeOffset = opt && opt.startIndex || 0;

        next();
        expr = parseTopParamType();

        if (opt && opt.midstream) {
            return {
                expression: expr,
                index: previous
            };
        }

        if (token !== Token.EOF) {
            utility$1.throwError('not reach to EOF');
        }

        return expr;
    }

    function stringifyImpl(node, compact, topLevel) {
        var result, i, iz;

        switch (node.type) {
        case Syntax.NullableLiteral:
            result = '?';
            break;

        case Syntax.AllLiteral:
            result = '*';
            break;

        case Syntax.NullLiteral:
            result = 'null';
            break;

        case Syntax.UndefinedLiteral:
            result = 'undefined';
            break;

        case Syntax.VoidLiteral:
            result = 'void';
            break;

        case Syntax.UnionType:
            if (!topLevel) {
                result = '(';
            } else {
                result = '';
            }

            for (i = 0, iz = node.elements.length; i < iz; ++i) {
                result += stringifyImpl(node.elements[i], compact);
                if ((i + 1) !== iz) {
                    result += compact ? '|' : ' | ';
                }
            }

            if (!topLevel) {
                result += ')';
            }
            break;

        case Syntax.ArrayType:
            result = '[';
            for (i = 0, iz = node.elements.length; i < iz; ++i) {
                result += stringifyImpl(node.elements[i], compact);
                if ((i + 1) !== iz) {
                    result += compact ? ',' : ', ';
                }
            }
            result += ']';
            break;

        case Syntax.RecordType:
            result = '{';
            for (i = 0, iz = node.fields.length; i < iz; ++i) {
                result += stringifyImpl(node.fields[i], compact);
                if ((i + 1) !== iz) {
                    result += compact ? ',' : ', ';
                }
            }
            result += '}';
            break;

        case Syntax.FieldType:
            if (node.value) {
                result = node.key + (compact ? ':' : ': ') + stringifyImpl(node.value, compact);
            } else {
                result = node.key;
            }
            break;

        case Syntax.FunctionType:
            result = compact ? 'function(' : 'function (';

            if (node['this']) {
                if (node['new']) {
                    result += (compact ? 'new:' : 'new: ');
                } else {
                    result += (compact ? 'this:' : 'this: ');
                }

                result += stringifyImpl(node['this'], compact);

                if (node.params.length !== 0) {
                    result += compact ? ',' : ', ';
                }
            }

            for (i = 0, iz = node.params.length; i < iz; ++i) {
                result += stringifyImpl(node.params[i], compact);
                if ((i + 1) !== iz) {
                    result += compact ? ',' : ', ';
                }
            }

            result += ')';

            if (node.result) {
                result += (compact ? ':' : ': ') + stringifyImpl(node.result, compact);
            }
            break;

        case Syntax.ParameterType:
            result = node.name + (compact ? ':' : ': ') + stringifyImpl(node.expression, compact);
            break;

        case Syntax.RestType:
            result = '...';
            if (node.expression) {
                result += stringifyImpl(node.expression, compact);
            }
            break;

        case Syntax.NonNullableType:
            if (node.prefix) {
                result = '!' + stringifyImpl(node.expression, compact);
            } else {
                result = stringifyImpl(node.expression, compact) + '!';
            }
            break;

        case Syntax.OptionalType:
            result = stringifyImpl(node.expression, compact) + '=';
            break;

        case Syntax.NullableType:
            if (node.prefix) {
                result = '?' + stringifyImpl(node.expression, compact);
            } else {
                result = stringifyImpl(node.expression, compact) + '?';
            }
            break;

        case Syntax.NameExpression:
            result = node.name;
            break;

        case Syntax.TypeApplication:
            result = stringifyImpl(node.expression, compact) + '.<';
            for (i = 0, iz = node.applications.length; i < iz; ++i) {
                result += stringifyImpl(node.applications[i], compact);
                if ((i + 1) !== iz) {
                    result += compact ? ',' : ', ';
                }
            }
            result += '>';
            break;

        case Syntax.StringLiteralType:
            result = '"' + node.value + '"';
            break;

        case Syntax.NumericLiteralType:
            result = String(node.value);
            break;

        case Syntax.BooleanLiteralType:
            result = String(node.value);
            break;

        default:
            utility$1.throwError('Unknown type ' + node.type);
        }

        return result;
    }

    function stringify(node, options) {
        if (options == null) {
            options = {};
        }
        return stringifyImpl(node, options.compact, options.topLevel);
    }

    typed.parseType = parseType;
    typed.parseParamType = parseParamType;
    typed.stringify = stringify;
    typed.Syntax = Syntax;
}());

/*
 * @fileoverview Main Doctrine object
 * @author Yusuke Suzuki <utatane.tea@gmail.com>
 * @author Dan Tao <daniel.tao@gmail.com>
 * @author Andrew Eisenberg <andrew@eisenberg.as>
 */

(function (exports) {
(function () {

    var typed$1,
        utility$1,
        jsdoc,
        esutils,
        hasOwnProperty;

    esutils = utils;
    typed$1 = typed;
    utility$1 = utility;

    function sliceSource(source, index, last) {
        return source.slice(index, last);
    }

    hasOwnProperty = (function () {
        var func = Object.prototype.hasOwnProperty;
        return function hasOwnProperty(obj, name) {
            return func.call(obj, name);
        };
    }());

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }

    function isASCIIAlphanumeric(ch) {
        return (ch >= 0x61  /* 'a' */ && ch <= 0x7A  /* 'z' */) ||
            (ch >= 0x41  /* 'A' */ && ch <= 0x5A  /* 'Z' */) ||
            (ch >= 0x30  /* '0' */ && ch <= 0x39  /* '9' */);
    }

    function isParamTitle(title) {
        return title === 'param' || title === 'argument' || title === 'arg';
    }

    function isReturnTitle(title) {
        return title === 'return' || title === 'returns';
    }

    function isProperty(title) {
        return title === 'property' || title === 'prop';
    }

    function isNameParameterRequired(title) {
        return isParamTitle(title) || isProperty(title) ||
            title === 'alias' || title === 'this' || title === 'mixes' || title === 'requires';
    }

    function isAllowedName(title) {
        return isNameParameterRequired(title) || title === 'const' || title === 'constant';
    }

    function isAllowedNested(title) {
        return isProperty(title) || isParamTitle(title);
    }

    function isAllowedOptional(title) {
        return isProperty(title) || isParamTitle(title);
    }

    function isTypeParameterRequired(title) {
        return isParamTitle(title) || isReturnTitle(title) ||
            title === 'define' || title === 'enum' ||
            title === 'implements' || title === 'this' ||
            title === 'type' || title === 'typedef' || isProperty(title);
    }

    // Consider deprecation instead using 'isTypeParameterRequired' and 'Rules' declaration to pick when a type is optional/required
    // This would require changes to 'parseType'
    function isAllowedType(title) {
        return isTypeParameterRequired(title) || title === 'throws' || title === 'const' || title === 'constant' ||
            title === 'namespace' || title === 'member' || title === 'var' || title === 'module' ||
            title === 'constructor' || title === 'class' || title === 'extends' || title === 'augments' ||
            title === 'public' || title === 'private' || title === 'protected';
    }

    // A regex character class that contains all whitespace except linebreak characters (\r, \n, \u2028, \u2029)
    var WHITESPACE = '[ \\f\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]';

    var STAR_MATCHER = '(' + WHITESPACE + '*(?:\\*' + WHITESPACE + '?)?)(.+|[\r\n\u2028\u2029])';

    function unwrapComment(doc) {
        // JSDoc comment is following form
        //   /**
        //    * .......
        //    */

        return doc.
            // remove /**
            replace(/^\/\*\*?/, '').
            // remove */
            replace(/\*\/$/, '').
            // remove ' * ' at the beginning of a line
            replace(new RegExp(STAR_MATCHER, 'g'), '$2').
            // remove trailing whitespace
            replace(/\s*$/, '');
    }

    /**
     * Converts an index in an "unwrapped" JSDoc comment to the corresponding index in the original "wrapped" version
     * @param {string} originalSource The original wrapped comment
     * @param {number} unwrappedIndex The index of a character in the unwrapped string
     * @returns {number} The index of the corresponding character in the original wrapped string
     */
    function convertUnwrappedCommentIndex(originalSource, unwrappedIndex) {
        var replacedSource = originalSource.replace(/^\/\*\*?/, '');
        var numSkippedChars = 0;
        var matcher = new RegExp(STAR_MATCHER, 'g');
        var match;

        while ((match = matcher.exec(replacedSource))) {
            numSkippedChars += match[1].length;

            if (match.index + match[0].length > unwrappedIndex + numSkippedChars) {
                return unwrappedIndex + numSkippedChars + originalSource.length - replacedSource.length;
            }
        }

        return originalSource.replace(/\*\/$/, '').replace(/\s*$/, '').length;
    }

    // JSDoc Tag Parser

    (function (exports) {
        var Rules,
            index,
            lineNumber,
            length,
            source,
            originalSource,
            recoverable,
            sloppy,
            strict;

        function advance() {
            var ch = source.charCodeAt(index);
            index += 1;
            if (esutils.code.isLineTerminator(ch) && !(ch === 0x0D  /* '\r' */ && source.charCodeAt(index) === 0x0A  /* '\n' */)) {
                lineNumber += 1;
            }
            return String.fromCharCode(ch);
        }

        function scanTitle() {
            var title = '';
            // waste '@'
            advance();

            while (index < length && isASCIIAlphanumeric(source.charCodeAt(index))) {
                title += advance();
            }

            return title;
        }

        function seekContent() {
            var ch, waiting, last = index;

            waiting = false;
            while (last < length) {
                ch = source.charCodeAt(last);
                if (esutils.code.isLineTerminator(ch) && !(ch === 0x0D  /* '\r' */ && source.charCodeAt(last + 1) === 0x0A  /* '\n' */)) {
                    waiting = true;
                } else if (waiting) {
                    if (ch === 0x40  /* '@' */) {
                        break;
                    }
                    if (!esutils.code.isWhiteSpace(ch)) {
                        waiting = false;
                    }
                }
                last += 1;
            }
            return last;
        }

        // type expression may have nest brace, such as,
        // { { ok: string } }
        //
        // therefore, scanning type expression with balancing braces.
        function parseType(title, last, addRange) {
            var ch, brace, type, startIndex, direct = false;


            // search '{'
            while (index < last) {
                ch = source.charCodeAt(index);
                if (esutils.code.isWhiteSpace(ch)) {
                    advance();
                } else if (ch === 0x7B  /* '{' */) {
                    advance();
                    break;
                } else {
                    // this is direct pattern
                    direct = true;
                    break;
                }
            }


            if (direct) {
                return null;
            }

            // type expression { is found
            brace = 1;
            type = '';
            while (index < last) {
                ch = source.charCodeAt(index);
                if (esutils.code.isLineTerminator(ch)) {
                    advance();
                } else {
                    if (ch === 0x7D  /* '}' */) {
                        brace -= 1;
                        if (brace === 0) {
                            advance();
                            break;
                        }
                    } else if (ch === 0x7B  /* '{' */) {
                        brace += 1;
                    }
                    if (type === '') {
                        startIndex = index;
                    }
                    type += advance();
                }
            }

            if (brace !== 0) {
                // braces is not balanced
                return utility$1.throwError('Braces are not balanced');
            }

            if (isAllowedOptional(title)) {
                return typed$1.parseParamType(type, {startIndex: convertIndex(startIndex), range: addRange});
            }

            return typed$1.parseType(type, {startIndex: convertIndex(startIndex), range: addRange});
        }

        function scanIdentifier(last) {
            var identifier;
            if (!esutils.code.isIdentifierStartES5(source.charCodeAt(index)) && !source[index].match(/[0-9]/)) {
                return null;
            }
            identifier = advance();
            while (index < last && esutils.code.isIdentifierPartES5(source.charCodeAt(index))) {
                identifier += advance();
            }
            return identifier;
        }

        function skipWhiteSpace(last) {
            while (index < last && (esutils.code.isWhiteSpace(source.charCodeAt(index)) || esutils.code.isLineTerminator(source.charCodeAt(index)))) {
                advance();
            }
        }

        function parseName(last, allowBrackets, allowNestedParams) {
            var name = '',
                useBrackets,
                insideString;


            skipWhiteSpace(last);

            if (index >= last) {
                return null;
            }

            if (source.charCodeAt(index) === 0x5B  /* '[' */) {
                if (allowBrackets) {
                    useBrackets = true;
                    name = advance();
                } else {
                    return null;
                }
            }

            name += scanIdentifier(last);

            if (allowNestedParams) {
                if (source.charCodeAt(index) === 0x3A /* ':' */ && (
                        name === 'module' ||
                        name === 'external' ||
                        name === 'event')) {
                    name += advance();
                    name += scanIdentifier(last);

                }
                if(source.charCodeAt(index) === 0x5B  /* '[' */ && source.charCodeAt(index + 1) === 0x5D  /* ']' */){
                    name += advance();
                    name += advance();
                }
                while (source.charCodeAt(index) === 0x2E  /* '.' */ ||
                        source.charCodeAt(index) === 0x2F  /* '/' */ ||
                        source.charCodeAt(index) === 0x23  /* '#' */ ||
                        source.charCodeAt(index) === 0x2D  /* '-' */ ||
                        source.charCodeAt(index) === 0x7E  /* '~' */) {
                    name += advance();
                    name += scanIdentifier(last);
                }
            }

            if (useBrackets) {
                skipWhiteSpace(last);
                // do we have a default value for this?
                if (source.charCodeAt(index) === 0x3D  /* '=' */) {
                    // consume the '='' symbol
                    name += advance();
                    skipWhiteSpace(last);

                    var ch;
                    var bracketDepth = 1;

                    // scan in the default value
                    while (index < last) {
                        ch = source.charCodeAt(index);

                        if (esutils.code.isWhiteSpace(ch)) {
                            if (!insideString) {
                                skipWhiteSpace(last);
                                ch = source.charCodeAt(index);
                            }
                        }

                        if (ch === 0x27 /* ''' */) {
                            if (!insideString) {
                                insideString = '\'';
                            } else {
                                if (insideString === '\'') {
                                    insideString = '';
                                }
                            }
                        }

                        if (ch === 0x22 /* '"' */) {
                            if (!insideString) {
                                insideString = '"';
                            } else {
                                if (insideString === '"') {
                                    insideString = '';
                                }
                            }
                        }

                        if (ch === 0x5B /* '[' */) {
                            bracketDepth++;
                        } else if (ch === 0x5D  /* ']' */ &&
                            --bracketDepth === 0) {
                            break;
                        }

                        name += advance();
                    }
                }

                skipWhiteSpace(last);

                if (index >= last || source.charCodeAt(index) !== 0x5D  /* ']' */) {
                    // we never found a closing ']'
                    return null;
                }

                // collect the last ']'
                name += advance();
            }

            return name;
        }

        function skipToTag() {
            while (index < length && source.charCodeAt(index) !== 0x40  /* '@' */) {
                advance();
            }
            if (index >= length) {
                return false;
            }
            utility$1.assert(source.charCodeAt(index) === 0x40  /* '@' */);
            return true;
        }

        function convertIndex(rangeIndex) {
            if (source === originalSource) {
                return rangeIndex;
            }
            return convertUnwrappedCommentIndex(originalSource, rangeIndex);
        }

        function TagParser(options, title) {
            this._options = options;
            this._title = title.toLowerCase();
            this._tag = {
                title: title,
                description: null
            };
            if (this._options.lineNumbers) {
                this._tag.lineNumber = lineNumber;
            }
            this._first = index - title.length - 1;
            this._last = 0;
            // space to save special information for title parsers.
            this._extra = { };
        }

        // addError(err, ...)
        TagParser.prototype.addError = function addError(errorText) {
            var args = Array.prototype.slice.call(arguments, 1),
                msg = errorText.replace(
                    /%(\d)/g,
                    function (whole, index) {
                        utility$1.assert(index < args.length, 'Message reference must be in range');
                        return args[index];
                    }
                );

            if (!this._tag.errors) {
                this._tag.errors = [];
            }
            if (strict) {
                utility$1.throwError(msg);
            }
            this._tag.errors.push(msg);
            return recoverable;
        };

        TagParser.prototype.parseType = function () {
            // type required titles
            if (isTypeParameterRequired(this._title)) {
                try {
                    this._tag.type = parseType(this._title, this._last, this._options.range);
                    if (!this._tag.type) {
                        if (!isParamTitle(this._title) && !isReturnTitle(this._title)) {
                            if (!this.addError('Missing or invalid tag type')) {
                                return false;
                            }
                        }
                    }
                } catch (error) {
                    this._tag.type = null;
                    if (!this.addError(error.message)) {
                        return false;
                    }
                }
            } else if (isAllowedType(this._title)) {
                // optional types
                try {
                    this._tag.type = parseType(this._title, this._last, this._options.range);
                } catch (e) {
                    //For optional types, lets drop the thrown error when we hit the end of the file
                }
            }
            return true;
        };

        TagParser.prototype._parseNamePath = function (optional) {
            var name;
            name = parseName(this._last, sloppy && isAllowedOptional(this._title), true);
            if (!name) {
                if (!optional) {
                    if (!this.addError('Missing or invalid tag name')) {
                        return false;
                    }
                }
            }
            this._tag.name = name;
            return true;
        };

        TagParser.prototype.parseNamePath = function () {
            return this._parseNamePath(false);
        };

        TagParser.prototype.parseNamePathOptional = function () {
            return this._parseNamePath(true);
        };


        TagParser.prototype.parseName = function () {
            var assign, name;

            // param, property requires name
            if (isAllowedName(this._title)) {
                this._tag.name = parseName(this._last, sloppy && isAllowedOptional(this._title), isAllowedNested(this._title));
                if (!this._tag.name) {
                    if (!isNameParameterRequired(this._title)) {
                        return true;
                    }

                    // it's possible the name has already been parsed but interpreted as a type
                    // it's also possible this is a sloppy declaration, in which case it will be
                    // fixed at the end
                    if (isParamTitle(this._title) && this._tag.type && this._tag.type.name) {
                        this._extra.name = this._tag.type;
                        this._tag.name = this._tag.type.name;
                        this._tag.type = null;
                    } else {
                        if (!this.addError('Missing or invalid tag name')) {
                            return false;
                        }
                    }
                } else {
                    name = this._tag.name;
                    if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
                        // extract the default value if there is one
                        // example: @param {string} [somebody=John Doe] description
                        assign = name.substring(1, name.length - 1).split('=');
                        if (assign.length > 1) {
                            this._tag['default'] = assign.slice(1).join('=');
                        }
                        this._tag.name = assign[0];

                        // convert to an optional type
                        if (this._tag.type && this._tag.type.type !== 'OptionalType') {
                            this._tag.type = {
                                type: 'OptionalType',
                                expression: this._tag.type
                            };
                        }
                    }
                }
            }


            return true;
        };

        TagParser.prototype.parseDescription = function parseDescription() {
            var description = sliceSource(source, index, this._last).trim();
            if (description) {
                if ((/^-\s+/).test(description)) {
                    description = description.substring(2);
                }
                this._tag.description = description;
            }
            return true;
        };

        TagParser.prototype.parseCaption = function parseDescription() {
            var description = sliceSource(source, index, this._last).trim();
            var captionStartTag = '<caption>';
            var captionEndTag = '</caption>';
            var captionStart = description.indexOf(captionStartTag);
            var captionEnd = description.indexOf(captionEndTag);
            if (captionStart >= 0 && captionEnd >= 0) {
                this._tag.caption = description.substring(
                    captionStart + captionStartTag.length, captionEnd).trim();
                this._tag.description = description.substring(captionEnd + captionEndTag.length).trim();
            } else {
                this._tag.description = description;
            }
            return true;
        };

        TagParser.prototype.parseKind = function parseKind() {
            var kind, kinds;
            kinds = {
                'class': true,
                'constant': true,
                'event': true,
                'external': true,
                'file': true,
                'function': true,
                'member': true,
                'mixin': true,
                'module': true,
                'namespace': true,
                'typedef': true
            };
            kind = sliceSource(source, index, this._last).trim();
            this._tag.kind = kind;
            if (!hasOwnProperty(kinds, kind)) {
                if (!this.addError('Invalid kind name \'%0\'', kind)) {
                    return false;
                }
            }
            return true;
        };

        TagParser.prototype.parseAccess = function parseAccess() {
            var access;
            access = sliceSource(source, index, this._last).trim();
            this._tag.access = access;
            if (access !== 'private' && access !== 'protected' && access !== 'public') {
                if (!this.addError('Invalid access name \'%0\'', access)) {
                    return false;
                }
            }
            return true;
        };

        TagParser.prototype.parseThis = function parseThis() {
            // this name may be a name expression (e.g. {foo.bar}),
            // an union (e.g. {foo.bar|foo.baz}) or a name path (e.g. foo.bar)
            var value = sliceSource(source, index, this._last).trim();
            if (value && value.charAt(0) === '{') {
                var gotType = this.parseType();
                if (gotType && this._tag.type.type === 'NameExpression' || this._tag.type.type === 'UnionType') {
                    this._tag.name = this._tag.type.name;
                    return true;
                } else {
                    return this.addError('Invalid name for this');
                }
            } else {
                return this.parseNamePath();
            }
        };

        TagParser.prototype.parseVariation = function parseVariation() {
            var variation, text;
            text = sliceSource(source, index, this._last).trim();
            variation = parseFloat(text, 10);
            this._tag.variation = variation;
            if (isNaN(variation)) {
                if (!this.addError('Invalid variation \'%0\'', text)) {
                    return false;
                }
            }
            return true;
        };

        TagParser.prototype.ensureEnd = function () {
            var shouldBeEmpty = sliceSource(source, index, this._last).trim();
            if (shouldBeEmpty) {
                if (!this.addError('Unknown content \'%0\'', shouldBeEmpty)) {
                    return false;
                }
            }
            return true;
        };

        TagParser.prototype.epilogue = function epilogue() {
            var description;

            description = this._tag.description;
            // un-fix potentially sloppy declaration
            if (isAllowedOptional(this._title) && !this._tag.type && description && description.charAt(0) === '[') {
                this._tag.type = this._extra.name;
                if (!this._tag.name) {
                    this._tag.name = undefined;
                }

                if (!sloppy) {
                    if (!this.addError('Missing or invalid tag name')) {
                        return false;
                    }
                }
            }

            return true;
        };

        Rules = {
            // http://usejsdoc.org/tags-access.html
            'access': ['parseAccess'],
            // http://usejsdoc.org/tags-alias.html
            'alias': ['parseNamePath', 'ensureEnd'],
            // http://usejsdoc.org/tags-augments.html
            'augments': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-constructor.html
            'constructor': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // Synonym: http://usejsdoc.org/tags-constructor.html
            'class': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // Synonym: http://usejsdoc.org/tags-extends.html
            'extends': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-example.html
            'example': ['parseCaption'],
            // http://usejsdoc.org/tags-deprecated.html
            'deprecated': ['parseDescription'],
            // http://usejsdoc.org/tags-global.html
            'global': ['ensureEnd'],
            // http://usejsdoc.org/tags-inner.html
            'inner': ['ensureEnd'],
            // http://usejsdoc.org/tags-instance.html
            'instance': ['ensureEnd'],
            // http://usejsdoc.org/tags-kind.html
            'kind': ['parseKind'],
            // http://usejsdoc.org/tags-mixes.html
            'mixes': ['parseNamePath', 'ensureEnd'],
            // http://usejsdoc.org/tags-mixin.html
            'mixin': ['parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-member.html
            'member': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-method.html
            'method': ['parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-module.html
            'module': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // Synonym: http://usejsdoc.org/tags-method.html
            'func': ['parseNamePathOptional', 'ensureEnd'],
            // Synonym: http://usejsdoc.org/tags-method.html
            'function': ['parseNamePathOptional', 'ensureEnd'],
            // Synonym: http://usejsdoc.org/tags-member.html
            'var': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-name.html
            'name': ['parseNamePath', 'ensureEnd'],
            // http://usejsdoc.org/tags-namespace.html
            'namespace': ['parseType', 'parseNamePathOptional', 'ensureEnd'],
            // http://usejsdoc.org/tags-private.html
            'private': ['parseType', 'parseDescription'],
            // http://usejsdoc.org/tags-protected.html
            'protected': ['parseType', 'parseDescription'],
            // http://usejsdoc.org/tags-public.html
            'public': ['parseType', 'parseDescription'],
            // http://usejsdoc.org/tags-readonly.html
            'readonly': ['ensureEnd'],
            // http://usejsdoc.org/tags-requires.html
            'requires': ['parseNamePath', 'ensureEnd'],
            // http://usejsdoc.org/tags-since.html
            'since': ['parseDescription'],
            // http://usejsdoc.org/tags-static.html
            'static': ['ensureEnd'],
            // http://usejsdoc.org/tags-summary.html
            'summary': ['parseDescription'],
            // http://usejsdoc.org/tags-this.html
            'this': ['parseThis', 'ensureEnd'],
            // http://usejsdoc.org/tags-todo.html
            'todo': ['parseDescription'],
            // http://usejsdoc.org/tags-typedef.html
            'typedef': ['parseType', 'parseNamePathOptional'],
            // http://usejsdoc.org/tags-variation.html
            'variation': ['parseVariation'],
            // http://usejsdoc.org/tags-version.html
            'version': ['parseDescription']
        };

        TagParser.prototype.parse = function parse() {
            var i, iz, sequences, method;


            // empty title
            if (!this._title) {
                if (!this.addError('Missing or invalid title')) {
                    return null;
                }
            }

            // Seek to content last index.
            this._last = seekContent(this._title);

            if (this._options.range) {
                this._tag.range = [this._first, source.slice(0, this._last).replace(/\s*$/, '').length].map(convertIndex);
            }

            if (hasOwnProperty(Rules, this._title)) {
                sequences = Rules[this._title];
            } else {
                // default sequences
                sequences = ['parseType', 'parseName', 'parseDescription', 'epilogue'];
            }

            for (i = 0, iz = sequences.length; i < iz; ++i) {
                method = sequences[i];
                if (!this[method]()) {
                    return null;
                }
            }

            return this._tag;
        };

        function parseTag(options) {
            var title, parser, tag;

            // skip to tag
            if (!skipToTag()) {
                return null;
            }

            // scan title
            title = scanTitle();

            // construct tag parser
            parser = new TagParser(options, title);
            tag = parser.parse();

            // Seek global index to end of this tag.
            while (index < parser._last) {
                advance();
            }

            return tag;
        }

        //
        // Parse JSDoc
        //

        function scanJSDocDescription(preserveWhitespace) {
            var description = '', ch, atAllowed;

            atAllowed = true;
            while (index < length) {
                ch = source.charCodeAt(index);

                if (atAllowed && ch === 0x40  /* '@' */) {
                    break;
                }

                if (esutils.code.isLineTerminator(ch)) {
                    atAllowed = true;
                } else if (atAllowed && !esutils.code.isWhiteSpace(ch)) {
                    atAllowed = false;
                }

                description += advance();
            }

            return preserveWhitespace ? description : description.trim();
        }

        function parse(comment, options) {
            var tags = [], tag, description, interestingTags, i, iz;

            if (options === undefined) {
                options = {};
            }

            if (typeof options.unwrap === 'boolean' && options.unwrap) {
                source = unwrapComment(comment);
            } else {
                source = comment;
            }

            originalSource = comment;

            // array of relevant tags
            if (options.tags) {
                if (Array.isArray(options.tags)) {
                    interestingTags = { };
                    for (i = 0, iz = options.tags.length; i < iz; i++) {
                        if (typeof options.tags[i] === 'string') {
                            interestingTags[options.tags[i]] = true;
                        } else {
                            utility$1.throwError('Invalid "tags" parameter: ' + options.tags);
                        }
                    }
                } else {
                    utility$1.throwError('Invalid "tags" parameter: ' + options.tags);
                }
            }

            length = source.length;
            index = 0;
            lineNumber = 0;
            recoverable = options.recoverable;
            sloppy = options.sloppy;
            strict = options.strict;

            description = scanJSDocDescription(options.preserveWhitespace);

            while (true) {
                tag = parseTag(options);
                if (!tag) {
                    break;
                }
                if (!interestingTags || interestingTags.hasOwnProperty(tag.title)) {
                    tags.push(tag);
                }
            }

            return {
                description: description,
                tags: tags
            };
        }
        exports.parse = parse;
    }(jsdoc = {}));

    exports.version = utility$1.VERSION;
    exports.parse = jsdoc.parse;
    exports.parseType = typed$1.parseType;
    exports.parseParamType = typed$1.parseParamType;
    exports.unwrapComment = unwrapComment;
    exports.Syntax = shallowCopy(typed$1.Syntax);
    exports.Error = utility$1.DoctrineError;
    exports.type = {
        Syntax: exports.Syntax,
        parseType: typed$1.parseType,
        parseParamType: typed$1.parseParamType,
        stringify: typed$1.stringify
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
}(doctrine));

var GetIntrinsic$G = getIntrinsic;

var $TypeError$r = GetIntrinsic$G('%TypeError%');

// http://262.ecma-international.org/5.1/#sec-9.10

var CheckObjectCoercible = function CheckObjectCoercible(value, optMessage) {
	if (value == null) {
		throw new $TypeError$r(optMessage || ('Cannot call method on ' + value));
	}
	return value;
};

var RequireObjectCoercible$4 = CheckObjectCoercible;

var GetIntrinsic$F = getIntrinsic;

var $abs$1 = GetIntrinsic$F('%Math.abs%');

// http://262.ecma-international.org/5.1/#sec-5.2

var abs$3 = function abs(x) {
	return $abs$1(x);
};

// var modulo = require('./modulo');
var $floor$1 = Math.floor;

// http://262.ecma-international.org/5.1/#sec-5.2

var floor$3 = function floor(x) {
	// return x - modulo(x, 1);
	return $floor$1(x);
};

var isPrimitive$5 = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike$1;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike$1 = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike$1);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$6 = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag$3 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
/* globals document: false */
var documentDotAll = typeof document === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};

var isCallable$2 = reflectApply
	? function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		try {
			reflectApply(value, null, badArrayLike$1);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value);
	}
	: function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag$3) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr$6.call(value);
		return strClass === fnClass || strClass === genClass;
	};

var toStr$5 = Object.prototype.toString;

var isPrimitive$4 = isPrimitive$5;

var isCallable$1 = isCallable$2;

// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8
var ES5internalSlots = {
	'[[DefaultValue]]': function (O) {
		var actualHint;
		if (arguments.length > 1) {
			actualHint = arguments[1];
		} else {
			actualHint = toStr$5.call(O) === '[object Date]' ? String : Number;
		}

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable$1(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive$4(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// http://ecma-international.org/ecma-262/5.1/#sec-9.1
var es5 = function ToPrimitive(input) {
	if (isPrimitive$4(input)) {
		return input;
	}
	if (arguments.length > 1) {
		return ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);
	}
	return ES5internalSlots['[[DefaultValue]]'](input);
};

// http://262.ecma-international.org/5.1/#sec-9.1

var ToPrimitive$4 = es5;

var ToPrimitive$3 = ToPrimitive$4;

// http://262.ecma-international.org/5.1/#sec-9.3

var ToNumber$3 = function ToNumber(value) {
	var prim = ToPrimitive$3(value, Number);
	if (typeof prim !== 'string') {
		return +prim; // eslint-disable-line no-implicit-coercion
	}

	// eslint-disable-next-line no-control-regex
	var trimmed = prim.replace(/^[ \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u0085]+|[ \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u0085]+$/g, '');
	if ((/^0[ob]|^[+-]0x/).test(trimmed)) {
		return NaN;
	}

	return +trimmed; // eslint-disable-line no-implicit-coercion
};

var _isNaN = Number.isNaN || function isNaN(a) {
	return a !== a;
};

var $isNaN$5 = Number.isNaN || function (a) { return a !== a; };

var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN$5(x) && x !== Infinity && x !== -Infinity; };

var sign = function sign(number) {
	return number >= 0 ? 1 : -1;
};

var abs$2 = abs$3;
var floor$2 = floor$3;
var ToNumber$2 = ToNumber$3;

var $isNaN$4 = _isNaN;
var $isFinite$2 = _isFinite;
var $sign = sign;

// http://262.ecma-international.org/5.1/#sec-9.4

var ToInteger$3 = function ToInteger(value) {
	var number = ToNumber$2(value);
	if ($isNaN$4(number)) { return 0; }
	if (number === 0 || !$isFinite$2(number)) { return number; }
	return $sign(number) * floor$2(abs$2(number));
};

var GetIntrinsic$E = getIntrinsic;

var $test = GetIntrinsic$E('RegExp.prototype.test');

var callBind$4 = callBind$7.exports;

var regexTester$1 = function regexTester(regex) {
	return callBind$4($test, regex);
};

var isPrimitive$3 = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr$4 = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag$2 = typeof Symbol === 'function' && !!Symbol.toStringTag;

var isDateObject = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag$2 ? tryDateObject(value) : toStr$4.call(value) === dateClass;
};

var isSymbol$2 = createModule("/$$rollup_base$$/node_modules/is-symbol");

var toStr$3 = Object.prototype.toString;
var hasSymbols$4 = hasSymbols$7();

if (hasSymbols$4) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	isSymbol$2.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr$3.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	isSymbol$2.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false ;
	};
}

var hasSymbols$3 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive$2 = isPrimitive$5;
var isCallable = isCallable$2;
var isDate$1 = isDateObject;
var isSymbol$1 = isSymbol$2.exports;

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive$2(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod$3 = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
	return void 0;
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
var es2015 = function ToPrimitive(input) {
	if (isPrimitive$2(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (arguments[1] === String) {
			hint = 'string';
		} else if (arguments[1] === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols$3) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod$3(input, Symbol.toPrimitive);
		} else if (isSymbol$1(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive$2(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate$1(input) || isSymbol$1(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

var toPrimitive = es2015;

// https://ecma-international.org/ecma-262/6.0/#sec-toprimitive

var ToPrimitive$2 = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};

var GetIntrinsic$D = getIntrinsic;

var $TypeError$q = GetIntrinsic$D('%TypeError%');
var $Number$1 = GetIntrinsic$D('%Number%');
var $RegExp = GetIntrinsic$D('%RegExp%');
var $parseInteger = GetIntrinsic$D('%parseInt%');

var callBound$9 = callBound$b;
var regexTester = regexTester$1;
var isPrimitive$1 = isPrimitive$3;

var $strSlice = callBound$9('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound$9('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive$1 = ToPrimitive$2;

// https://ecma-international.org/ecma-262/6.0/#sec-tonumber

var ToNumber$1 = function ToNumber(argument) {
	var value = isPrimitive$1(argument) ? argument : ToPrimitive$1(argument, $Number$1);
	if (typeof value === 'symbol') {
		throw new $TypeError$q('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number$1(value);
};

var ES5ToInteger = ToInteger$3;

var ToNumber = ToNumber$1;

// https://262.ecma-international.org/11.0/#sec-tointeger

var ToInteger$2 = function ToInteger(value) {
	var number = ToNumber(value);
	if (number !== 0) {
		number = ES5ToInteger(number);
	}
	return number === 0 ? 0 : number;
};

var GetIntrinsic$C = getIntrinsic;

var $Math = GetIntrinsic$C('%Math%');
var $Number = GetIntrinsic$C('%Number%');

var maxSafeInteger = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;

var MAX_SAFE_INTEGER$2 = maxSafeInteger;

var ToInteger$1 = ToInteger$2;

var ToLength$3 = function ToLength(argument) {
	var len = ToInteger$1(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER$2) { return MAX_SAFE_INTEGER$2; }
	return len;
};

var GetIntrinsic$B = getIntrinsic;

var $Object$1 = GetIntrinsic$B('%Object%');

var RequireObjectCoercible$3 = RequireObjectCoercible$4;

// https://ecma-international.org/ecma-262/6.0/#sec-toobject

var ToObject$3 = function ToObject(value) {
	RequireObjectCoercible$3(value);
	return $Object$1(value);
};

var $isNaN$3 = _isNaN;

// https://ecma-international.org/ecma-262/6.0/#sec-samevaluezero

var SameValueZero$1 = function SameValueZero(x, y) {
	return (x === y) || ($isNaN$3(x) && $isNaN$3(y));
};

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$2 = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag$1 = typeof Symbol === 'function' && !!Symbol.toStringTag;

var isString$2 = function isString(value) {
	if (typeof value === 'string') {
		return true;
	}
	if (typeof value !== 'object') {
		return false;
	}
	return hasToStringTag$1 ? tryStringObject(value) : toStr$2.call(value) === strClass;
};

var ToInteger = ToInteger$2;
var ToLength$2 = ToLength$3;
var ToObject$2 = ToObject$3;
var SameValueZero = SameValueZero$1;
var $isNaN$2 = _isNaN;
var $isFinite$1 = _isFinite;
var GetIntrinsic$A = getIntrinsic;
var callBound$8 = callBound$b;
var isString$1 = isString$2;

var $charAt$1 = callBound$8('String.prototype.charAt');
var $indexOf = GetIntrinsic$A('%Array.prototype.indexOf%'); // TODO: use callBind.apply without breaking IE 8

var implementation$b = function includes(searchElement) {
	var fromIndex = arguments.length > 1 ? ToInteger(arguments[1]) : 0;
	if ($indexOf && !$isNaN$2(searchElement) && $isFinite$1(fromIndex) && typeof searchElement !== 'undefined') {
		return $indexOf.apply(this, arguments) > -1;
	}

	var O = ToObject$2(this);
	var length = ToLength$2(O.length);
	if (length === 0) {
		return false;
	}
	var k = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
	while (k < length) {
		if (SameValueZero(searchElement, isString$1(O) ? $charAt$1(O, k) : O[k])) {
			return true;
		}
		k += 1;
	}
	return false;
};

var implementation$a = implementation$b;

var polyfill$7 = function getPolyfill() {
	return Array.prototype.includes || implementation$a;
};

var define$7 = defineProperties_1;
var getPolyfill$7 = polyfill$7;

var shim$7 = function shimArrayPrototypeIncludes() {
	var polyfill = getPolyfill$7();
	define$7(
		Array.prototype,
		{ includes: polyfill },
		{ includes: function () { return Array.prototype.includes !== polyfill; } }
	);
	return polyfill;
};

var define$6 = defineProperties_1;
var RequireObjectCoercible$2 = RequireObjectCoercible$4;
var callBind$3 = callBind$7.exports;
var callBound$7 = callBound$b;

var implementation$9 = implementation$b;
var getPolyfill$6 = polyfill$7;
var polyfill$6 = callBind$3.apply(getPolyfill$6());
var shim$6 = shim$7;

var $slice = callBound$7('Array.prototype.slice');

/* eslint-disable no-unused-vars */
var boundShim = function includes(array, searchElement) {
/* eslint-enable no-unused-vars */
	RequireObjectCoercible$2(array);
	return polyfill$6(array, $slice(arguments, 1));
};
define$6(boundShim, {
	getPolyfill: getPolyfill$6,
	implementation: implementation$9,
	shim: shim$6
});

var arrayIncludes = boundShim;

var has$9 = src;
var RequireObjectCoercible$1 = RequireObjectCoercible$4;
var callBound$6 = callBound$b;

var $isEnumerable$2 = callBound$6('Object.prototype.propertyIsEnumerable');

var implementation$8 = function values(O) {
	var obj = RequireObjectCoercible$1(O);
	var vals = [];
	for (var key in obj) {
		if (has$9(obj, key) && $isEnumerable$2(obj, key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};

var implementation$7 = implementation$8;

var polyfill$5 = function getPolyfill() {
	return typeof Object.values === 'function' ? Object.values : implementation$7;
};

var getPolyfill$5 = polyfill$5;
var define$5 = defineProperties_1;

var shim$5 = function shimValues() {
	var polyfill = getPolyfill$5();
	define$5(Object, { values: polyfill }, {
		values: function testValues() {
			return Object.values !== polyfill;
		}
	});
	return polyfill;
};

var define$4 = defineProperties_1;
var callBind$2 = callBind$7.exports;

var implementation$6 = implementation$8;
var getPolyfill$4 = polyfill$5;
var shim$4 = shim$5;

var polyfill$4 = callBind$2(getPolyfill$4(), Object);

define$4(polyfill$4, {
	getPolyfill: getPolyfill$4,
	implementation: implementation$6,
	shim: shim$4
});

var object_values = polyfill$4;

/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */

/**
 * Find and return a particular variable in a list
 * @param {Array} variables The variables list.
 * @param {string} name The name of the variable to search.
 * @returns {Object} Variable if the variable was found, null if not.
 */
function getVariable(variables, name) {
  return variables.find((variable) => variable.name === name);
}

/**
 * List all variable in a given scope
 *
 * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
 *
 * @param {Object} context The current rule context.
 * @returns {Array} The variables list
 */
function variablesInScope(context) {
  let scope = context.getScope();
  let variables = scope.variables;

  while (scope.type !== 'global') {
    scope = scope.upper;
    variables = scope.variables.concat(variables);
  }
  if (scope.childScopes.length) {
    variables = scope.childScopes[0].variables.concat(variables);
    if (scope.childScopes[0].childScopes.length) {
      variables = scope.childScopes[0].childScopes[0].variables.concat(variables);
    }
  }
  variables.reverse();

  return variables;
}

/**
 * Find a variable by name in the current scope.
 * @param {Object} context The current rule context.
 * @param  {string} name Name of the variable to look for.
 * @returns {ASTNode|null} Return null if the variable could not be found, ASTNode otherwise.
 */
function findVariableByName(context, name) {
  const variable = getVariable(variablesInScope(context), name);

  if (!variable || !variable.defs[0] || !variable.defs[0].node) {
    return null;
  }

  if (variable.defs[0].node.type === 'TypeAlias') {
    return variable.defs[0].node.right;
  }

  return variable.defs[0].node.init;
}

/**
 * Returns the latest definition of the variable.
 * @param {Object} variable
 * @returns {Object | undefined} The latest variable definition or undefined.
 */
function getLatestVariableDefinition(variable) {
  return variable.defs[variable.defs.length - 1];
}

/**
 * @fileoverview Utility functions for React pragma configuration
 * @author Yannick Croissant
 */

const JSX_ANNOTATION_REGEX = /@jsx\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
const JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

function getCreateClassFromContext(context) {
  let pragma = 'createReactClass';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.createClass) {
    pragma = context.settings.react.createClass;
  }
  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`createClass pragma ${pragma} is not a valid function name`);
  }
  return pragma;
}

function getFromContext(context) {
  let pragma = 'React';

  const sourceCode = context.getSourceCode();
  const pragmaNode = sourceCode.getAllComments().find((node) => JSX_ANNOTATION_REGEX.test(node.value));

  if (pragmaNode) {
    const matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
    pragma = matches[1].split('.')[0];
    // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.react && context.settings.react.pragma) {
    pragma = context.settings.react.pragma;
  }

  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`React pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

/**
 * @fileoverview Utility functions for AST
 */

/**
 * Find a return statment in the current node
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {ASTNode | false}
 */
function findReturnStatement(node) {
  if (
    (!node.value || !node.value.body || !node.value.body.body)
    && (!node.body || !node.body.body)
  ) {
    return false;
  }

  const bodyNodes = (node.value ? node.value.body.body : node.body.body);

  return (function loopNodes(nodes) {
    let i = nodes.length - 1;
    for (; i >= 0; i--) {
      if (nodes[i].type === 'ReturnStatement') {
        return nodes[i];
      }
      if (nodes[i].type === 'SwitchStatement') {
        let j = nodes[i].cases.length - 1;
        for (; j >= 0; j--) {
          return loopNodes(nodes[i].cases[j].consequent);
        }
      }
    }
    return false;
  }(bodyNodes));
}

/**
 * Get node with property's name
 * @param {Object} node - Property.
 * @returns {Object} Property name node.
 */
function getPropertyNameNode(node) {
  if (node.key || ['MethodDefinition', 'Property'].indexOf(node.type) !== -1) {
    return node.key;
  }
  if (node.type === 'MemberExpression') {
    return node.property;
  }
  return null;
}

/**
 * Get properties name
 * @param {Object} node - Property.
 * @returns {String} Property name.
 */
function getPropertyName$1(node) {
  const nameNode = getPropertyNameNode(node);
  return nameNode ? nameNode.name : '';
}

/**
 * Checks if the node is a function or arrow function expression.
 * @param {ASTNode} node The node to check
 * @return {Boolean} true if it's a function-like expression
 */
function isFunctionLikeExpression(node) {
  return node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
}

/**
 * Checks if the node is a function.
 * @param {ASTNode} node The node to check
 * @return {Boolean} true if it's a function
 */
function isFunction(node) {
  return node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
}

/**
 * Removes quotes from around an identifier.
 * @param {string} string the identifier to strip
 * @returns {string}
 */
function stripQuotes(string) {
  return string.replace(/^'|'$/g, '');
}

/**
 * Retrieve the name of a key node
 * @param {Context} context The AST node with the key.
 * @param {ASTNode} node The AST node with the key.
 * @return {string | undefined} the name of the key
 */
function getKeyValue(context, node) {
  if (node.type === 'ObjectTypeProperty') {
    const tokens = context.getFirstTokens(node, 2);
    return (tokens[0].value === '+' || tokens[0].value === '-'
      ? tokens[1].value
      : stripQuotes(tokens[0].value)
    );
  }
  if (node.type === 'GenericTypeAnnotation') {
    return node.id.name;
  }
  if (node.type === 'ObjectTypeAnnotation') {
    return;
  }
  const key = node.key || node.argument;
  if (!key) {
    return;
  }
  return key.type === 'Identifier' ? key.name : key.value;
}

/**
 * Checks if a node is being assigned a value: props.bar = 'bar'
 * @param {ASTNode} node The AST node being checked.
 * @returns {Boolean}
 */
function isAssignmentLHS(node) {
  return (
    node.parent
    && node.parent.type === 'AssignmentExpression'
    && node.parent.left === node
  );
}

/**
 * Extracts the expression node that is wrapped inside a TS type assertion
 *
 * @param {ASTNode} node - potential TS node
 * @returns {ASTNode} - unwrapped expression node
 */
function unwrapTSAsExpression(node) {
  if (node && node.type === 'TSAsExpression') return node.expression;
  return node;
}

function isTSTypeReference(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeReference';
}

function isTSTypeAnnotation(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeAnnotation';
}

function isTSTypeLiteral(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeLiteral';
}

function isTSIntersectionType(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSIntersectionType';
}

function isTSInterfaceHeritage(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSInterfaceHeritage';
}

function isTSInterfaceDeclaration(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSInterfaceDeclaration';
}

function isTSTypeAliasDeclaration(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeAliasDeclaration';
}

function isTSParenthesizedType(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeAliasDeclaration';
}

function isTSFunctionType(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSFunctionType';
}

function isTSTypeQuery(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeQuery';
}

function isTSTypeParameterInstantiation(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'TSTypeParameterInstantiation';
}

var util_inspect = require$$0__default['default'].inspect;

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

var inspectCustom = util_inspect.custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;
var toStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag !== 'undefined' ? Symbol.toStringTag : null;

var objectInspect = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has$8(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has$8(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has$8(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has$8(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has$8(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? String(obj).replace(/^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? toStr$1(obj).slice(8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + [].concat(stringTag || [], protoTag || []).join(': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr$1(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr$1(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr$1(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr$1(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr$1(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr$1(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr$1(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has$8(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr$1(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has$8(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has$8(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

// https://ecma-international.org/ecma-262/6.0/#sec-ispropertykey

var IsPropertyKey$9 = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

// https://262.ecma-international.org/5.1/#sec-8

var Type$l = function Type(x) {
	if (x === null) {
		return 'Null';
	}
	if (typeof x === 'undefined') {
		return 'Undefined';
	}
	if (typeof x === 'function' || typeof x === 'object') {
		return 'Object';
	}
	if (typeof x === 'number') {
		return 'Number';
	}
	if (typeof x === 'boolean') {
		return 'Boolean';
	}
	if (typeof x === 'string') {
		return 'String';
	}
};

var ES5Type = Type$l;

// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

var Type$k = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	if (typeof x === 'bigint') {
		return 'BigInt';
	}
	return ES5Type(x);
};

var GetIntrinsic$z = getIntrinsic;

var $TypeError$p = GetIntrinsic$z('%TypeError%');

var inspect$2 = objectInspect;

var IsPropertyKey$8 = IsPropertyKey$9;
var Type$j = Type$k;

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

var Get$7 = function Get(O, P) {
	// 7.3.1.1
	if (Type$j(O) !== 'Object') {
		throw new $TypeError$p('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey$8(P)) {
		throw new $TypeError$p('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect$2(P));
	}
	// 7.3.1.3
	return O[P];
};

var GetIntrinsic$y = getIntrinsic;

var $Array$1 = GetIntrinsic$y('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array$1.isArray && callBound$b('Object.prototype.toString');

// https://ecma-international.org/ecma-262/6.0/#sec-isarray

var IsArray$6 = $Array$1.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};

var IsConstructor$1 = createModule("/$$rollup_base$$/node_modules/es-abstract/2020");

// TODO: remove, semver-major

var GetIntrinsic$x = getIntrinsic;

var GetIntrinsic$w = getIntrinsic;

var has$7 = src;
var $TypeError$o = GetIntrinsic$w('%TypeError%');

var isPropertyDescriptor$1 = function IsPropertyDescriptor(ES, Desc) {
	if (ES.Type(Desc) !== 'Object') {
		return false;
	}
	var allowed = {
		'[[Configurable]]': true,
		'[[Enumerable]]': true,
		'[[Get]]': true,
		'[[Set]]': true,
		'[[Value]]': true,
		'[[Writable]]': true
	};

	for (var key in Desc) { // eslint-disable-line no-restricted-syntax
		if (has$7(Desc, key) && !allowed[key]) {
			return false;
		}
	}

	if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
		throw new $TypeError$o('Property Descriptors may not be both accessor and data descriptors');
	}
	return true;
};

var GetIntrinsic$v = getIntrinsic;

var $defineProperty = GetIntrinsic$v('%Object.defineProperty%', true);

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

var callBound$5 = callBound$b;

var $isEnumerable$1 = callBound$5('Object.prototype.propertyIsEnumerable');

// eslint-disable-next-line max-params
var DefineOwnProperty$2 = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
	if (!$defineProperty) {
		if (!IsDataDescriptor(desc)) {
			// ES3 does not support getters/setters
			return false;
		}
		if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
			return false;
		}

		// fallback for ES3
		if (P in O && $isEnumerable$1(O, P) !== !!desc['[[Enumerable]]']) {
			// a non-enumerable existing property
			return false;
		}

		// property does not exist at all, or exists but is enumerable
		var V = desc['[[Value]]'];
		// eslint-disable-next-line no-param-reassign
		O[P] = V; // will use [[Define]]
		return SameValue(O[P], V);
	}
	$defineProperty(O, P, FromPropertyDescriptor(desc));
	return true;
};

var GetIntrinsic$u = getIntrinsic;

var $TypeError$n = GetIntrinsic$u('%TypeError%');
var $SyntaxError = GetIntrinsic$u('%SyntaxError%');

var has$6 = src;

var predicates = {
	// https://262.ecma-international.org/6.0/#sec-property-descriptor-specification-type
	'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
		if (Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (has$6(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = has$6(Desc, '[[Value]]');
		var IsAccessor = has$6(Desc, '[[Get]]') || has$6(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError$n('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	}
};

var assertRecord$3 = function assertRecord(Type, recordType, argumentName, value) {
	var predicate = predicates[recordType];
	if (typeof predicate !== 'function') {
		throw new $SyntaxError('unknown record type: ' + recordType);
	}
	if (!predicate(Type, value)) {
		throw new $TypeError$n(argumentName + ' must be a ' + recordType);
	}
};

var assertRecord$2 = assertRecord$3;

var Type$i = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

var FromPropertyDescriptor$2 = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord$2(Type$i, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

var has$5 = src;

var assertRecord$1 = assertRecord$3;

var Type$h = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

var IsAccessorDescriptor$1 = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord$1(Type$h, 'Property Descriptor', 'Desc', Desc);

	if (!has$5(Desc, '[[Get]]') && !has$5(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};

var has$4 = src;

var assertRecord = assertRecord$3;

var Type$g = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

var IsDataDescriptor$2 = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type$g, 'Property Descriptor', 'Desc', Desc);

	if (!has$4(Desc, '[[Value]]') && !has$4(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

var $isNaN$1 = _isNaN;

// http://262.ecma-international.org/5.1/#sec-9.12

var SameValue$2 = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN$1(x) && $isNaN$1(y);
};

// http://262.ecma-international.org/5.1/#sec-9.2

var ToBoolean$3 = function ToBoolean(value) { return !!value; };

// http://262.ecma-international.org/5.1/#sec-9.11

var IsCallable$5 = isCallable$2;

var has$3 = src;

var GetIntrinsic$t = getIntrinsic;

var $TypeError$m = GetIntrinsic$t('%TypeError%');

var Type$f = Type$k;
var ToBoolean$2 = ToBoolean$3;
var IsCallable$4 = IsCallable$5;

// https://262.ecma-international.org/5.1/#sec-8.10.5

var ToPropertyDescriptor$2 = function ToPropertyDescriptor(Obj) {
	if (Type$f(Obj) !== 'Object') {
		throw new $TypeError$m('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has$3(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean$2(Obj.enumerable);
	}
	if (has$3(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean$2(Obj.configurable);
	}
	if (has$3(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has$3(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean$2(Obj.writable);
	}
	if (has$3(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable$4(getter)) {
			throw new $TypeError$m('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has$3(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable$4(setter)) {
			throw new $TypeError$m('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has$3(desc, '[[Get]]') || has$3(desc, '[[Set]]')) && (has$3(desc, '[[Value]]') || has$3(desc, '[[Writable]]'))) {
		throw new $TypeError$m('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

var GetIntrinsic$s = getIntrinsic;

var $TypeError$l = GetIntrinsic$s('%TypeError%');

var isPropertyDescriptor = isPropertyDescriptor$1;
var DefineOwnProperty$1 = DefineOwnProperty$2;

var FromPropertyDescriptor$1 = FromPropertyDescriptor$2;
var IsAccessorDescriptor = IsAccessorDescriptor$1;
var IsDataDescriptor$1 = IsDataDescriptor$2;
var IsPropertyKey$7 = IsPropertyKey$9;
var SameValue$1 = SameValue$2;
var ToPropertyDescriptor$1 = ToPropertyDescriptor$2;
var Type$e = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

var DefinePropertyOrThrow$1 = function DefinePropertyOrThrow(O, P, desc) {
	if (Type$e(O) !== 'Object') {
		throw new $TypeError$l('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey$7(P)) {
		throw new $TypeError$l('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type$e,
		IsDataDescriptor: IsDataDescriptor$1,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor$1(desc);
	if (!isPropertyDescriptor({
		Type: Type$e,
		IsDataDescriptor: IsDataDescriptor$1,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError$l('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty$1(
		IsDataDescriptor$1,
		SameValue$1,
		FromPropertyDescriptor$1,
		O,
		P,
		Desc
	);
};

var GetIntrinsic$r = GetIntrinsic$x;

var $construct = GetIntrinsic$r('%Reflect.construct%', true);

var DefinePropertyOrThrow = DefinePropertyOrThrow$1;
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	IsConstructor$1.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	IsConstructor$1.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}

var GetIntrinsic$q = getIntrinsic;

var $abs = GetIntrinsic$q('%Math.abs%');

// http://262.ecma-international.org/5.1/#sec-5.2

var abs$1 = function abs(x) {
	return $abs(x);
};

// var modulo = require('./modulo');
var $floor = Math.floor;

// http://262.ecma-international.org/5.1/#sec-5.2

var floor$1 = function floor(x) {
	// return x - modulo(x, 1);
	return $floor(x);
};

var abs = abs$1;
var floor = floor$1;

var $isNaN = _isNaN;
var $isFinite = _isFinite;

// https://ecma-international.org/ecma-262/6.0/#sec-isinteger

var IsInteger$2 = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var absValue = abs(argument);
	return floor(absValue) === absValue;
};

var GetIntrinsic$p = getIntrinsic;

var $Array = GetIntrinsic$p('%Array%');
var $species = GetIntrinsic$p('%Symbol.species%', true);
var $TypeError$k = GetIntrinsic$p('%TypeError%');

var Get$6 = Get$7;
var IsArray$5 = IsArray$6;
var IsConstructor = IsConstructor$1.exports;
var IsInteger$1 = IsInteger$2;
var Type$d = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

var ArraySpeciesCreate$1 = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger$1(length) || length < 0) {
		throw new $TypeError$k('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray$5(originalArray);
	if (isArray) {
		C = Get$6(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type$d(C) === 'Object') {
			C = Get$6(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError$k('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};

var GetIntrinsic$o = getIntrinsic;
var callBound$4 = callBound$b;

var $TypeError$j = GetIntrinsic$o('%TypeError%');

var IsArray$4 = IsArray$6;

var $apply = GetIntrinsic$o('%Reflect.apply%', true) || callBound$4('%Function.prototype.apply%');

// https://ecma-international.org/ecma-262/6.0/#sec-call

var Call$5 = function Call(F, V) {
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	if (!IsArray$4(argumentsList)) {
		throw new $TypeError$j('Assertion failed: optional `argumentsList`, if provided, must be a List');
	}
	return $apply(F, V, argumentsList);
};

var GetIntrinsic$n = getIntrinsic;

var $gOPD$1 = GetIntrinsic$n('%Object.getOwnPropertyDescriptor%');
if ($gOPD$1) {
	try {
		$gOPD$1([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD$1 = null;
	}
}

var getOwnPropertyDescriptor = $gOPD$1;

var callBound$3 = callBound$b;
var hasSymbols$2 = shams();
var hasToStringTag = hasSymbols$2 && !!Symbol.toStringTag;
var has$2;
var $exec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag) {
	has$2 = callBound$3('Object.prototype.hasOwnProperty');
	$exec = callBound$3('RegExp.prototype.exec');
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = {
		toString: throwRegexMarker,
		valueOf: throwRegexMarker
	};

	if (typeof Symbol.toPrimitive === 'symbol') {
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
	}
}

var $toString = callBound$3('Object.prototype.toString');
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

var isRegex = hasToStringTag
	// eslint-disable-next-line consistent-return
	? function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && has$2(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		try {
			$exec(value, badStringifier);
		} catch (e) {
			return e === isRegexMarker;
		}
	}
	: function isRegex(value) {
		// In older browsers, typeof regex incorrectly returns 'function'
		if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
			return false;
		}

		return $toString(value) === regexClass;
	};

var GetIntrinsic$m = getIntrinsic;

var $match = GetIntrinsic$m('%Symbol.match%', true);

var hasRegExpMatcher = isRegex;

var ToBoolean$1 = ToBoolean$3;

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

var IsRegExp$1 = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean$1(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};

var GetIntrinsic$l = getIntrinsic;

var $gOPD = getOwnPropertyDescriptor;
var $TypeError$i = GetIntrinsic$l('%TypeError%');

var callBound$2 = callBound$b;

var $isEnumerable = callBound$2('Object.prototype.propertyIsEnumerable');

var has$1 = src;

var IsArray$3 = IsArray$6;
var IsPropertyKey$6 = IsPropertyKey$9;
var IsRegExp = IsRegExp$1;
var ToPropertyDescriptor = ToPropertyDescriptor$2;
var Type$c = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

var OrdinaryGetOwnProperty$1 = function OrdinaryGetOwnProperty(O, P) {
	if (Type$c(O) !== 'Object') {
		throw new $TypeError$i('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey$6(P)) {
		throw new $TypeError$i('Assertion failed: P must be a Property Key');
	}
	if (!has$1(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray$3(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};

var GetIntrinsic$k = getIntrinsic;

var $Object = GetIntrinsic$k('%Object%');

var isPrimitive = isPrimitive$3;

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://ecma-international.org/ecma-262/6.0/#sec-isextensible-o

var IsExtensible$1 = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};

var GetIntrinsic$j = getIntrinsic;

var $TypeError$h = GetIntrinsic$j('%TypeError%');

var DefineOwnProperty = DefineOwnProperty$2;

var FromPropertyDescriptor = FromPropertyDescriptor$2;
var OrdinaryGetOwnProperty = OrdinaryGetOwnProperty$1;
var IsDataDescriptor = IsDataDescriptor$2;
var IsExtensible = IsExtensible$1;
var IsPropertyKey$5 = IsPropertyKey$9;
var SameValue = SameValue$2;
var Type$b = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-createdataproperty

var CreateDataProperty$1 = function CreateDataProperty(O, P, V) {
	if (Type$b(O) !== 'Object') {
		throw new $TypeError$h('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey$5(P)) {
		throw new $TypeError$h('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

var GetIntrinsic$i = getIntrinsic;

var $TypeError$g = GetIntrinsic$i('%TypeError%');

var CreateDataProperty = CreateDataProperty$1;
var IsPropertyKey$4 = IsPropertyKey$9;
var Type$a = Type$k;

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

var CreateDataPropertyOrThrow$2 = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type$a(O) !== 'Object') {
		throw new $TypeError$g('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey$4(P)) {
		throw new $TypeError$g('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError$g('unable to create data property');
	}
	return success;
};

var GetIntrinsic$h = getIntrinsic;

var $TypeError$f = GetIntrinsic$h('%TypeError%');

var IsPropertyKey$3 = IsPropertyKey$9;
var Type$9 = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

var HasProperty$1 = function HasProperty(O, P) {
	if (Type$9(O) !== 'Object') {
		throw new $TypeError$f('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey$3(P)) {
		throw new $TypeError$f('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};

var GetIntrinsic$g = getIntrinsic;

var $TypeError$e = GetIntrinsic$g('%TypeError%');

var Get$5 = Get$7;
var ToLength$1 = ToLength$3;
var Type$8 = Type$k;

// https://262.ecma-international.org/11.0/#sec-lengthofarraylike

var LengthOfArrayLike$1 = function LengthOfArrayLike(obj) {
	if (Type$8(obj) !== 'Object') {
		throw new $TypeError$e('Assertion failed: `obj` must be an Object');
	}
	return ToLength$1(Get$5(obj, 'length'));
};

var GetIntrinsic$f = getIntrinsic;

var $String$1 = GetIntrinsic$f('%String%');
var $TypeError$d = GetIntrinsic$f('%TypeError%');

// https://ecma-international.org/ecma-262/6.0/#sec-tostring

var ToString$2 = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError$d('Cannot convert a Symbol value to a string');
	}
	return $String$1(argument);
};

var GetIntrinsic$e = getIntrinsic;

var $TypeError$c = GetIntrinsic$e('%TypeError%');

var MAX_SAFE_INTEGER$1 = maxSafeInteger;

var Call$4 = Call$5;
var CreateDataPropertyOrThrow$1 = CreateDataPropertyOrThrow$2;
var Get$4 = Get$7;
var HasProperty = HasProperty$1;
var IsArray$2 = IsArray$6;
var LengthOfArrayLike = LengthOfArrayLike$1;
var ToString$1 = ToString$2;

// https://262.ecma-international.org/11.0/#sec-flattenintoarray

// eslint-disable-next-line max-params
var FlattenIntoArray$1 = function FlattenIntoArray(target, source, sourceLen, start, depth) {
	var mapperFunction;
	if (arguments.length > 5) {
		mapperFunction = arguments[5];
	}

	var targetIndex = start;
	var sourceIndex = 0;
	while (sourceIndex < sourceLen) {
		var P = ToString$1(sourceIndex);
		var exists = HasProperty(source, P);
		if (exists === true) {
			var element = Get$4(source, P);
			if (typeof mapperFunction !== 'undefined') {
				if (arguments.length <= 6) {
					throw new $TypeError$c('Assertion failed: thisArg is required when mapperFunction is provided');
				}
				element = Call$4(mapperFunction, arguments[6], [element, sourceIndex, source]);
			}
			var shouldFlatten = false;
			if (depth > 0) {
				shouldFlatten = IsArray$2(element);
			}
			if (shouldFlatten) {
				var elementLen = LengthOfArrayLike(element);
				targetIndex = FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
			} else {
				if (targetIndex >= MAX_SAFE_INTEGER$1) {
					throw new $TypeError$c('index too large');
				}
				CreateDataPropertyOrThrow$1(target, ToString$1(targetIndex), element);
				targetIndex += 1;
			}
		}
		sourceIndex += 1;
	}

	return targetIndex;
};

var ArraySpeciesCreate = ArraySpeciesCreate$1;
var FlattenIntoArray = FlattenIntoArray$1;
var Get$3 = Get$7;
var IsCallable$3 = IsCallable$5;
var ToLength = ToLength$3;
var ToObject$1 = ToObject$3;

var implementation$5 = function flatMap(mapperFunction) {
	var O = ToObject$1(this);
	var sourceLen = ToLength(Get$3(O, 'length'));

	if (!IsCallable$3(mapperFunction)) {
		throw new TypeError('mapperFunction must be a function');
	}

	var T;
	if (arguments.length > 1) {
		T = arguments[1];
	}

	var A = ArraySpeciesCreate(O, 0);
	FlattenIntoArray(A, O, sourceLen, 0, 1, mapperFunction, T);
	return A;
};

var implementation$4 = implementation$5;

var polyfill$3 = function getPolyfill() {
	return Array.prototype.flatMap || implementation$4;
};

var define$3 = defineProperties_1;
var getPolyfill$3 = polyfill$3;

var shim$3 = function shimFlatMap() {
	var polyfill = getPolyfill$3();
	define$3(
		Array.prototype,
		{ flatMap: polyfill },
		{ flatMap: function () { return Array.prototype.flatMap !== polyfill; } }
	);
	return polyfill;
};

var define$2 = defineProperties_1;
var callBind$1 = callBind$7.exports;

var implementation$3 = implementation$5;
var getPolyfill$2 = polyfill$3;
var polyfill$2 = getPolyfill$2();
var shim$2 = shim$3;

var boundFlatMap = callBind$1(polyfill$2);

define$2(boundFlatMap, {
	getPolyfill: getPolyfill$2,
	implementation: implementation$3,
	shim: shim$2
});

var array_prototype_flatmap = boundFlatMap;

/**
 * @fileoverview Utility functions for type annotation detection.
 * @author Yannick Croissant
 * @author Vitor Balocco
 */

/**
 * Checks if we are declaring a `props` argument with a flow type annotation.
 * @param {ASTNode} node The AST node being checked.
 * @param {Object} context
 * @returns {Boolean} True if the node is a type annotated props declaration, false if not.
 */
function isAnnotatedFunctionPropsDeclaration(node, context) {
  if (!node || !node.params || !node.params.length) {
    return false;
  }

  const typeNode = node.params[0].type === 'AssignmentPattern' ? node.params[0].left : node.params[0];

  const tokens = context.getFirstTokens(typeNode, 2);
  const isAnnotated = typeNode.typeAnnotation;
  const isDestructuredProps = typeNode.type === 'ObjectPattern';
  const isProps = tokens[0].value === 'props' || (tokens[1] && tokens[1].value === 'props');

  return (isAnnotated && (isDestructuredProps || isProps));
}

/**
 * @fileoverview Utility functions for props
 */

/**
 * Checks if the Identifier node passed in looks like a propTypes declaration.
 * @param {ASTNode} node The node to check. Must be an Identifier node.
 * @returns {Boolean} `true` if the node is a propTypes declaration, `false` if not
 */
function isPropTypesDeclaration(node) {
  if (node && node.type === 'ClassProperty') {
    // Flow support
    if (node.typeAnnotation && node.key.name === 'props') {
      return true;
    }
  }
  return getPropertyName$1(node) === 'propTypes';
}

/**
 * Checks if the Identifier node passed in looks like a defaultProps declaration.
 * @param {ASTNode} node The node to check. Must be an Identifier node.
 * @returns {Boolean} `true` if the node is a defaultProps declaration, `false` if not
 */
function isDefaultPropsDeclaration(node) {
  const propName = getPropertyName$1(node);
  return (propName === 'defaultProps' || propName === 'getDefaultProps');
}

/**
 * Checks if the PropTypes MemberExpression node passed in declares a required propType.
 * @param {ASTNode} propTypeExpression node to check. Must be a `PropTypes` MemberExpression.
 * @returns {Boolean} `true` if this PropType is required, `false` if not.
 */
function isRequiredPropType(propTypeExpression) {
  return propTypeExpression.type === 'MemberExpression' && propTypeExpression.property.name === 'isRequired';
}

var caller$1 = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = (new Error()).stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

var pathParse = createModule("/$$rollup_base$$/node_modules/path-parse");

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};



// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


if (isWindows)
  pathParse.exports = win32.parse;
else /* posix */
  pathParse.exports = posix.parse;

pathParse.exports.posix = posix.parse;
pathParse.exports.win32 = win32.parse;

var path$2 = path__default['default'];
var parse = path$2.parse || pathParse.exports;

var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if ((/^([A-Za-z]:)/).test(absoluteStart)) {
        prefix = '';
    } else if ((/^\\\\/).test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path$2.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
};

var nodeModulesPaths$1 = function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(
            request,
            start,
            function () { return getNodeModulesDirs(start, modules); },
            opts
        );
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

var normalizeOptions$1 = function (x, opts) {
    /**
     * This file is purposefully a passthrough. It's expected that third-party
     * environments will override it at runtime in order to inject special logic
     * into `resolve` (by manipulating the options). One such example is the PnP
     * code path in Yarn.
     */

    return opts || {};
};

var assert = true;
var async_hooks = ">= 8";
var buffer_ieee754 = "< 0.9.7";
var buffer = true;
var child_process = true;
var cluster = true;
var console$1 = true;
var constants = true;
var crypto = true;
var _debug_agent = ">= 1 && < 8";
var _debugger = "< 8";
var dgram = true;
var diagnostics_channel = [
	">= 14.17 && < 15",
	">= 15.1"
];
var dns = true;
var domain = ">= 0.7.12";
var events = true;
var freelist = "< 6";
var fs$2 = true;
var _http_agent = ">= 0.11.1";
var _http_client = ">= 0.11.1";
var _http_common = ">= 0.11.1";
var _http_incoming = ">= 0.11.1";
var _http_outgoing = ">= 0.11.1";
var _http_server = ">= 0.11.1";
var http = true;
var http2 = ">= 8.8";
var https = true;
var inspector = ">= 8";
var _linklist = "< 8";
var module$1 = true;
var net = true;
var os = true;
var path$1 = true;
var perf_hooks = ">= 8.5";
var process$1 = ">= 1";
var punycode = true;
var querystring = true;
var readline = true;
var repl = true;
var smalloc = ">= 0.11.5 && < 3";
var _stream_duplex = ">= 0.9.4";
var _stream_transform = ">= 0.9.4";
var _stream_wrap = ">= 1.4.1";
var _stream_passthrough = ">= 0.9.4";
var _stream_readable = ">= 0.9.4";
var _stream_writable = ">= 0.9.4";
var stream = true;
var string_decoder = true;
var sys = [
	">= 0.6 && < 0.7",
	">= 0.8"
];
var timers = true;
var _tls_common = ">= 0.11.13";
var _tls_legacy = ">= 0.11.3 && < 10";
var _tls_wrap = ">= 0.11.3";
var tls = true;
var trace_events = ">= 10";
var tty = true;
var url = true;
var util = true;
var v8 = ">= 1";
var vm = true;
var wasi = ">= 13.4 && < 13.5";
var worker_threads = ">= 11.7";
var zlib = true;
var require$$1$1 = {
	assert: assert,
	"node:assert": ">= 16",
	"assert/strict": ">= 15",
	"node:assert/strict": ">= 16",
	async_hooks: async_hooks,
	"node:async_hooks": ">= 16",
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	"node:buffer": ">= 16",
	child_process: child_process,
	"node:child_process": ">= 16",
	cluster: cluster,
	"node:cluster": ">= 16",
	console: console$1,
	"node:console": ">= 16",
	constants: constants,
	"node:constants": ">= 16",
	crypto: crypto,
	"node:crypto": ">= 16",
	_debug_agent: _debug_agent,
	_debugger: _debugger,
	dgram: dgram,
	"node:dgram": ">= 16",
	diagnostics_channel: diagnostics_channel,
	"node:diagnostics_channel": ">= 16",
	dns: dns,
	"node:dns": ">= 16",
	"dns/promises": ">= 15",
	"node:dns/promises": ">= 16",
	domain: domain,
	"node:domain": ">= 16",
	events: events,
	"node:events": ">= 16",
	freelist: freelist,
	fs: fs$2,
	"node:fs": ">= 16",
	"fs/promises": [
	">= 10 && < 10.1",
	">= 14"
],
	"node:fs/promises": ">= 16",
	_http_agent: _http_agent,
	"node:_http_agent": ">= 16",
	_http_client: _http_client,
	"node:_http_client": ">= 16",
	_http_common: _http_common,
	"node:_http_common": ">= 16",
	_http_incoming: _http_incoming,
	"node:_http_incoming": ">= 16",
	_http_outgoing: _http_outgoing,
	"node:_http_outgoing": ">= 16",
	_http_server: _http_server,
	"node:_http_server": ">= 16",
	http: http,
	"node:http": ">= 16",
	http2: http2,
	"node:http2": ">= 16",
	https: https,
	"node:https": ">= 16",
	inspector: inspector,
	"node:inspector": ">= 16",
	_linklist: _linklist,
	module: module$1,
	"node:module": ">= 16",
	net: net,
	"node:net": ">= 16",
	"node-inspect/lib/_inspect": ">= 7.6 && < 12",
	"node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
	"node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
	os: os,
	"node:os": ">= 16",
	path: path$1,
	"node:path": ">= 16",
	"path/posix": ">= 15.3",
	"node:path/posix": ">= 16",
	"path/win32": ">= 15.3",
	"node:path/win32": ">= 16",
	perf_hooks: perf_hooks,
	"node:perf_hooks": ">= 16",
	process: process$1,
	"node:process": ">= 16",
	punycode: punycode,
	"node:punycode": ">= 16",
	querystring: querystring,
	"node:querystring": ">= 16",
	readline: readline,
	"node:readline": ">= 16",
	repl: repl,
	"node:repl": ">= 16",
	smalloc: smalloc,
	_stream_duplex: _stream_duplex,
	"node:_stream_duplex": ">= 16",
	_stream_transform: _stream_transform,
	"node:_stream_transform": ">= 16",
	_stream_wrap: _stream_wrap,
	"node:_stream_wrap": ">= 16",
	_stream_passthrough: _stream_passthrough,
	"node:_stream_passthrough": ">= 16",
	_stream_readable: _stream_readable,
	"node:_stream_readable": ">= 16",
	_stream_writable: _stream_writable,
	"node:_stream_writable": ">= 16",
	stream: stream,
	"node:stream": ">= 16",
	"stream/promises": ">= 15",
	"node:stream/promises": ">= 16",
	string_decoder: string_decoder,
	"node:string_decoder": ">= 16",
	sys: sys,
	"node:sys": ">= 16",
	timers: timers,
	"node:timers": ">= 16",
	"timers/promises": ">= 15",
	"node:timers/promises": ">= 16",
	_tls_common: _tls_common,
	"node:_tls_common": ">= 16",
	_tls_legacy: _tls_legacy,
	_tls_wrap: _tls_wrap,
	"node:_tls_wrap": ">= 16",
	tls: tls,
	"node:tls": ">= 16",
	trace_events: trace_events,
	"node:trace_events": ">= 16",
	tty: tty,
	"node:tty": ">= 16",
	url: url,
	"node:url": ">= 16",
	util: util,
	"node:util": ">= 16",
	"util/types": ">= 15.3",
	"node:util/types": ">= 16",
	"v8/tools/arguments": ">= 10 && < 12",
	"v8/tools/codemap": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	"v8/tools/consarray": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	"v8/tools/csvparser": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	"v8/tools/logreader": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	"v8/tools/profile_view": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	"v8/tools/splaytree": [
	">= 4.4 && < 5",
	">= 5.2 && < 12"
],
	v8: v8,
	"node:v8": ">= 16",
	vm: vm,
	"node:vm": ">= 16",
	wasi: wasi,
	worker_threads: worker_threads,
	"node:worker_threads": ">= 16",
	zlib: zlib,
	"node:zlib": ">= 16"
};

var has = src;

function specifierIncluded(current, specifier) {
	var nodeParts = current.split('.');
	var parts = specifier.split(' ');
	var op = parts.length > 1 ? parts[0] : '=';
	var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

	for (var i = 0; i < 3; ++i) {
		var cur = parseInt(nodeParts[i] || 0, 10);
		var ver = parseInt(versionParts[i] || 0, 10);
		if (cur === ver) {
			continue; // eslint-disable-line no-restricted-syntax, no-continue
		}
		if (op === '<') {
			return cur < ver;
		}
		if (op === '>=') {
			return cur >= ver;
		}
		return false;
	}
	return op === '>=';
}

function matchesRange(current, range) {
	var specifiers = range.split(/ ?&& ?/);
	if (specifiers.length === 0) {
		return false;
	}
	for (var i = 0; i < specifiers.length; ++i) {
		if (!specifierIncluded(current, specifiers[i])) {
			return false;
		}
	}
	return true;
}

function versionIncluded(nodeVersion, specifierValue) {
	if (typeof specifierValue === 'boolean') {
		return specifierValue;
	}

	var current = typeof nodeVersion === 'undefined'
		? process.versions && process.versions.node && process.versions.node
		: nodeVersion;

	if (typeof current !== 'string') {
		throw new TypeError(typeof nodeVersion === 'undefined' ? 'Unable to determine current node version' : 'If provided, a valid node version is required');
	}

	if (specifierValue && typeof specifierValue === 'object') {
		for (var i = 0; i < specifierValue.length; ++i) {
			if (matchesRange(current, specifierValue[i])) {
				return true;
			}
		}
		return false;
	}
	return matchesRange(current, specifierValue);
}

var data = require$$1$1;

var isCoreModule = function isCore(x, nodeVersion) {
	return has(data, x) && versionIncluded(nodeVersion, data[x]);
};

var fs$1 = require$$0__default$1['default'];

fs$1.realpath && typeof fs$1.realpath.native === 'function' ? fs$1.realpath.native : fs$1.realpath;

var isCore = isCoreModule;
var fs = require$$0__default$1['default'];
var path = path__default['default'];
var caller = caller$1;
var nodeModulesPaths = nodeModulesPaths$1;
var normalizeOptions = normalizeOptions$1;

var realpathFS = fs.realpathSync && typeof fs.realpathSync.native === 'function' ? fs.realpathSync.native : fs.realpathSync;

var defaultIsFile = function isFile(file) {
    try {
        var stat = fs.statSync(file);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
};

var defaultIsDir = function isDirectory(dir) {
    try {
        var stat = fs.statSync(dir);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isDirectory();
};

var defaultRealpathSync = function realpathSync(x) {
    try {
        return realpathFS(x);
    } catch (realpathErr) {
        if (realpathErr.code !== 'ENOENT') {
            throw realpathErr;
        }
    }
    return x;
};

var maybeRealpathSync = function maybeRealpathSync(realpathSync, x, opts) {
    if (!opts || !opts.preserveSymlinks) {
        return realpathSync(x);
    }
    return x;
};

var defaultReadPackageSync = function defaultReadPackageSync(readFileSync, pkgfile) {
    var body = readFileSync(pkgfile);
    try {
        var pkg = JSON.parse(body);
        return pkg;
    } catch (jsonErr) {}
};

var getPackageCandidates = function getPackageCandidates(x, start, opts) {
    var dirs = nodeModulesPaths(start, opts, x);
    for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
    }
    return dirs;
};

var sync = function resolveSync(x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = normalizeOptions(x, options);

    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var readFileSync = opts.readFileSync || fs.readFileSync;
    var realpathSync = opts.realpathSync || defaultRealpathSync;
    var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
    if (opts.readFileSync && opts.readPackageSync) {
        throw new TypeError('`readFileSync` and `readPackageSync` are mutually exclusive.');
    }
    var packageIterator = opts.packageIterator;

    var extensions = opts.extensions || ['.js'];
    var includeCoreModules = opts.includeCoreModules !== false;
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = maybeRealpathSync(realpathSync, path.resolve(basedir), opts);

    if (opts.basedir && !isDirectory(absoluteStart)) {
        var dirError = new TypeError('Provided basedir "' + opts.basedir + '" is not a directory' + (opts.preserveSymlinks ? '' : ', or a symlink to a directory'));
        dirError.code = 'INVALID_BASEDIR';
        throw dirError;
    }

    if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return maybeRealpathSync(realpathSync, m, opts);
    } else if (includeCoreModules && isCore(x)) {
        return x;
    } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return maybeRealpathSync(realpathSync, n, opts);
    }

    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        var pkg = loadpkg(path.dirname(x));

        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
            }
        }

        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadpkg(dir) {
        if (dir === '' || dir === '/') return;
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return;
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return;

        var pkgfile = path.join(isDirectory(dir) ? maybeRealpathSync(realpathSync, dir, opts) : dir, 'package.json');

        if (!isFile(pkgfile)) {
            return loadpkg(path.dirname(dir));
        }

        var pkg = readPackageSync(readFileSync, pkgfile);

        if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, pkgfile, dir);
        }

        return { pkg: pkg, dir: dir };
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path.join(isDirectory(x) ? maybeRealpathSync(realpathSync, x, opts) : x, '/package.json');
        if (isFile(pkgfile)) {
            try {
                var pkg = readPackageSync(readFileSync, pkgfile);
            } catch (e) {}

            if (pkg && opts.packageFilter) {
                pkg = opts.packageFilter(pkg, pkgfile, x);
            }

            if (pkg && pkg.main) {
                if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                }
                if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                }
                try {
                    var mainPath = path.resolve(x, pkg.main);
                    var m = loadAsFileSync(mainPath);
                    if (m) return m;
                    var n = loadAsDirectorySync(mainPath);
                    if (n) return n;
                    var checkIndex = loadAsFileSync(path.resolve(x, 'index'));
                    if (checkIndex) return checkIndex;
                } catch (e) { }
                var incorrectMainError = new Error("Cannot find module '" + path.resolve(x, pkg.main) + "'. Please verify that the package.json has a valid \"main\" entry");
                incorrectMainError.code = 'INCORRECT_PACKAGE_MAIN';
                throw incorrectMainError;
            }
        }

        return loadAsFileSync(path.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var thunk = function () { return getPackageCandidates(x, start, opts); };
        var dirs = packageIterator ? packageIterator(x, start, thunk, opts) : thunk();

        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            if (isDirectory(path.dirname(dir))) {
                var m = loadAsFileSync(dir);
                if (m) return m;
                var n = loadAsDirectorySync(dir);
                if (n) return n;
            }
        }
    }
};

/**
 * Logs out a message if there is no format option set.
 * @param {String} message - Message to log.
 */
function error(message) {
  if (!/=-(f|-format)=/.test(process.argv.join('='))) {
    // eslint-disable-next-line no-console
    console.error(message);
  }
}

/**
 * @fileoverview Utility functions for React and Flow version configuration
 * @author Yannick Croissant
 */

let warnedForMissingVersion = false;

let cachedDetectedReactVersion;

function resolveBasedir(context) {
  let basedir = process.cwd();
  if (context) {
    const filename = context.getFilename();
    const dirname = path__default['default'].dirname(filename);
    try {
      if (require$$0$3.statSync(filename).isFile()) {
        // dirname must be dir here
        basedir = dirname;
      }
    } catch (err) {
      // https://github.com/eslint/eslint/issues/11989
      if (err.code === 'ENOTDIR') {
        // the error code alreay indicates that dirname is a file
        basedir = path__default['default'].dirname(dirname);
      }
    }
  }
  return basedir;
}

// TODO, semver-major: remove context fallback
function detectReactVersion(context) {
  if (cachedDetectedReactVersion) {
    return cachedDetectedReactVersion;
  }

  const basedir = resolveBasedir(context);

  try {
    const reactPath = sync('react', {basedir});
    const react = commonjsRequire(reactPath,"/$$rollup_base$$/lib/util"); // eslint-disable-line global-require, import/no-dynamic-require
    cachedDetectedReactVersion = react.version;
    return cachedDetectedReactVersion;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      if (!warnedForMissingVersion) {
        error('Warning: React version was set to "detect" in eslint-plugin-react settings, '
        + 'but the "react" package is not installed. Assuming latest React version for linting.');
        warnedForMissingVersion = true;
      }
      cachedDetectedReactVersion = '999.999.999';
      return cachedDetectedReactVersion;
    }
    throw e;
  }
}

function getReactVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings && context.settings.react && context.settings.react.version) {
    let settingsVersion = context.settings.react.version;
    if (settingsVersion === 'detect') {
      settingsVersion = detectReactVersion(context);
    }
    if (typeof settingsVersion !== 'string') {
      error('Warning: React version specified in eslint-plugin-react-settings must be a string; '
        + `got “${typeof settingsVersion}”`);
    }
    confVer = String(settingsVersion);
  } else if (!warnedForMissingVersion) {
    error('Warning: React version not specified in eslint-plugin-react settings. '
      + 'See https://github.com/yannickcr/eslint-plugin-react#configuration .');
    warnedForMissingVersion = true;
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map((part) => Number(part));
}

// TODO, semver-major: remove context fallback
function detectFlowVersion(context) {
  const basedir = resolveBasedir(context);

  try {
    const flowPackageJsonPath = sync('flow-bin/package.json', {basedir});
    const flowPackageJson = commonjsRequire(flowPackageJsonPath,"/$$rollup_base$$/lib/util"); // eslint-disable-line global-require, import/no-dynamic-require
    return flowPackageJson.version;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      error('Warning: Flow version was set to "detect" in eslint-plugin-react settings, '
        + 'but the "flow-bin" package is not installed. Assuming latest Flow version for linting.');
      return '999.999.999';
    }
    throw e;
  }
}

function getFlowVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.flowVersion) {
    let flowVersion = context.settings.react.flowVersion;
    if (flowVersion === 'detect') {
      flowVersion = detectFlowVersion(context);
    }
    if (typeof flowVersion !== 'string') {
      error('Warning: Flow version specified in eslint-plugin-react-settings must be a string; '
        + `got “${typeof flowVersion}”`);
    }
    confVer = String(flowVersion);
  } else {
    throw 'Could not retrieve flowVersion from settings'; // eslint-disable-line no-throw-literal
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map((part) => Number(part));
}

function normalizeParts(parts) {
  return Array.from({length: 3}, (_, i) => (parts[i] || 0));
}

function test(context, methodVer, confVer) {
  const methodVers = normalizeParts(String(methodVer || '').split('.').map((part) => Number(part)));
  const confVers = normalizeParts(confVer);
  const higherMajor = methodVers[0] < confVers[0];
  const higherMinor = methodVers[0] === confVers[0] && methodVers[1] < confVers[1];
  const higherOrEqualPatch = methodVers[0] === confVers[0]
    && methodVers[1] === confVers[1]
    && methodVers[2] <= confVers[2];

  return higherMajor || higherMinor || higherOrEqualPatch;
}

function testReactVersion(context, methodVer) {
  return test(context, methodVer, getReactVersionFromContext(context));
}

function testFlowVersion(context, methodVer) {
  return test(context, methodVer, getFlowVersionFromContext(context));
}

/**
 * @fileoverview Utility functions for propWrapperFunctions setting
 */

function getPropWrapperFunctions(context) {
  return new Set(context.settings.propWrapperFunctions || []);
}

function isPropWrapperFunction(context, name) {
  if (typeof name !== 'string') {
    return false;
  }
  const propWrapperFunctions = getPropWrapperFunctions(context);
  const splitName = name.split('.');
  return Array.from(propWrapperFunctions).some((func) => {
    if (splitName.length === 2 && func.object === splitName[0] && func.property === splitName[1]) {
      return true;
    }
    return name === func || func.property === name;
  });
}

/**
 * Check if the first letter of a string is capitalized.
 * @param {String} word String to check
 * @returns {Boolean} True if first letter is capitalized.
 */
function isFirstLetterCapitalized(word) {
  if (!word) {
    return false;
  }
  const firstLetter = word.charAt(0);
  return firstLetter.toUpperCase() === firstLetter;
}

/**
 * @fileoverview Common propTypes detection functionality.
 */

/**
 * Check if node is function type.
 * @param {ASTNode} node
 * @returns {Boolean}
 */
function isFunctionType(node) {
  if (!node) return false;
  const nodeType = node.type;
  return nodeType === 'FunctionDeclaration'
        || nodeType === 'FunctionExpression'
        || nodeType === 'ArrowFunctionExpression';
}

/**
 * Checks if we are declaring a props as a generic type in a flow-annotated class.
 *
 * @param {ASTNode} node  the AST node being checked.
 * @returns {Boolean} True if the node is a class with generic prop types, false if not.
 */
function isSuperTypeParameterPropsDeclaration(node) {
  if (node && (node.type === 'ClassDeclaration' || node.type === 'ClassExpression')) {
    if (node.superTypeParameters && node.superTypeParameters.params.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Iterates through a properties node, like a customized forEach.
 * @param {Object} context Array of properties to iterate.
 * @param {Object[]} properties Array of properties to iterate.
 * @param {Function} fn Function to call on each property, receives property key
    and property value. (key, value) => void
  * @param {Function} [handleSpreadFn] Function to call on each ObjectTypeSpreadProperty, receives the
    argument
 */
function iterateProperties(context, properties, fn, handleSpreadFn) {
  if (properties && properties.length && typeof fn === 'function') {
    for (let i = 0, j = properties.length; i < j; i++) {
      const node = properties[i];
      const key = getKeyValue(context, node);

      if (node.type === 'ObjectTypeSpreadProperty' && typeof handleSpreadFn === 'function') {
        handleSpreadFn(node.argument);
      }

      const value = node.value;
      fn(key, value, node);
    }
  }
}

/**
 * Checks if a node is inside a class body.
 *
 * @param {ASTNode} node  the AST node being checked.
 * @returns {Boolean} True if the node has a ClassBody ancestor, false if not.
 */
function isInsideClassBody(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'ClassBody') {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

function startWithCapitalizedLetter(node) {
  return (
    node.parent.type === 'VariableDeclarator'
    && !isFirstLetterCapitalized(node.parent.id.name)
  );
}

function propTypesInstructions(context, components, utils) {
  // Used to track the type annotations in scope.
  // Necessary because babel's scopes do not track type annotations.
  let stack = null;

  const classExpressions = [];
  const defaults = {customValidators: []};
  const configuration = Object.assign({}, defaults, context.options[0] || {});
  const customValidators = configuration.customValidators;

  /**
   * Returns the full scope.
   * @returns {Object} The whole scope.
   */
  function typeScope() {
    return stack[stack.length - 1];
  }

  /**
   * Gets a node from the scope.
   * @param {string} key The name of the identifier to access.
   * @returns {ASTNode} The ASTNode associated with the given identifier.
   */
  function getInTypeScope(key) {
    return stack[stack.length - 1][key];
  }

  /**
   * Sets the new value in the scope.
   * @param {string} key The name of the identifier to access
   * @param {ASTNode} value The new value for the identifier.
   * @returns {ASTNode} The ASTNode associated with the given identifier.
   */
  function setInTypeScope(key, value) {
    stack[stack.length - 1][key] = value;
    return value;
  }

  /**
   * Checks if prop should be validated by plugin-react-proptypes
   * @param {String} validator Name of validator to check.
   * @returns {Boolean} True if validator should be checked by custom validator.
   */
  function hasCustomValidator(validator) {
    return customValidators.indexOf(validator) !== -1;
  }

  /* eslint-disable no-use-before-define */
  /** @type {TypeDeclarationBuilders} */
  const typeDeclarationBuilders = {
    GenericTypeAnnotation(annotation, parentName, seen) {
      if (getInTypeScope(annotation.id.name)) {
        return buildTypeAnnotationDeclarationTypes(getInTypeScope(annotation.id.name), parentName, seen);
      }
      return {};
    },

    ObjectTypeAnnotation(annotation, parentName, seen) {
      let containsUnresolvedObjectTypeSpread = false;
      let containsSpread = false;
      const containsIndexers = Boolean(annotation.indexers && annotation.indexers.length);
      const shapeTypeDefinition = {
        type: 'shape',
        children: {}
      };
      iterateProperties(context, annotation.properties, (childKey, childValue, propNode) => {
        const fullName = [parentName, childKey].join('.');
        if (childKey || childValue) {
          const types = buildTypeAnnotationDeclarationTypes(childValue, fullName, seen);
          types.fullName = fullName;
          types.name = childKey;
          types.node = propNode;
          types.isRequired = !childValue.optional;
          shapeTypeDefinition.children[childKey] = types;
        }
      },
      (spreadNode) => {
        const key = getKeyValue(context, spreadNode);
        const types = buildTypeAnnotationDeclarationTypes(spreadNode, key, seen);
        if (!types.children) {
          containsUnresolvedObjectTypeSpread = true;
        } else {
          Object.assign(shapeTypeDefinition, types.children);
        }
        containsSpread = true;
      });

      // Mark if this shape has spread or an indexer. We will know to consider all props from this shape as having propTypes,
      // but still have the ability to detect unused children of this shape.
      shapeTypeDefinition.containsUnresolvedSpread = containsUnresolvedObjectTypeSpread;
      shapeTypeDefinition.containsIndexers = containsIndexers;
      // Deprecated: containsSpread is not used anymore in the codebase, ensure to keep API backward compatibility
      shapeTypeDefinition.containsSpread = containsSpread;

      return shapeTypeDefinition;
    },

    UnionTypeAnnotation(annotation, parentName, seen) {
      /** @type {UnionTypeDefinition} */
      const unionTypeDefinition = {
        type: 'union',
        children: annotation.types.map((type) => buildTypeAnnotationDeclarationTypes(type, parentName, seen))
      };
      if (unionTypeDefinition.children.length === 0) {
        // no complex type found, simply accept everything
        return {};
      }
      return unionTypeDefinition;
    },

    ArrayTypeAnnotation(annotation, parentName, seen) {
      const fullName = [parentName, '*'].join('.');
      const child = buildTypeAnnotationDeclarationTypes(annotation.elementType, fullName, seen);
      child.fullName = fullName;
      child.name = '__ANY_KEY__';
      child.node = annotation;
      return {
        type: 'object',
        children: {
          __ANY_KEY__: child
        }
      };
    }
  };
  /* eslint-enable no-use-before-define */

  /**
   * Resolve the type annotation for a given node.
   * Flow annotations are sometimes wrapped in outer `TypeAnnotation`
   * and `NullableTypeAnnotation` nodes which obscure the annotation we're
   * interested in.
   * This method also resolves type aliases where possible.
   *
   * @param {ASTNode} node The annotation or a node containing the type annotation.
   * @returns {ASTNode} The resolved type annotation for the node.
   */
  function resolveTypeAnnotation(node) {
    let annotation = (node.left && node.left.typeAnnotation) || node.typeAnnotation || node;
    while (annotation && (annotation.type === 'TypeAnnotation' || annotation.type === 'NullableTypeAnnotation')) {
      annotation = annotation.typeAnnotation;
    }
    if (annotation.type === 'GenericTypeAnnotation' && getInTypeScope(annotation.id.name)) {
      return getInTypeScope(annotation.id.name);
    }
    return annotation;
  }

  /**
   * Creates the representation of the React props type annotation for the component.
   * The representation is used to verify nested used properties.
   * @param {ASTNode} annotation Type annotation for the props class property.
   * @param {String} parentName
   * @param {Set<ASTNode>} [seen]
   * @return {Object} The representation of the declaration, empty object means
   *    the property is declared without the need for further analysis.
   */
  function buildTypeAnnotationDeclarationTypes(annotation, parentName, seen) {
    if (typeof seen === 'undefined') {
      // Keeps track of annotations we've already seen to
      // prevent problems with recursive types.
      seen = new Set();
    }
    if (seen.has(annotation)) {
      // This must be a recursive type annotation, so just accept anything.
      return {};
    }
    seen.add(annotation);

    if (annotation.type in typeDeclarationBuilders) {
      return typeDeclarationBuilders[annotation.type](annotation, parentName, seen);
    }
    return {};
  }

  /**
   * Marks all props found inside ObjectTypeAnnotation as declared.
   *
   * Modifies the declaredProperties object
   * @param {ASTNode} propTypes
   * @param {Object} declaredPropTypes
   * @returns {Boolean} True if propTypes should be ignored (e.g. when a type can't be resolved, when it is imported)
   */
  function declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes) {
    let ignorePropsValidation = false;

    iterateProperties(context, propTypes.properties, (key, value, propNode) => {
      if (!value) {
        ignorePropsValidation = ignorePropsValidation || propNode.type !== 'ObjectTypeSpreadProperty';
        return;
      }

      const types = buildTypeAnnotationDeclarationTypes(value, key);
      types.fullName = key;
      types.name = key;
      types.node = propNode;
      types.isRequired = !propNode.optional;
      declaredPropTypes[key] = types;
    }, (spreadNode) => {
      const key = getKeyValue(context, spreadNode);
      const spreadAnnotation = getInTypeScope(key);
      if (!spreadAnnotation) {
        ignorePropsValidation = true;
      } else {
        const spreadIgnoreValidation = declarePropTypesForObjectTypeAnnotation(spreadAnnotation, declaredPropTypes);
        ignorePropsValidation = ignorePropsValidation || spreadIgnoreValidation;
      }
    });

    return ignorePropsValidation;
  }

  /**
   * Marks all props found inside IntersectionTypeAnnotation as declared.
   * Since InterSectionTypeAnnotations can be nested, this handles recursively.
   *
   * Modifies the declaredPropTypes object
   * @param {ASTNode} propTypes
   * @param {Object} declaredPropTypes
   * @returns {Boolean} True if propTypes should be ignored (e.g. when a type can't be resolved, when it is imported)
   */
  function declarePropTypesForIntersectionTypeAnnotation(propTypes, declaredPropTypes) {
    return propTypes.types.some((annotation) => {
      if (annotation.type === 'ObjectTypeAnnotation') {
        return declarePropTypesForObjectTypeAnnotation(annotation, declaredPropTypes);
      }

      if (annotation.type === 'UnionTypeAnnotation') {
        return true;
      }

      // Type can't be resolved
      if (!annotation.id) {
        return true;
      }

      const typeNode = getInTypeScope(annotation.id.name);

      if (!typeNode) {
        return true;
      }
      if (typeNode.type === 'IntersectionTypeAnnotation') {
        return declarePropTypesForIntersectionTypeAnnotation(typeNode, declaredPropTypes);
      }

      return declarePropTypesForObjectTypeAnnotation(typeNode, declaredPropTypes);
    });
  }

  /**
   * Resolve node of type Identifier when building declaration types.
   * @param {ASTNode} node
   * @param {Function} callback called with the resolved value only if resolved.
   */
  function resolveValueForIdentifierNode(node, callback) {
    if (
      node
      && node.type === 'Identifier'
    ) {
      const scope = context.getScope();
      const identVariable = scope.variableScope.variables.find(
        (variable) => variable.name === node.name
      );
      if (identVariable) {
        const definition = identVariable.defs[identVariable.defs.length - 1];
        callback(definition.node.init);
      }
    }
  }

  /**
   * Creates the representation of the React propTypes for the component.
   * The representation is used to verify nested used properties.
   * @param {ASTNode} value Node of the PropTypes for the desired property
   * @param {string} parentName
   * @return {Object} The representation of the declaration, empty object means
   *    the property is declared without the need for further analysis.
   */
  function buildReactDeclarationTypes(value, parentName) {
    if (
      value
      && value.callee
      && value.callee.object
      && hasCustomValidator(value.callee.object.name)
    ) {
      return {};
    }

    let identNodeResolved = false;
    // Resolve identifier node for cases where isRequired is set in
    // the variable declaration or not at all.
    // const variableType = PropTypes.shape({ foo: ... }).isRequired
    // propTypes = {
    //   example: variableType
    // }
    // --------
    // const variableType = PropTypes.shape({ foo: ... })
    // propTypes = {
    //   example: variableType
    // }
    resolveValueForIdentifierNode(value, (newValue) => {
      identNodeResolved = true;
      value = newValue;
    });

    if (
      value
      && value.type === 'MemberExpression'
      && value.property
      && value.property.name
      && value.property.name === 'isRequired'
    ) {
      value = value.object;
    }

    // Resolve identifier node for cases where isRequired is set in
    // the prop types.
    // const variableType = PropTypes.shape({ foo: ... })
    // propTypes = {
    //   example: variableType.isRequired
    // }
    if (!identNodeResolved) {
      resolveValueForIdentifierNode(value, (newValue) => {
        value = newValue;
      });
    }

    // Verify PropTypes that are functions
    if (
      value
      && value.type === 'CallExpression'
      && value.callee
      && value.callee.property
      && value.callee.property.name
      && value.arguments
      && value.arguments.length > 0
    ) {
      const callName = value.callee.property.name;
      const argument = value.arguments[0];
      switch (callName) {
        case 'shape':
        case 'exact': {
          if (argument.type !== 'ObjectExpression') {
            // Invalid proptype or cannot analyse statically
            return {};
          }
          const shapeTypeDefinition = {
            type: callName,
            children: {}
          };
          iterateProperties(context, argument.properties, (childKey, childValue, propNode) => {
            if (childValue) { // skip spread propTypes
              const fullName = [parentName, childKey].join('.');
              const types = buildReactDeclarationTypes(childValue, fullName);
              types.fullName = fullName;
              types.name = childKey;
              types.node = propNode;
              shapeTypeDefinition.children[childKey] = types;
            }
          });
          return shapeTypeDefinition;
        }
        case 'arrayOf':
        case 'objectOf': {
          const fullName = [parentName, '*'].join('.');
          const child = buildReactDeclarationTypes(argument, fullName);
          child.fullName = fullName;
          child.name = '__ANY_KEY__';
          child.node = argument;
          return {
            type: 'object',
            children: {
              __ANY_KEY__: child
            }
          };
        }
        case 'oneOfType': {
          if (
            !argument.elements
            || !argument.elements.length
          ) {
            // Invalid proptype or cannot analyse statically
            return {};
          }

          /** @type {UnionTypeDefinition} */
          const unionTypeDefinition = {
            type: 'union',
            children: argument.elements.map((element) => buildReactDeclarationTypes(element, parentName))
          };
          if (unionTypeDefinition.children.length === 0) {
            // no complex type found, simply accept everything
            return {};
          }
          return unionTypeDefinition;
        }
        default:
          return {};
      }
    }
    // Unknown property or accepts everything (any, object, ...)
    return {};
  }

  class DeclarePropTypesForTSTypeAnnotation {
    constructor(propTypes, declaredPropTypes) {
      this.propTypes = propTypes;
      this.declaredPropTypes = declaredPropTypes;
      this.foundDeclaredPropertiesList = [];
      this.referenceNameMap = new Set();
      this.sourceCode = context.getSourceCode();
      this.shouldIgnorePropTypes = false;
      this.visitTSNode(this.propTypes);
      this.endAndStructDeclaredPropTypes();
    }

    /**
     * The node will be distribute to different function.
     * @param {ASTNode} node
     */
    visitTSNode(node) {
      if (!node) return;
      if (isTSTypeAnnotation(node)) {
        const typeAnnotation = node.typeAnnotation;
        this.visitTSNode(typeAnnotation);
      } else if (isTSTypeReference(node)) {
        this.searchDeclarationByName(node);
      } else if (isTSInterfaceHeritage(node)) {
        this.searchDeclarationByName(node);
      } else if (isTSTypeLiteral(node)) {
        // Check node is an object literal
        if (Array.isArray(node.members)) {
          this.foundDeclaredPropertiesList = this.foundDeclaredPropertiesList.concat(node.members);
        }
      } else if (isTSIntersectionType(node)) {
        this.convertIntersectionTypeToPropTypes(node);
      } else if (isTSParenthesizedType(node)) {
        const typeAnnotation = node.typeAnnotation;
        this.visitTSNode(typeAnnotation);
      } else if (isTSTypeParameterInstantiation(node)) {
        if (Array.isArray(node.params)) {
          node.params.forEach(this.visitTSNode, this);
        }
      } else {
        this.shouldIgnorePropTypes = true;
      }
    }

    /**
     * Search TSInterfaceDeclaration or TSTypeAliasDeclaration,
     * by using TSTypeReference and TSInterfaceHeritage name.
     * @param {ASTNode} node
     */
    searchDeclarationByName(node) {
      let typeName;
      if (isTSTypeReference(node)) {
        typeName = node.typeName.name;
      } else if (isTSInterfaceHeritage(node)) {
        if (!node.expression && node.id) {
          typeName = node.id.name;
        } else {
          typeName = node.expression.name;
        }
      }
      if (!typeName) {
        this.shouldIgnorePropTypes = true;
        return;
      }
      if (typeName === 'ReturnType') {
        this.convertReturnTypeToPropTypes(node);
        return;
      }
      // Prevent recursive inheritance will cause maximum callstack.
      if (this.referenceNameMap.has(typeName)) {
        this.shouldIgnorePropTypes = true;
        return;
      }
      // Add typeName to Set and consider it as traversed.
      this.referenceNameMap.add(typeName);

      /**
       * From line 577 to line 581, and line 588 to line 590 are trying to handle typescript-eslint-parser
       * Need to be deprecated after remove typescript-eslint-parser support.
       */
      const candidateTypes = this.sourceCode.ast.body.filter((item) => item.type === 'VariableDeclaration' && item.kind === 'type');
      const declarations = array_prototype_flatmap(candidateTypes, (type) => type.declarations);

      // we tried to find either an interface or a type with the TypeReference name
      const typeDeclaration = declarations.filter((dec) => dec.id.name === typeName);

      const interfaceDeclarations = this.sourceCode.ast.body
        .filter(
          (item) => (isTSInterfaceDeclaration(item)
                      || isTSTypeAliasDeclaration(item))
                        && item.id.name === typeName);
      if (typeDeclaration.length !== 0) {
        typeDeclaration.map((t) => t.init).forEach(this.visitTSNode, this);
      } else if (interfaceDeclarations.length !== 0) {
        interfaceDeclarations.forEach(this.traverseDeclaredInterfaceOrTypeAlias, this);
      } else {
        this.shouldIgnorePropTypes = true;
      }
    }

    /**
     * Traverse TSInterfaceDeclaration and TSTypeAliasDeclaration
     * which retrieve from function searchDeclarationByName;
     * @param {ASTNode} node
     */
    traverseDeclaredInterfaceOrTypeAlias(node) {
      if (isTSInterfaceDeclaration(node)) {
        // Handle TSInterfaceDeclaration interface Props { name: string, id: number}, should put in properties list directly;
        this.foundDeclaredPropertiesList = this.foundDeclaredPropertiesList.concat(node.body.body);
      }
      // Handle TSTypeAliasDeclaration type Props = {name:string}
      if (isTSTypeAliasDeclaration(node)) {
        const typeAnnotation = node.typeAnnotation;
        this.visitTSNode(typeAnnotation);
      }
      if (Array.isArray(node.extends)) {
        node.extends.forEach(this.visitTSNode, this);
        // This line is trying to handle typescript-eslint-parser
        // typescript-eslint-parser extension is name as heritage
      } else if (Array.isArray(node.heritage)) {
        node.heritage.forEach(this.visitTSNode, this);
      }
    }

    convertIntersectionTypeToPropTypes(node) {
      if (!node) return;
      if (Array.isArray(node.types)) {
        node.types.forEach(this.visitTSNode, this);
      } else {
        this.shouldIgnorePropTypes = true;
      }
    }

    convertReturnTypeToPropTypes(node) {
      // ReturnType<T> should always have one parameter
      if (node.typeParameters) {
        if (node.typeParameters.params.length === 1) {
          let returnType = node.typeParameters.params[0];
          // This line is trying to handle typescript-eslint-parser
          // typescript-eslint-parser TSTypeQuery is wrapped by TSTypeReference
          if (isTSTypeReference(returnType)) {
            returnType = returnType.typeName;
          }
          // Handle ReturnType<typeof mapStateToProps>
          if (isTSTypeQuery(returnType)) {
            const returnTypeFunction = array_prototype_flatmap(this.sourceCode.ast.body
              .filter((item) => item.type === 'VariableDeclaration'
                && item.declarations.find((dec) => dec.id.name === returnType.exprName.name)
              ), (type) => type.declarations).map((dec) => dec.init);

            if (Array.isArray(returnTypeFunction)) {
              if (returnTypeFunction.length === 0) {
                // Cannot find identifier in current scope. It might be an exported type.
                this.shouldIgnorePropTypes = true;
                return;
              }
              returnTypeFunction.forEach((func) => {
                if (isFunctionType(func)) {
                  let res = func.body;
                  if (res.type === 'BlockStatement') {
                    res = findReturnStatement(func);
                    if (res) {
                      res = res.argument;
                    }
                  }
                  switch (res.type) {
                    case 'ObjectExpression':
                      iterateProperties(context, res.properties, (key, value, propNode) => {
                        if (propNode && propNode.argument && propNode.argument.type === 'CallExpression') {
                          if (propNode.argument.typeParameters) {
                            this.visitTSNode(propNode.argument.typeParameters);
                          } else {
                            // Ignore this CallExpression return value since it doesn't have any typeParameters to let us know it's types.
                            this.shouldIgnorePropTypes = true;
                            return;
                          }
                        }
                        if (!value) {
                          this.shouldIgnorePropTypes = true;
                          return;
                        }
                        const types = buildReactDeclarationTypes(value, key);
                        types.fullName = key;
                        types.name = key;
                        types.node = propNode;
                        types.isRequired = isRequiredPropType(value);
                        this.declaredPropTypes[key] = types;
                      });
                      break;
                    case 'CallExpression':
                      if (res.typeParameters) {
                        this.visitTSNode(res.typeParameters);
                      } else {
                        // Ignore this CallExpression return value since it doesn't have any typeParameters to let us know it's types.
                        this.shouldIgnorePropTypes = true;
                      }
                      break;
                  }
                }
              });
              return;
            }
          }
          // Handle ReturnType<()=>returnType>
          if (isTSFunctionType(returnType)) {
            if (isTSTypeAnnotation(returnType.returnType)) {
              this.visitTSNode(returnType.returnType);
              return;
            }
            // This line is trying to handle typescript-eslint-parser
            // typescript-eslint-parser TSFunction name returnType as typeAnnotation
            if (isTSTypeAnnotation(returnType.typeAnnotation)) {
              this.visitTSNode(returnType.typeAnnotation);
              return;
            }
          }
        }
      }
      this.shouldIgnorePropTypes = true;
    }

    endAndStructDeclaredPropTypes() {
      this.foundDeclaredPropertiesList.forEach((tsInterfaceBody) => {
        if (tsInterfaceBody && (tsInterfaceBody.type === 'TSPropertySignature' || tsInterfaceBody.type === 'TSMethodSignature')) {
          let accessor = 'name';
          if (tsInterfaceBody.key.type === 'Literal') {
            if (typeof tsInterfaceBody.key.value === 'number') {
              accessor = 'raw';
            } else {
              accessor = 'value';
            }
          }
          this.declaredPropTypes[tsInterfaceBody.key[accessor]] = {
            fullName: tsInterfaceBody.key[accessor],
            name: tsInterfaceBody.key[accessor],
            node: tsInterfaceBody,
            isRequired: !tsInterfaceBody.optional
          };
        }
      });
    }
  }

  /**
   * Mark a prop type as declared
   * @param {ASTNode} node The AST node being checked.
   * @param {ASTNode} propTypes The AST node containing the proptypes
   */
  function markPropTypesAsDeclared(node, propTypes) {
    let componentNode = node;
    while (componentNode && !components.get(componentNode)) {
      componentNode = componentNode.parent;
    }
    const component = components.get(componentNode);
    let declaredPropTypes = (component && component.declaredPropTypes) || {};
    let ignorePropsValidation = (component && component.ignorePropsValidation) || false;
    switch (propTypes && propTypes.type) {
      case 'ObjectTypeAnnotation':
        ignorePropsValidation = declarePropTypesForObjectTypeAnnotation(propTypes, declaredPropTypes);
        break;
      case 'ObjectExpression':
        iterateProperties(context, propTypes.properties, (key, value, propNode) => {
          if (!value) {
            ignorePropsValidation = true;
            return;
          }
          const types = buildReactDeclarationTypes(value, key);
          types.fullName = key;
          types.name = key;
          types.node = propNode;
          types.isRequired = isRequiredPropType(value);
          declaredPropTypes[key] = types;
        });
        break;
      case 'MemberExpression': {
        let curDeclaredPropTypes = declaredPropTypes;
        // Walk the list of properties, until we reach the assignment
        // ie: ClassX.propTypes.a.b.c = ...
        while (
          propTypes
          && propTypes.parent
          && propTypes.parent.type !== 'AssignmentExpression'
          && propTypes.property
          && curDeclaredPropTypes
        ) {
          const propName = propTypes.property.name;
          if (propName in curDeclaredPropTypes) {
            curDeclaredPropTypes = curDeclaredPropTypes[propName].children;
            propTypes = propTypes.parent;
          } else {
            // This will crash at runtime because we haven't seen this key before
            // stop this and do not declare it
            propTypes = null;
          }
        }
        if (propTypes && propTypes.parent && propTypes.property) {
          if (!(propTypes === propTypes.parent.left && propTypes.parent.left.object)) {
            ignorePropsValidation = true;
            break;
          }
          const parentProp = context.getSource(propTypes.parent.left.object).replace(/^.*\.propTypes\./, '');
          const types = buildReactDeclarationTypes(
            propTypes.parent.right,
            parentProp
          );

          types.name = propTypes.property.name;
          types.fullName = [parentProp, propTypes.property.name].join('.');
          types.node = propTypes.parent;
          types.isRequired = isRequiredPropType(propTypes.parent.right);
          curDeclaredPropTypes[propTypes.property.name] = types;
        } else {
          let isUsedInPropTypes = false;
          let n = propTypes;
          while (n) {
            if (((n.type === 'AssignmentExpression') && isPropTypesDeclaration(n.left))
              || ((n.type === 'ClassProperty' || n.type === 'Property') && isPropTypesDeclaration(n))) {
              // Found a propType used inside of another propType. This is not considered usage, we'll still validate
              // this component.
              isUsedInPropTypes = true;
              break;
            }
            n = n.parent;
          }
          if (!isUsedInPropTypes) {
            ignorePropsValidation = true;
          }
        }
        break;
      }
      case 'Identifier': {
        const variablesInScope = variablesInScope(context);
        const firstMatchingVariable = variablesInScope
          .find((variableInScope) => variableInScope.name === propTypes.name);
        if (firstMatchingVariable) {
          const defInScope = firstMatchingVariable.defs[firstMatchingVariable.defs.length - 1];
          markPropTypesAsDeclared(node, defInScope.node && defInScope.node.init);
          return;
        }
        ignorePropsValidation = true;
        break;
      }
      case 'CallExpression': {
        if (
          isPropWrapperFunction(
            context,
            context.getSourceCode().getText(propTypes.callee)
          )
          && propTypes.arguments && propTypes.arguments[0]
        ) {
          markPropTypesAsDeclared(node, propTypes.arguments[0]);
          return;
        }
        break;
      }
      case 'IntersectionTypeAnnotation':
        ignorePropsValidation = declarePropTypesForIntersectionTypeAnnotation(propTypes, declaredPropTypes);
        break;
      case 'GenericTypeAnnotation':
        if (propTypes.id.name === '$ReadOnly') {
          ignorePropsValidation = declarePropTypesForObjectTypeAnnotation(
            propTypes.typeParameters.params[0],
            declaredPropTypes
          );
        } else {
          ignorePropsValidation = true;
        }
        break;
      case 'TSTypeAnnotation': {
        const tsTypeAnnotation = new DeclarePropTypesForTSTypeAnnotation(propTypes, declaredPropTypes);
        ignorePropsValidation = tsTypeAnnotation.shouldIgnorePropTypes;
        declaredPropTypes = tsTypeAnnotation.declaredPropTypes;
      }
        break;
      case null:
        break;
      default:
        ignorePropsValidation = true;
        break;
    }

    components.set(node, {
      declaredPropTypes,
      ignorePropsValidation
    });
  }

  /**
   * @param {ASTNode} node We expect either an ArrowFunctionExpression,
   *   FunctionDeclaration, or FunctionExpression
   */
  function markAnnotatedFunctionArgumentsAsDeclared(node) {
    if (!node.params || !node.params.length || !isAnnotatedFunctionPropsDeclaration(node, context)) {
      return;
    }

    // https://github.com/yannickcr/eslint-plugin-react/issues/2784
    if (isInsideClassBody(node) && !isFunction(node)) {
      return;
    }

    // Should ignore function that not return JSXElement
    if (!utils.isReturningJSXOrNull(node) || startWithCapitalizedLetter(node)) {
      return;
    }

    const param = node.params[0];
    if (param.typeAnnotation && param.typeAnnotation.typeAnnotation && param.typeAnnotation.typeAnnotation.type === 'UnionTypeAnnotation') {
      param.typeAnnotation.typeAnnotation.types.forEach((annotation) => {
        if (annotation.type === 'GenericTypeAnnotation') {
          markPropTypesAsDeclared(node, resolveTypeAnnotation(annotation));
        } else {
          markPropTypesAsDeclared(node, annotation);
        }
      });
    } else {
      markPropTypesAsDeclared(node, resolveTypeAnnotation(param));
    }
  }

  /**
   * Resolve the type annotation for a given class declaration node with superTypeParameters.
   *
   * @param {ASTNode} node The annotation or a node containing the type annotation.
   * @returns {ASTNode} The resolved type annotation for the node.
   */
  function resolveSuperParameterPropsType(node) {
    let propsParameterPosition;
    try {
      // Flow <=0.52 had 3 required TypedParameters of which the second one is the Props.
      // Flow >=0.53 has 2 optional TypedParameters of which the first one is the Props.
      propsParameterPosition = testFlowVersion(context, '0.53.0') ? 0 : 1;
    } catch (e) {
      // In case there is no flow version defined, we can safely assume that when there are 3 Props we are dealing with version <= 0.52
      propsParameterPosition = node.superTypeParameters.params.length <= 2 ? 0 : 1;
    }

    let annotation = node.superTypeParameters.params[propsParameterPosition];
    while (annotation && (annotation.type === 'TypeAnnotation' || annotation.type === 'NullableTypeAnnotation')) {
      annotation = annotation.typeAnnotation;
    }

    if (annotation && annotation.type === 'GenericTypeAnnotation' && getInTypeScope(annotation.id.name)) {
      return getInTypeScope(annotation.id.name);
    }
    return annotation;
  }

  /**
   * Checks if we are declaring a `props` class property with a flow type annotation.
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if the node is a type annotated props declaration, false if not.
   */
  function isAnnotatedClassPropsDeclaration(node) {
    if (node && node.type === 'ClassProperty') {
      const tokens = context.getFirstTokens(node, 2);
      if (
        node.typeAnnotation && (
          tokens[0].value === 'props'
          || (tokens[1] && tokens[1].value === 'props')
        )
      ) {
        return true;
      }
    }
    return false;
  }

  return {
    ClassExpression(node) {
      // TypeParameterDeclaration need to be added to typeScope in order to handle ClassExpressions.
      // This visitor is executed before TypeParameterDeclaration are scoped, therefore we postpone
      // processing class expressions until when the program exists.
      classExpressions.push(node);
    },

    ClassDeclaration(node) {
      if (isSuperTypeParameterPropsDeclaration(node)) {
        markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
      }
    },

    ClassProperty(node) {
      if (isAnnotatedClassPropsDeclaration(node)) {
        markPropTypesAsDeclared(node, resolveTypeAnnotation(node));
      } else if (isPropTypesDeclaration(node)) {
        markPropTypesAsDeclared(node, node.value);
      }
    },

    ObjectExpression(node) {
      // Search for the proptypes declaration
      node.properties.forEach((property) => {
        if (!isPropTypesDeclaration(property)) {
          return;
        }
        markPropTypesAsDeclared(node, property.value);
      });
    },

    FunctionExpression(node) {
      if (node.parent.type !== 'MethodDefinition') {
        markAnnotatedFunctionArgumentsAsDeclared(node);
      }
    },

    FunctionDeclaration: markAnnotatedFunctionArgumentsAsDeclared,

    ArrowFunctionExpression: markAnnotatedFunctionArgumentsAsDeclared,

    MemberExpression(node) {
      if (isPropTypesDeclaration(node)) {
        const component = utils.getRelatedComponent(node);
        if (!component) {
          return;
        }
        markPropTypesAsDeclared(component.node, node.parent.right || node.parent);
      }
    },

    MethodDefinition(node) {
      if (!node.static || node.kind !== 'get' || !isPropTypesDeclaration(node)) {
        return;
      }

      let i = node.value.body.body.length - 1;
      for (; i >= 0; i--) {
        if (node.value.body.body[i].type === 'ReturnStatement') {
          break;
        }
      }

      if (i >= 0) {
        markPropTypesAsDeclared(node, node.value.body.body[i].argument);
      }
    },

    TypeAlias(node) {
      setInTypeScope(node.id.name, node.right);
    },

    TypeParameterDeclaration(node) {
      const identifier = node.params[0];

      if (identifier.typeAnnotation) {
        setInTypeScope(identifier.name, identifier.typeAnnotation.typeAnnotation);
      }
    },

    Program() {
      stack = [{}];
    },

    BlockStatement() {
      stack.push(Object.create(typeScope()));
    },

    'BlockStatement:exit'() {
      stack.pop();
    },

    'Program:exit'() {
      classExpressions.forEach((node) => {
        if (isSuperTypeParameterPropsDeclaration(node)) {
          markPropTypesAsDeclared(node, resolveSuperParameterPropsType(node));
        }
      });
    }
  };
}

var hasProp$1 = {};

var propName$1 = {};

Object.defineProperty(propName$1, "__esModule", {
  value: true
});
propName$1.default = propName;
/**
 * Returns the name of the prop given the JSXAttribute object.
 */
function propName() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!prop.type || prop.type !== 'JSXAttribute') {
    throw new Error('The prop must be a JSXAttribute collected by the AST parser.');
  }

  if (prop.name.type === 'JSXNamespacedName') {
    return prop.name.namespace.name + ':' + prop.name.name.name;
  }

  return prop.name.name;
}

Object.defineProperty(hasProp$1, "__esModule", {
  value: true
});
hasProp$1.default = hasProp;
hasProp$1.hasAnyProp = hasAnyProp;
hasProp$1.hasEveryProp = hasEveryProp;

var _propName$2 = propName$1;

var _propName2$2 = _interopRequireDefault$4(_propName$2);

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS$1 = {
  spreadStrict: true,
  ignoreCase: true
};

/**
 * Returns boolean indicating whether an prop exists on the props
 * property of a JSX element node.
 */
function hasProp() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS$1;

  var propToCheck = options.ignoreCase ? prop.toUpperCase() : prop;

  return props.some(function (attribute) {
    // If the props contain a spread prop, then refer to strict param.
    if (attribute.type === 'JSXSpreadAttribute') {
      return !options.spreadStrict;
    }

    var currentProp = options.ignoreCase ? (0, _propName2$2.default)(attribute).toUpperCase() : (0, _propName2$2.default)(attribute);

    return propToCheck === currentProp;
  });
}

/**
 * Given the props on a node and a list of props to check, this returns a boolean
 * indicating if any of them exist on the node.
 */
function hasAnyProp() {
  var nodeProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS$1;

  var propsToCheck = typeof props === 'string' ? props.split(' ') : props;

  return propsToCheck.some(function (prop) {
    return hasProp(nodeProps, prop, options);
  });
}

/**
 * Given the props on a node and a list of props to check, this returns a boolean
 * indicating if all of them exist on the node
 */
function hasEveryProp() {
  var nodeProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS$1;

  var propsToCheck = typeof props === 'string' ? props.split(' ') : props;

  return propsToCheck.every(function (prop) {
    return hasProp(nodeProps, prop, options);
  });
}

var elementType$1 = {};

Object.defineProperty(elementType$1, "__esModule", {
  value: true
});
elementType$1.default = elementType;
function resolveMemberExpressions() {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (object.type === 'JSXMemberExpression') {
    return resolveMemberExpressions(object.object, object.property) + '.' + property.name;
  }

  return object.name + '.' + property.name;
}

/**
 * Returns the tagName associated with a JSXElement.
 */
function elementType() {
  var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = node.name;


  if (node.type === 'JSXOpeningFragment') {
    return '<>';
  }

  if (!name) {
    throw new Error('The argument provided is not a JSXElement node.');
  }

  if (name.type === 'JSXMemberExpression') {
    var _name$object = name.object,
        object = _name$object === undefined ? {} : _name$object,
        _name$property = name.property,
        property = _name$property === undefined ? {} : _name$property;

    return resolveMemberExpressions(object, property);
  }

  if (name.type === 'JSXNamespacedName') {
    return name.namespace.name + ':' + name.name.name;
  }

  return node.name.name;
}

var eventHandlers$1 = {};

Object.defineProperty(eventHandlers$1, "__esModule", {
  value: true
});
/**
 * Common event handlers for JSX element event binding.
 */

var eventHandlersByType = {
  clipboard: ['onCopy', 'onCut', 'onPaste'],
  composition: ['onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate'],
  keyboard: ['onKeyDown', 'onKeyPress', 'onKeyUp'],
  focus: ['onFocus', 'onBlur'],
  form: ['onChange', 'onInput', 'onSubmit'],
  mouse: ['onClick', 'onContextMenu', 'onDblClick', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp'],
  selection: ['onSelect'],
  touch: ['onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart'],
  ui: ['onScroll'],
  wheel: ['onWheel'],
  media: ['onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'onWaiting'],
  image: ['onLoad', 'onError'],
  animation: ['onAnimationStart', 'onAnimationEnd', 'onAnimationIteration'],
  transition: ['onTransitionEnd']
};

var eventHandlers = Object.keys(eventHandlersByType).reduce(function (accumulator, type) {
  return accumulator.concat(eventHandlersByType[type]);
}, []);

eventHandlers$1.default = eventHandlers;
eventHandlers$1.eventHandlersByType = eventHandlersByType;

var getProp$1 = {};

Object.defineProperty(getProp$1, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

getProp$1.default = getProp;

var _propName$1 = propName$1;

var _propName2$1 = _interopRequireDefault$3(_propName$1);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DEFAULT_OPTIONS = {
  ignoreCase: true
};

/**
 * Returns the JSXAttribute itself or undefined, indicating the prop
 * is not present on the JSXOpeningElement.
 *
 */
function getProp() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS;

  function getName(name) {
    return options.ignoreCase ? name.toUpperCase() : name;
  }
  var propToFind = getName(prop);
  function isPropToFind(property) {
    return property.type === 'Property' && property.key.type === 'Identifier' && propToFind === getName(property.key.name);
  }

  var foundAttribute = props.find(function (attribute) {
    // If the props contain a spread prop, try to find the property in the object expression.
    if (attribute.type === 'JSXSpreadAttribute') {
      return attribute.argument.type === 'ObjectExpression' && propToFind !== getName('key') // https://github.com/reactjs/rfcs/pull/107
      && attribute.argument.properties.some(isPropToFind);
    }

    return propToFind === getName((0, _propName2$1.default)(attribute));
  });

  if (foundAttribute && foundAttribute.type === 'JSXSpreadAttribute') {
    return propertyToJSXAttribute(foundAttribute.argument.properties.find(isPropToFind));
  }

  return foundAttribute;
}

function propertyToJSXAttribute(node) {
  var key = node.key,
      value = node.value;

  return _extends$1({
    type: 'JSXAttribute',
    name: _extends$1({ type: 'JSXIdentifier', name: key.name }, getBaseProps(key)),
    value: value.type === 'Literal' ? adjustRangeOfNode(value) : _extends$1({ type: 'JSXExpressionContainer', expression: adjustExpressionRange(value) }, getBaseProps(value))
  }, getBaseProps(node));
}

function adjustRangeOfNode(node) {
  var _ref = node.range || [node.start, node.end],
      _ref2 = _slicedToArray(_ref, 2),
      start = _ref2[0],
      end = _ref2[1];

  return _extends$1({}, node, {
    end: undefined,
    range: [start, end],
    start: undefined
  });
}

function adjustExpressionRange(_ref3) {
  var expressions = _ref3.expressions,
      quasis = _ref3.quasis,
      expression = _objectWithoutProperties(_ref3, ['expressions', 'quasis']);

  return _extends$1({}, adjustRangeOfNode(expression), expressions ? { expressions: expressions.map(adjustRangeOfNode) } : {}, quasis ? { quasis: quasis.map(adjustRangeOfNode) } : {});
}

function getBaseProps(_ref4) {
  var loc = _ref4.loc,
      node = _objectWithoutProperties(_ref4, ['loc']);

  var _adjustRangeOfNode = adjustRangeOfNode(node),
      range = _adjustRangeOfNode.range;

  return {
    loc: getBaseLocation(loc),
    range: range
  };
}

function getBaseLocation(_ref5) {
  var start = _ref5.start,
      end = _ref5.end,
      source = _ref5.source,
      filename = _ref5.filename;

  return _extends$1({
    start: start,
    end: end
  }, source !== undefined ? { source: source } : {}, filename !== undefined ? { filename: filename } : {});
}

var getPropValue$1 = {};

var values = {};

var index = commonjsRequire("/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions/index.js", "/$$rollup_base$$/node_modules/jsx-ast-utils/lib/values/expressions");

var expressions = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': index
});

var require$$2 = /*@__PURE__*/getAugmentedNamespace(expressions);

Object.defineProperty(values, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

values.default = getValue;
values.getLiteralValue = getLiteralValue;

var _Literal = Literal;

var _Literal2 = _interopRequireDefault$2(_Literal);

var _JSXElement = JSXElement;

var _JSXElement2 = _interopRequireDefault$2(_JSXElement);

var _expressions = require$$2;

var _expressions2 = _interopRequireDefault$2(_expressions);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Composition map of types to their extractor functions.
var TYPES = {
  Literal: _Literal2.default,
  JSXElement: _JSXElement2.default,
  JSXExpressionContainer: _expressions2.default
};

// Composition map of types to their extractor functions to handle literals.
var LITERAL_TYPES = _extends({}, TYPES, {
  JSXElement: function JSXElement() {
    return null;
  },
  JSXExpressionContainer: _expressions.extractLiteral
});

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *all* possible types.
 *
 * @param value - AST Value object on a JSX Attribute.
 */
function getValue(value) {
  return TYPES[value.type](value);
}

/**
 * This function maps an AST value node
 * to its correct extractor function for its
 * given type.
 *
 * This will map correctly for *some* possible types that map to literals.
 *
 * @param value - AST Value object on a JSX Attribute.
 */
function getLiteralValue(value) {
  return LITERAL_TYPES[value.type](value);
}

Object.defineProperty(getPropValue$1, "__esModule", {
  value: true
});
getPropValue$1.default = getPropValue;
getPropValue$1.getLiteralPropValue = getLiteralPropValue;

var _values = values;

var _values2 = _interopRequireDefault$1(_values);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractValue = function extractValue(attribute, extractor) {
  if (attribute && attribute.type === 'JSXAttribute') {
    if (attribute.value === null) {
      // Null valued attributes imply truthiness.
      // For example: <div aria-hidden />
      // See: https://facebook.github.io/react/docs/jsx-in-depth.html#boolean-attributes
      return true;
    }

    return extractor(attribute.value);
  }

  return undefined;
};

/**
 * Returns the value of a given attribute.
 * Different types of attributes have their associated
 * values in different properties on the object.
 *
 * This function should return the most *closely* associated
 * value with the intention of the JSX.
 *
 * @param attribute - The JSXAttribute collected by AST parser.
 */
function getPropValue(attribute) {
  return extractValue(attribute, _values2.default);
}

/**
 * Returns the value of a given attribute.
 * Different types of attributes have their associated
 * values in different properties on the object.
 *
 * This function should return a value only if we can extract
 * a literal value from its attribute (i.e. values that have generic
 * types in JavaScript - strings, numbers, booleans, etc.)
 *
 * @param attribute - The JSXAttribute collected by AST parser.
 */
function getLiteralPropValue(attribute) {
  return extractValue(attribute, _values.getLiteralValue);
}

var _hasProp = hasProp$1;

var _hasProp2 = _interopRequireDefault(_hasProp);

var _elementType = elementType$1;

var _elementType2 = _interopRequireDefault(_elementType);

var _eventHandlers = eventHandlers$1;

var _eventHandlers2 = _interopRequireDefault(_eventHandlers);

var _getProp = getProp$1;

var _getProp2 = _interopRequireDefault(_getProp);

var _getPropValue = getPropValue$1;

var _getPropValue2 = _interopRequireDefault(_getPropValue);

var _propName = propName$1;

var _propName2 = _interopRequireDefault(_propName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

({
  hasProp: _hasProp2.default,
  hasAnyProp: _hasProp.hasAnyProp,
  hasEveryProp: _hasProp.hasEveryProp,
  elementType: _elementType2.default,
  eventHandlers: _eventHandlers2.default,
  eventHandlersByType: _eventHandlers.eventHandlersByType,
  getProp: _getProp2.default,
  getPropValue: _getPropValue2.default,
  getLiteralPropValue: _getPropValue.getLiteralPropValue,
  propName: _propName2.default
});

/**
 * @fileoverview Utility functions for JSX
 */

/**
 * Checks if a node represents a JSX element or fragment.
 * @param {object} node - node to check.
 * @returns {boolean} Whether or not the node if a JSX element or fragment.
 */
function isJSX(node) {
  return node && ['JSXElement', 'JSXFragment'].indexOf(node.type) >= 0;
}

/**
 * @fileoverview Common used propTypes detection functionality.
 */

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const LIFE_CYCLE_METHODS = ['componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate'];
const ASYNC_SAFE_LIFE_CYCLE_METHODS = ['getDerivedStateFromProps', 'getSnapshotBeforeUpdate', 'UNSAFE_componentWillReceiveProps', 'UNSAFE_componentWillUpdate'];

function createPropVariables() {
  /** @type {Map<string, string[]>} Maps the variable to its definition. `props.a.b` is stored as `['a', 'b']` */
  let propVariables = new Map();
  let hasBeenWritten = false;
  const stack = [{propVariables, hasBeenWritten}];
  return {
    pushScope() {
      // popVariables is not copied until first write.
      stack.push({propVariables, hasBeenWritten: false});
    },
    popScope() {
      stack.pop();
      propVariables = stack[stack.length - 1].propVariables;
      hasBeenWritten = stack[stack.length - 1].hasBeenWritten;
    },
    /**
     * Add a variable name to the current scope
     * @param {string} name
     * @param {string[]} allNames Example: `props.a.b` should be formatted as `['a', 'b']`
     * @returns {Map<string, string[]>}
     */
    set(name, allNames) {
      if (!hasBeenWritten) {
        // copy on write
        propVariables = new Map(propVariables);
        Object.assign(stack[stack.length - 1], {propVariables, hasBeenWritten: true});
        stack[stack.length - 1].hasBeenWritten = true;
      }
      return propVariables.set(name, allNames);
    },
    /**
     * Get the definition of a variable.
     * @param {string} name
     * @returns {string[]} Example: `props.a.b` is represented by `['a', 'b']`
     */
    get(name) {
      return propVariables.get(name);
    }
  };
}

/**
 * Checks if the string is one of `props`, `nextProps`, or `prevProps`
 * @param {string} name The AST node being checked.
 * @returns {Boolean} True if the prop name matches
 */
function isCommonVariableNameForProps(name) {
  return name === 'props' || name === 'nextProps' || name === 'prevProps';
}

/**
 * Checks if the component must be validated
 * @param {Object} component The component to process
 * @returns {Boolean} True if the component must be validated, false if not.
 */
function mustBeValidated(component) {
  return !!(component && !component.ignorePropsValidation);
}

/**
 * Check if we are in a lifecycle method
 * @param {object} context
 * @param {boolean} checkAsyncSafeLifeCycles
 * @return {boolean} true if we are in a class constructor, false if not
 */
function inLifeCycleMethod(context, checkAsyncSafeLifeCycles) {
  let scope = context.getScope();
  while (scope) {
    if (scope.block && scope.block.parent && scope.block.parent.key) {
      const name = scope.block.parent.key.name;

      if (LIFE_CYCLE_METHODS.indexOf(name) >= 0) {
        return true;
      }
      if (checkAsyncSafeLifeCycles && ASYNC_SAFE_LIFE_CYCLE_METHODS.indexOf(name) >= 0) {
        return true;
      }
    }
    scope = scope.upper;
  }
  return false;
}

/**
 * Returns true if the given node is a React Component lifecycle method
 * @param {ASTNode} node The AST node being checked.
 * @param {boolean} checkAsyncSafeLifeCycles
 * @return {Boolean} True if the node is a lifecycle method
 */
function isNodeALifeCycleMethod(node, checkAsyncSafeLifeCycles) {
  const nodeKeyName = (node.key || /** @type {ASTNode} */ ({})).name;

  if (node.kind === 'constructor') {
    return true;
  }
  if (LIFE_CYCLE_METHODS.indexOf(nodeKeyName) >= 0) {
    return true;
  }
  if (checkAsyncSafeLifeCycles && ASYNC_SAFE_LIFE_CYCLE_METHODS.indexOf(nodeKeyName) >= 0) {
    return true;
  }

  return false;
}

/**
 * Returns true if the given node is inside a React Component lifecycle
 * method.
 * @param {ASTNode} node The AST node being checked.
 * @param {boolean} checkAsyncSafeLifeCycles
 * @return {Boolean} True if the node is inside a lifecycle method
 */
function isInLifeCycleMethod(node, checkAsyncSafeLifeCycles) {
  if ((node.type === 'MethodDefinition' || node.type === 'Property') && isNodeALifeCycleMethod(node, checkAsyncSafeLifeCycles)) {
    return true;
  }

  if (node.parent) {
    return isInLifeCycleMethod(node.parent, checkAsyncSafeLifeCycles);
  }

  return false;
}

/**
 * Check if a function node is a setState updater
 * @param {ASTNode} node a function node
 * @return {boolean}
 */
function isSetStateUpdater(node) {
  const unwrappedParentCalleeNode = node.parent.type === 'CallExpression'
    && unwrapTSAsExpression(node.parent.callee);

  return unwrappedParentCalleeNode
    && unwrappedParentCalleeNode.property
    && unwrappedParentCalleeNode.property.name === 'setState'
    // Make sure we are in the updater not the callback
    && node.parent.arguments[0] === node;
}

function isPropArgumentInSetStateUpdater(context, name) {
  if (typeof name !== 'string') {
    return;
  }
  let scope = context.getScope();
  while (scope) {
    const unwrappedParentCalleeNode = scope.block
      && scope.block.parent
      && scope.block.parent.type === 'CallExpression'
      && unwrapTSAsExpression(scope.block.parent.callee);
    if (
      unwrappedParentCalleeNode
      && unwrappedParentCalleeNode.property
      && unwrappedParentCalleeNode.property.name === 'setState'
      // Make sure we are in the updater not the callback
      && scope.block.parent.arguments[0].range[0] === scope.block.range[0]
      && scope.block.parent.arguments[0].params
      && scope.block.parent.arguments[0].params.length > 1
    ) {
      return scope.block.parent.arguments[0].params[1].name === name;
    }
    scope = scope.upper;
  }
  return false;
}

function isInClassComponent(utils) {
  return utils.getParentES6Component() || utils.getParentES5Component();
}

/**
 * Checks if the node is `this.props`
 * @param {ASTNode|undefined} node
 * @returns {boolean}
 */
function isThisDotProps(node) {
  return !!node
    && node.type === 'MemberExpression'
    && unwrapTSAsExpression(node.object).type === 'ThisExpression'
    && node.property.name === 'props';
}

/**
 * Checks if the prop has spread operator.
 * @param {object} context
 * @param {ASTNode} node The AST node being marked.
 * @returns {Boolean} True if the prop has spread operator, false if not.
 */
function hasSpreadOperator(context, node) {
  const tokens = context.getSourceCode().getTokens(node);
  return tokens.length && tokens[0].value === '...';
}

/**
 * Checks if the node is a propTypes usage of the form `this.props.*`, `props.*`, `prevProps.*`, or `nextProps.*`.
 * @param {ASTNode} node
 * @param {Context} context
 * @param {Object} utils
 * @param {boolean} checkAsyncSafeLifeCycles
 * @returns {boolean}
 */
function isPropTypesUsageByMemberExpression(node, context, utils, checkAsyncSafeLifeCycles) {
  const unwrappedObjectNode = unwrapTSAsExpression(node.object);

  if (isInClassComponent(utils)) {
    // this.props.*
    if (isThisDotProps(unwrappedObjectNode)) {
      return true;
    }
    // props.* or prevProps.* or nextProps.*
    if (
      isCommonVariableNameForProps(unwrappedObjectNode.name)
      && (inLifeCycleMethod(context, checkAsyncSafeLifeCycles) || utils.inConstructor())
    ) {
      return true;
    }
    // this.setState((_, props) => props.*))
    if (isPropArgumentInSetStateUpdater(context, unwrappedObjectNode.name)) {
      return true;
    }
    return false;
  }
  // props.* in function component
  return unwrappedObjectNode.name === 'props' && !isAssignmentLHS(node);
}

/**
 * Retrieve the name of a property node
 * @param {ASTNode} node The AST node with the property.
 * @param {Context} context
 * @param {Object} utils
 * @param {boolean} checkAsyncSafeLifeCycles
 * @return {string|undefined} the name of the property or undefined if not found
 */
function getPropertyName(node, context, utils, checkAsyncSafeLifeCycles) {
  const property = node.property;
  if (property) {
    switch (property.type) {
      case 'Identifier':
        if (node.computed) {
          return '__COMPUTED_PROP__';
        }
        return property.name;
      case 'MemberExpression':
        return;
      case 'Literal':
        // Accept computed properties that are literal strings
        if (typeof property.value === 'string') {
          return property.value;
        }
        // Accept number as well but only accept props[123]
        if (typeof property.value === 'number') {
          if (isPropTypesUsageByMemberExpression(node, context, utils, checkAsyncSafeLifeCycles)) {
            return property.raw;
          }
        }
        // falls through
      default:
        if (node.computed) {
          return '__COMPUTED_PROP__';
        }
        break;
    }
  }
}

function usedPropTypesInstructions(context, components, utils) {
  const checkAsyncSafeLifeCycles = testReactVersion(context, '16.3.0');

  const propVariables = createPropVariables();
  const pushScope = propVariables.pushScope;
  const popScope = propVariables.popScope;

  /**
   * Mark a prop type as used
   * @param {ASTNode} node The AST node being marked.
   * @param {string[]} [parentNames]
   */
  function markPropTypesAsUsed(node, parentNames) {
    parentNames = parentNames || [];
    let type;
    let name;
    let allNames;
    let properties;
    switch (node.type) {
      case 'OptionalMemberExpression':
      case 'MemberExpression':
        name = getPropertyName(node, context, utils, checkAsyncSafeLifeCycles);
        if (name) {
          allNames = parentNames.concat(name);
          if (
            // Match props.foo.bar, don't match bar[props.foo]
            node.parent.type === 'MemberExpression'
            && node.parent.object === node
          ) {
            markPropTypesAsUsed(node.parent, allNames);
          }
          // Handle the destructuring part of `const {foo} = props.a.b`
          if (
            node.parent.type === 'VariableDeclarator'
            && node.parent.id.type === 'ObjectPattern'
          ) {
            node.parent.id.parent = node.parent; // patch for bug in eslint@4 in which ObjectPattern has no parent
            markPropTypesAsUsed(node.parent.id, allNames);
          }

          // const a = props.a
          if (
            node.parent.type === 'VariableDeclarator'
            && node.parent.id.type === 'Identifier'
          ) {
            propVariables.set(node.parent.id.name, allNames);
          }
          // Do not mark computed props as used.
          type = name !== '__COMPUTED_PROP__' ? 'direct' : null;
        }
        break;
      case 'ArrowFunctionExpression':
      case 'FunctionDeclaration':
      case 'FunctionExpression': {
        if (node.params.length === 0) {
          break;
        }
        type = 'destructuring';
        const propParam = isSetStateUpdater(node) ? node.params[1] : node.params[0];
        properties = propParam.type === 'AssignmentPattern'
          ? propParam.left.properties
          : propParam.properties;
        break;
      }
      case 'ObjectPattern':
        type = 'destructuring';
        properties = node.properties;
        break;
      case 'TSEmptyBodyFunctionExpression':
        break;
      default:
        throw new Error(`${node.type} ASTNodes are not handled by markPropTypesAsUsed`);
    }

    const component = components.get(utils.getParentComponent());
    const usedPropTypes = (component && component.usedPropTypes) || [];
    let ignoreUnusedPropTypesValidation = (component && component.ignoreUnusedPropTypesValidation) || false;

    switch (type) {
      case 'direct': {
        // Ignore Object methods
        if (name in Object.prototype) {
          break;
        }

        const reportedNode = node.property;
        usedPropTypes.push({
          name,
          allNames,
          node: reportedNode
        });
        break;
      }
      case 'destructuring': {
        for (let k = 0, l = (properties || []).length; k < l; k++) {
          if (hasSpreadOperator(context, properties[k]) || properties[k].computed) {
            ignoreUnusedPropTypesValidation = true;
            break;
          }
          const propName = getKeyValue(context, properties[k]);

          if (!propName || properties[k].type !== 'Property') {
            break;
          }

          usedPropTypes.push({
            allNames: parentNames.concat([propName]),
            name: propName,
            node: properties[k]
          });

          if (properties[k].value.type === 'ObjectPattern') {
            markPropTypesAsUsed(properties[k].value, parentNames.concat([propName]));
          } else if (properties[k].value.type === 'Identifier') {
            propVariables.set(propName, parentNames.concat(propName));
          }
        }
        break;
      }
    }

    components.set(component ? component.node : node, {
      usedPropTypes,
      ignoreUnusedPropTypesValidation
    });
  }

  /**
   * @param {ASTNode} node We expect either an ArrowFunctionExpression,
   *   FunctionDeclaration, or FunctionExpression
   */
  function markDestructuredFunctionArgumentsAsUsed(node) {
    const param = node.params && isSetStateUpdater(node) ? node.params[1] : node.params[0];

    const destructuring = param && (
      param.type === 'ObjectPattern'
      || ((param.type === 'AssignmentPattern') && (param.left.type === 'ObjectPattern'))
    );

    if (destructuring && (components.get(node) || components.get(node.parent))) {
      markPropTypesAsUsed(node);
    }
  }

  function handleSetStateUpdater(node) {
    if (!node.params || node.params.length < 2 || !isSetStateUpdater(node)) {
      return;
    }
    markPropTypesAsUsed(node);
  }

  /**
   * Handle both stateless functions and setState updater functions.
   * @param {ASTNode} node We expect either an ArrowFunctionExpression,
   *   FunctionDeclaration, or FunctionExpression
   */
  function handleFunctionLikeExpressions(node) {
    pushScope();
    handleSetStateUpdater(node);
    markDestructuredFunctionArgumentsAsUsed(node);
  }

  function handleCustomValidators(component) {
    const propTypes = component.declaredPropTypes;
    if (!propTypes) {
      return;
    }

    Object.keys(propTypes).forEach((key) => {
      const node = propTypes[key].node;

      if (node.value && isFunctionLikeExpression(node.value)) {
        markPropTypesAsUsed(node.value);
      }
    });
  }

  return {
    VariableDeclarator(node) {
      const unwrappedInitNode = unwrapTSAsExpression(node.init);

      // let props = this.props
      if (isThisDotProps(unwrappedInitNode) && isInClassComponent(utils) && node.id.type === 'Identifier') {
        propVariables.set(node.id.name, []);
      }

      // Only handles destructuring
      if (node.id.type !== 'ObjectPattern' || !unwrappedInitNode) {
        return;
      }

      // let {props: {firstname}} = this
      const propsProperty = node.id.properties.find((property) => (
        property.key
        && (property.key.name === 'props' || property.key.value === 'props')
      ));

      if (unwrappedInitNode.type === 'ThisExpression' && propsProperty && propsProperty.value.type === 'ObjectPattern') {
        markPropTypesAsUsed(propsProperty.value);
        return;
      }

      // let {props} = this
      if (unwrappedInitNode.type === 'ThisExpression' && propsProperty && propsProperty.value.name === 'props') {
        propVariables.set('props', []);
        return;
      }

      // let {firstname} = props
      if (
        isCommonVariableNameForProps(unwrappedInitNode.name)
        && (utils.getParentStatelessComponent() || isInLifeCycleMethod(node, checkAsyncSafeLifeCycles))
      ) {
        markPropTypesAsUsed(node.id);
        return;
      }

      // let {firstname} = this.props
      if (isThisDotProps(unwrappedInitNode) && isInClassComponent(utils)) {
        markPropTypesAsUsed(node.id);
        return;
      }

      // let {firstname} = thing, where thing is defined by const thing = this.props.**.*
      if (propVariables.get(unwrappedInitNode.name)) {
        markPropTypesAsUsed(node.id, propVariables.get(unwrappedInitNode.name));
      }
    },

    FunctionDeclaration: handleFunctionLikeExpressions,

    ArrowFunctionExpression: handleFunctionLikeExpressions,

    FunctionExpression: handleFunctionLikeExpressions,

    'FunctionDeclaration:exit': popScope,

    'ArrowFunctionExpression:exit': popScope,

    'FunctionExpression:exit': popScope,

    JSXSpreadAttribute(node) {
      const component = components.get(utils.getParentComponent());
      components.set(component ? component.node : node, {
        ignoreUnusedPropTypesValidation: true
      });
    },

    'MemberExpression, OptionalMemberExpression'(node) {
      if (isPropTypesUsageByMemberExpression(node, context, utils, checkAsyncSafeLifeCycles)) {
        markPropTypesAsUsed(node);
        return;
      }

      const propVariable = propVariables.get(unwrapTSAsExpression(node.object).name);
      if (propVariable) {
        markPropTypesAsUsed(node, propVariable);
      }
    },

    ObjectPattern(node) {
      // If the object pattern is a destructured props object in a lifecycle
      // method -- mark it for used props.
      if (isNodeALifeCycleMethod(node.parent.parent, checkAsyncSafeLifeCycles) && node.properties.length > 0) {
        markPropTypesAsUsed(node.parent);
      }
    },

    'Program:exit'() {
      const list = components.list();

      Object.keys(list).filter((component) => mustBeValidated(list[component])).forEach((component) => {
        handleCustomValidators(list[component]);
      });
    }
  };
}

var hasSymbols$1 = hasSymbols$7();
var GetIntrinsic$d = getIntrinsic;
var callBound$1 = callBound$b;

var $iterator = GetIntrinsic$d('%Symbol.iterator%', true);
var $stringSlice = callBound$1('String.prototype.slice');

var getIteratorMethod$1 = function getIteratorMethod(ES, iterable) {
	var usingIterator;
	if (hasSymbols$1) {
		usingIterator = ES.GetMethod(iterable, $iterator);
	} else if (ES.IsArray(iterable)) {
		usingIterator = function () {
			var i = -1;
			var arr = this; // eslint-disable-line no-invalid-this
			return {
				next: function () {
					i += 1;
					return {
						done: i >= arr.length,
						value: arr[i]
					};
				}
			};
		};
	} else if (ES.Type(iterable) === 'String') {
		usingIterator = function () {
			var i = 0;
			return {
				next: function () {
					var nextIndex = ES.AdvanceStringIndex(iterable, i, true);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		};
	}
	return usingIterator;
};

var isLeadingSurrogate$2 = function isLeadingSurrogate(charCode) {
	return typeof charCode === 'number' && charCode >= 0xD800 && charCode <= 0xDBFF;
};

var isTrailingSurrogate$2 = function isTrailingSurrogate(charCode) {
	return typeof charCode === 'number' && charCode >= 0xDC00 && charCode <= 0xDFFF;
};

var GetIntrinsic$c = getIntrinsic;

var $TypeError$b = GetIntrinsic$c('%TypeError%');
var $fromCharCode = GetIntrinsic$c('%String.fromCharCode%');

var isLeadingSurrogate$1 = isLeadingSurrogate$2;
var isTrailingSurrogate$1 = isTrailingSurrogate$2;

// https://262.ecma-international.org/11.0/#sec-utf16decodesurrogatepair

var UTF16DecodeSurrogatePair$1 = function UTF16DecodeSurrogatePair(lead, trail) {
	if (!isLeadingSurrogate$1(lead) || !isTrailingSurrogate$1(trail)) {
		throw new $TypeError$b('Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code');
	}
	// var cp = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
	return $fromCharCode(lead) + $fromCharCode(trail);
};

var GetIntrinsic$b = getIntrinsic;

var $TypeError$a = GetIntrinsic$b('%TypeError%');
var callBound = callBound$b;
var isLeadingSurrogate = isLeadingSurrogate$2;
var isTrailingSurrogate = isTrailingSurrogate$2;

var Type$7 = Type$k;
var UTF16DecodeSurrogatePair = UTF16DecodeSurrogatePair$1;

var $charAt = callBound('String.prototype.charAt');
var $charCodeAt = callBound('String.prototype.charCodeAt');

// https://262.ecma-international.org/11.0/#sec-codepointat

var CodePointAt$1 = function CodePointAt(string, position) {
	if (Type$7(string) !== 'String') {
		throw new $TypeError$a('Assertion failed: `string` must be a String');
	}
	var size = string.length;
	if (position < 0 || position >= size) {
		throw new $TypeError$a('Assertion failed: `position` must be >= 0, and < the length of `string`');
	}
	var first = $charCodeAt(string, position);
	var cp = $charAt(string, position);
	var firstIsLeading = isLeadingSurrogate(first);
	var firstIsTrailing = isTrailingSurrogate(first);
	if (!firstIsLeading && !firstIsTrailing) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': false
		};
	}
	if (firstIsTrailing || (position + 1 === size)) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': true
		};
	}
	var second = $charCodeAt(string, position + 1);
	if (!isTrailingSurrogate(second)) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': true
		};
	}

	return {
		'[[CodePoint]]': UTF16DecodeSurrogatePair(first, second),
		'[[CodeUnitCount]]': 2,
		'[[IsUnpairedSurrogate]]': false
	};
};

var GetIntrinsic$a = getIntrinsic;

var CodePointAt = CodePointAt$1;
var IsInteger = IsInteger$2;
var Type$6 = Type$k;

var MAX_SAFE_INTEGER = maxSafeInteger;

var $TypeError$9 = GetIntrinsic$a('%TypeError%');

// https://262.ecma-international.org/6.0/#sec-advancestringindex

var AdvanceStringIndex$1 = function AdvanceStringIndex(S, index, unicode) {
	if (Type$6(S) !== 'String') {
		throw new $TypeError$9('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError$9('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type$6(unicode) !== 'Boolean') {
		throw new $TypeError$9('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}
	var cp = CodePointAt(S, index);
	return index + cp['[[CodeUnitCount]]'];
};

var GetIntrinsic$9 = getIntrinsic;

var $TypeError$8 = GetIntrinsic$9('%TypeError%');

var IsPropertyKey$2 = IsPropertyKey$9;
var ToObject = ToObject$3;

/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

var GetV$2 = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey$2(P)) {
		throw new $TypeError$8('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

var GetIntrinsic$8 = getIntrinsic;

var $TypeError$7 = GetIntrinsic$8('%TypeError%');

var GetV$1 = GetV$2;
var IsCallable$2 = IsCallable$5;
var IsPropertyKey$1 = IsPropertyKey$9;

/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

var GetMethod$2 = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey$1(P)) {
		throw new $TypeError$7('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV$1(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable$2(func)) {
		throw new $TypeError$7(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

var GetIntrinsic$7 = getIntrinsic;

var $TypeError$6 = GetIntrinsic$7('%TypeError%');
var $asyncIterator = GetIntrinsic$7('%Symbol.asyncIterator%', true);

var inspect$1 = objectInspect;
var hasSymbols = hasSymbols$7();

var getIteratorMethod = getIteratorMethod$1;
var AdvanceStringIndex = AdvanceStringIndex$1;
var Call$3 = Call$5;
var GetMethod$1 = GetMethod$2;
var IsArray$1 = IsArray$6;
var Type$5 = Type$k;

// https://262.ecma-international.org/9.0/#sec-getiterator
var GetIterator$1 = function GetIterator(obj, hint, method) {
	var actualHint = hint;
	if (arguments.length < 2) {
		actualHint = 'sync';
	}
	if (actualHint !== 'sync' && actualHint !== 'async') {
		throw new $TypeError$6("Assertion failed: `hint` must be one of 'sync' or 'async', got " + inspect$1(hint));
	}

	var actualMethod = method;
	if (arguments.length < 3) {
		if (actualHint === 'async') {
			if (hasSymbols && $asyncIterator) {
				actualMethod = GetMethod$1(obj, $asyncIterator);
			}
			if (actualMethod === undefined) {
				throw new $TypeError$6("async from sync iterators aren't currently supported");
			}
		} else {
			actualMethod = getIteratorMethod(
				{
					AdvanceStringIndex: AdvanceStringIndex,
					GetMethod: GetMethod$1,
					IsArray: IsArray$1,
					Type: Type$5
				},
				obj
			);
		}
	}
	var iterator = Call$3(actualMethod, obj);
	if (Type$5(iterator) !== 'Object') {
		throw new $TypeError$6('iterator must return an object');
	}

	return iterator;

	// TODO: This should return an IteratorRecord
	/*
	var nextMethod = GetV(iterator, 'next');
	return {
		'[[Iterator]]': iterator,
		'[[NextMethod]]': nextMethod,
		'[[Done]]': false
	};
	*/
};

var GetIntrinsic$6 = getIntrinsic;

var $TypeError$5 = GetIntrinsic$6('%TypeError%');

var Call$2 = Call$5;
var GetMethod = GetMethod$2;
var IsCallable$1 = IsCallable$5;
var Type$4 = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

var IteratorClose$1 = function IteratorClose(iterator, completion) {
	if (Type$4(iterator) !== 'Object') {
		throw new $TypeError$5('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable$1(completion)) {
		throw new $TypeError$5('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call$2(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type$4(innerResult) !== 'Object') {
		throw new $TypeError$5('iterator .return must return an object');
	}

	return completionRecord;
};

var GetIntrinsic$5 = getIntrinsic;

var $TypeError$4 = GetIntrinsic$5('%TypeError%');

var Get$2 = Get$7;
var ToBoolean = ToBoolean$3;
var Type$3 = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

var IteratorComplete$1 = function IteratorComplete(iterResult) {
	if (Type$3(iterResult) !== 'Object') {
		throw new $TypeError$4('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get$2(iterResult, 'done'));
};

var GetIntrinsic$4 = getIntrinsic;

var $TypeError$3 = GetIntrinsic$4('%TypeError%');

var Call$1 = Call$5;
var IsArray = IsArray$6;
var GetV = GetV$2;
var IsPropertyKey = IsPropertyKey$9;

// https://ecma-international.org/ecma-262/6.0/#sec-invoke

var Invoke$1 = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError$3('Assertion failed: P must be a Property Key');
	}
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	if (!IsArray(argumentsList)) {
		throw new $TypeError$3('Assertion failed: optional `argumentsList`, if provided, must be a List');
	}
	var func = GetV(O, P);
	return Call$1(func, O, argumentsList);
};

var GetIntrinsic$3 = getIntrinsic;

var $TypeError$2 = GetIntrinsic$3('%TypeError%');

var Invoke = Invoke$1;
var Type$2 = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

var IteratorNext$1 = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type$2(result) !== 'Object') {
		throw new $TypeError$2('iterator next must return an object');
	}
	return result;
};

var IteratorComplete = IteratorComplete$1;
var IteratorNext = IteratorNext$1;

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

var IteratorStep$1 = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};

var GetIntrinsic$2 = getIntrinsic;

var $TypeError$1 = GetIntrinsic$2('%TypeError%');

var Get$1 = Get$7;
var Type$1 = Type$k;

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

var IteratorValue$1 = function IteratorValue(iterResult) {
	if (Type$1(iterResult) !== 'Object') {
		throw new $TypeError$1('Assertion failed: Type(iterResult) is not Object');
	}
	return Get$1(iterResult, 'value');
};

var inspect = objectInspect;

var GetIntrinsic$1 = getIntrinsic;

var $TypeError = GetIntrinsic$1('%TypeError%');

var Call = Call$5;
var Get = Get$7;
var GetIterator = GetIterator$1;
var IsCallable = IsCallable$5;
var IteratorClose = IteratorClose$1;
var IteratorStep = IteratorStep$1;
var IteratorValue = IteratorValue$1;
var Type = Type$k;

// https://262.ecma-international.org/10.0//#sec-add-entries-from-iterable

var AddEntriesFromIterable$1 = function AddEntriesFromIterable(target, iterable, adder) {
	if (!IsCallable(adder)) {
		throw new $TypeError('Assertion failed: `adder` is not callable');
	}
	if (iterable == null) {
		throw new $TypeError('Assertion failed: `iterable` is present, and not nullish');
	}
	var iteratorRecord = GetIterator(iterable);
	while (true) { // eslint-disable-line no-constant-condition
		var next = IteratorStep(iteratorRecord);
		if (!next) {
			return target;
		}
		var nextItem = IteratorValue(next);
		if (Type(nextItem) !== 'Object') {
			var error = new $TypeError('iterator next must return an Object, got ' + inspect(nextItem));
			return IteratorClose(
				iteratorRecord,
				function () { throw error; } // eslint-disable-line no-loop-func
			);
		}
		try {
			var k = Get(nextItem, '0');
			var v = Get(nextItem, '1');
			Call(adder, target, [k, v]);
		} catch (e) {
			return IteratorClose(
				iteratorRecord,
				function () { throw e; }
			);
		}
	}
};

var GetIntrinsic = getIntrinsic;

var $String = GetIntrinsic('%String%');

var ToPrimitive = ToPrimitive$2;
var ToString = ToString$2;

// https://ecma-international.org/ecma-262/6.0/#sec-topropertykey

var ToPropertyKey$1 = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

var AddEntriesFromIterable = AddEntriesFromIterable$1;
var CreateDataPropertyOrThrow = CreateDataPropertyOrThrow$2;
var RequireObjectCoercible = RequireObjectCoercible$4;
var ToPropertyKey = ToPropertyKey$1;

var adder = function addDataProperty(key, value) {
	var O = this; // eslint-disable-line no-invalid-this
	var propertyKey = ToPropertyKey(key);
	CreateDataPropertyOrThrow(O, propertyKey, value);
};

var implementation$2 = function fromEntries(iterable) {
	RequireObjectCoercible(iterable);

	return AddEntriesFromIterable({}, iterable, adder);
};

var implementation$1 = implementation$2;

var polyfill$1 = function getPolyfill() {
	return typeof Object.fromEntries === 'function' ? Object.fromEntries : implementation$1;
};

var getPolyfill$1 = polyfill$1;
var define$1 = defineProperties_1;

var shim$1 = function shimEntries() {
	var polyfill = getPolyfill$1();
	define$1(Object, { fromEntries: polyfill }, {
		fromEntries: function testEntries() {
			return Object.fromEntries !== polyfill;
		}
	});
	return polyfill;
};

var define = defineProperties_1;
var callBind = callBind$7.exports;

var implementation = implementation$2;
var getPolyfill = polyfill$1;
var shim = shim$1;

var polyfill = callBind(getPolyfill(), Object);

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

var object_fromentries = polyfill;

/**
 * @fileoverview Common defaultProps detection functionality.
 */

const QUOTES_REGEX = /^["']|["']$/g;

function defaultPropsInstructions(context, components, utils) {
  const sourceCode = context.getSourceCode();

  /**
   * Try to resolve the node passed in to a variable in the current scope. If the node passed in is not
   * an Identifier, then the node is simply returned.
   * @param   {ASTNode} node The node to resolve.
   * @returns {ASTNode|null} Return null if the value could not be resolved, ASTNode otherwise.
   */
  function resolveNodeValue(node) {
    if (node.type === 'Identifier') {
      return findVariableByName(context, node.name);
    }
    if (
      node.type === 'CallExpression'
      && isPropWrapperFunction(context, node.callee.name)
      && node.arguments && node.arguments[0]
    ) {
      return resolveNodeValue(node.arguments[0]);
    }
    return node;
  }

  /**
   * Extracts a DefaultProp from an ObjectExpression node.
   * @param   {ASTNode} objectExpression ObjectExpression node.
   * @returns {Object|string}            Object representation of a defaultProp, to be consumed by
   *                                     `addDefaultPropsToComponent`, or string "unresolved", if the defaultProps
   *                                     from this ObjectExpression can't be resolved.
   */
  function getDefaultPropsFromObjectExpression(objectExpression) {
    const hasSpread = objectExpression.properties.find((property) => property.type === 'ExperimentalSpreadProperty' || property.type === 'SpreadElement');

    if (hasSpread) {
      return 'unresolved';
    }

    return objectExpression.properties.map((defaultProp) => ({
      name: sourceCode.getText(defaultProp.key).replace(QUOTES_REGEX, ''),
      node: defaultProp
    }));
  }

  /**
   * Marks a component's DefaultProps declaration as "unresolved". A component's DefaultProps is
   * marked as "unresolved" if we cannot safely infer the values of its defaultProps declarations
   * without risking false negatives.
   * @param   {Object} component The component to mark.
   * @returns {void}
   */
  function markDefaultPropsAsUnresolved(component) {
    components.set(component.node, {
      defaultProps: 'unresolved'
    });
  }

  /**
   * Adds defaultProps to the component passed in.
   * @param   {ASTNode}         component    The component to add the defaultProps to.
   * @param   {Object[]|'unresolved'} defaultProps defaultProps to add to the component or the string "unresolved"
   *                                         if this component has defaultProps that can't be resolved.
   * @returns {void}
   */
  function addDefaultPropsToComponent(component, defaultProps) {
    // Early return if this component's defaultProps is already marked as "unresolved".
    if (component.defaultProps === 'unresolved') {
      return;
    }

    if (defaultProps === 'unresolved') {
      markDefaultPropsAsUnresolved(component);
      return;
    }

    const defaults = component.defaultProps || {};
    const newDefaultProps = Object.assign(
      {},
      defaults,
      object_fromentries(defaultProps.map((prop) => [prop.name, prop]))
    );

    components.set(component.node, {
      defaultProps: newDefaultProps
    });
  }

  return {
    MemberExpression(node) {
      const isDefaultProp = isDefaultPropsDeclaration(node);

      if (!isDefaultProp) {
        return;
      }

      // find component this defaultProps belongs to
      const component = utils.getRelatedComponent(node);
      if (!component) {
        return;
      }

      // e.g.:
      // MyComponent.propTypes = {
      //   foo: React.PropTypes.string.isRequired,
      //   bar: React.PropTypes.string
      // };
      //
      // or:
      //
      // MyComponent.propTypes = myPropTypes;
      if (node.parent.type === 'AssignmentExpression') {
        const expression = resolveNodeValue(node.parent.right);
        if (!expression || expression.type !== 'ObjectExpression') {
          // If a value can't be found, we mark the defaultProps declaration as "unresolved", because
          // we should ignore this component and not report any errors for it, to avoid false-positives
          // with e.g. external defaultProps declarations.
          if (isDefaultProp) {
            markDefaultPropsAsUnresolved(component);
          }

          return;
        }

        addDefaultPropsToComponent(component, getDefaultPropsFromObjectExpression(expression));

        return;
      }

      // e.g.:
      // MyComponent.propTypes.baz = React.PropTypes.string;
      if (node.parent.type === 'MemberExpression' && node.parent.parent
        && node.parent.parent.type === 'AssignmentExpression') {
        addDefaultPropsToComponent(component, [{
          name: node.parent.property.name,
          node: node.parent.parent
        }]);
      }
    },

    // e.g.:
    // class Hello extends React.Component {
    //   static get defaultProps() {
    //     return {
    //       name: 'Dean'
    //     };
    //   }
    //   render() {
    //     return <div>Hello {this.props.name}</div>;
    //   }
    // }
    MethodDefinition(node) {
      if (!node.static || node.kind !== 'get') {
        return;
      }

      if (!isDefaultPropsDeclaration(node)) {
        return;
      }

      // find component this propTypes/defaultProps belongs to
      const component = components.get(utils.getParentES6Component());
      if (!component) {
        return;
      }

      const returnStatement = utils.findReturnStatement(node);
      if (!returnStatement) {
        return;
      }

      const expression = resolveNodeValue(returnStatement.argument);
      if (!expression || expression.type !== 'ObjectExpression') {
        return;
      }

      addDefaultPropsToComponent(component, getDefaultPropsFromObjectExpression(expression));
    },

    // e.g.:
    // class Greeting extends React.Component {
    //   render() {
    //     return (
    //       <h1>Hello, {this.props.foo} {this.props.bar}</h1>
    //     );
    //   }
    //   static defaultProps = {
    //     foo: 'bar',
    //     bar: 'baz'
    //   };
    // }
    ClassProperty(node) {
      if (!(node.static && node.value)) {
        return;
      }

      const propName = getPropertyName$1(node);
      const isDefaultProp = propName === 'defaultProps' || propName === 'getDefaultProps';

      if (!isDefaultProp) {
        return;
      }

      // find component this propTypes/defaultProps belongs to
      const component = components.get(utils.getParentES6Component());
      if (!component) {
        return;
      }

      const expression = resolveNodeValue(node.value);
      if (!expression || expression.type !== 'ObjectExpression') {
        return;
      }

      addDefaultPropsToComponent(component, getDefaultPropsFromObjectExpression(expression));
    },

    // e.g.:
    // React.createClass({
    //   render: function() {
    //     return <div>{this.props.foo}</div>;
    //   },
    //   getDefaultProps: function() {
    //     return {
    //       foo: 'default'
    //     };
    //   }
    // });
    ObjectExpression(node) {
      // find component this propTypes/defaultProps belongs to
      const component = utils.isES5Component(node) && components.get(node);
      if (!component) {
        return;
      }

      // Search for the proptypes declaration
      node.properties.forEach((property) => {
        if (property.type === 'ExperimentalSpreadProperty' || property.type === 'SpreadElement') {
          return;
        }

        const isDefaultProp = isDefaultPropsDeclaration(property);

        if (isDefaultProp && property.value.type === 'FunctionExpression') {
          const returnStatement = utils.findReturnStatement(property);
          if (!returnStatement || returnStatement.argument.type !== 'ObjectExpression') {
            return;
          }

          addDefaultPropsToComponent(component, getDefaultPropsFromObjectExpression(returnStatement.argument));
        }
      });
    }
  };
}

/**
 * @fileoverview Utility class and functions for React components detection
 * @author Yannick Croissant
 */

function getId(node) {
  return node && node.range.join(':');
}

function usedPropTypesAreEquivalent(propA, propB) {
  if (propA.name === propB.name) {
    if (!propA.allNames && !propB.allNames) {
      return true;
    }
    if (Array.isArray(propA.allNames) && Array.isArray(propB.allNames) && propA.allNames.join('') === propB.allNames.join('')) {
      return true;
    }
    return false;
  }
  return false;
}

function mergeUsedPropTypes(propsList, newPropsList) {
  const propsToAdd = [];
  newPropsList.forEach((newProp) => {
    const newPropisAlreadyInTheList = propsList.some((prop) => usedPropTypesAreEquivalent(prop, newProp));
    if (!newPropisAlreadyInTheList) {
      propsToAdd.push(newProp);
    }
  });

  return propsList.concat(propsToAdd);
}

function isReturnsConditionalJSX(node, property, strict) {
  const returnsConditionalJSXConsequent = node[property]
    && node[property].type === 'ConditionalExpression'
    && isJSX(node[property].consequent);
  const returnsConditionalJSXAlternate = node[property]
    && node[property].type === 'ConditionalExpression'
    && isJSX(node[property].alternate);
  return strict
    ? (returnsConditionalJSXConsequent && returnsConditionalJSXAlternate)
    : (returnsConditionalJSXConsequent || returnsConditionalJSXAlternate);
}

function isReturnsLogicalJSX(node, property, strict) {
  const returnsLogicalJSXLeft = node[property]
    && node[property].type === 'LogicalExpression'
    && isJSX(node[property].left);
  const returnsLogicalJSXRight = node[property]
    && node[property].type === 'LogicalExpression'
    && isJSX(node[property].right);
  return strict
    ? (returnsLogicalJSXLeft && returnsLogicalJSXRight)
    : (returnsLogicalJSXLeft || returnsLogicalJSXRight);
}

function isReturnsSequentialJSX(node, property) {
  return node[property]
    && node[property].type === 'SequenceExpression'
    && isJSX(node[property].expressions[node[property].expressions.length - 1]);
}

const Lists = new WeakMap();

/**
 * Components
 */
class Components$1 {
  constructor() {
    Lists.set(this, {});
  }

  /**
   * Add a node to the components list, or update it if it's already in the list
   *
   * @param {ASTNode} node The AST node being added.
   * @param {Number} confidence Confidence in the component detection (0=banned, 1=maybe, 2=yes)
   * @returns {Object} Added component object
   */
  add(node, confidence) {
    const id = getId(node);
    const list = Lists.get(this);
    if (list[id]) {
      if (confidence === 0 || list[id].confidence === 0) {
        list[id].confidence = 0;
      } else {
        list[id].confidence = Math.max(list[id].confidence, confidence);
      }
      return list[id];
    }
    list[id] = {
      node,
      confidence
    };
    return list[id];
  }

  /**
   * Find a component in the list using its node
   *
   * @param {ASTNode} node The AST node being searched.
   * @returns {Object} Component object, undefined if the component is not found or has confidence value of 0.
   */
  get(node) {
    const id = getId(node);
    const item = Lists.get(this)[id];
    if (item && item.confidence >= 1) {
      return item;
    }
    return null;
  }

  /**
   * Update a component in the list
   *
   * @param {ASTNode} node The AST node being updated.
   * @param {Object} props Additional properties to add to the component.
   */
  set(node, props) {
    const list = Lists.get(this);
    let component = list[getId(node)];
    while (!component) {
      node = node.parent;
      if (!node) {
        return;
      }
      component = list[getId(node)];
    }

    Object.assign(
      component,
      props,
      {
        usedPropTypes: mergeUsedPropTypes(
          component.usedPropTypes || [],
          props.usedPropTypes || []
        )
      }
    );
  }

  /**
   * Return the components list
   * Components for which we are not confident are not returned
   *
   * @returns {Object} Components list
   */
  list() {
    const thisList = Lists.get(this);
    const list = {};
    const usedPropTypes = {};

    // Find props used in components for which we are not confident
    Object.keys(thisList).filter((i) => thisList[i].confidence < 2).forEach((i) => {
      let component = null;
      let node = null;
      node = thisList[i].node;
      while (!component && node.parent) {
        node = node.parent;
        // Stop moving up if we reach a decorator
        if (node.type === 'Decorator') {
          break;
        }
        component = this.get(node);
      }
      if (component) {
        const newUsedProps = (thisList[i].usedPropTypes || []).filter((propType) => !propType.node || propType.node.kind !== 'init');

        const componentId = getId(component.node);

        usedPropTypes[componentId] = mergeUsedPropTypes(usedPropTypes[componentId] || [], newUsedProps);
      }
    });

    // Assign used props in not confident components to the parent component
    Object.keys(thisList).filter((j) => thisList[j].confidence >= 2).forEach((j) => {
      const id = getId(thisList[j].node);
      list[j] = thisList[j];
      if (usedPropTypes[id]) {
        list[j].usedPropTypes = mergeUsedPropTypes(list[j].usedPropTypes || [], usedPropTypes[id]);
      }
    });
    return list;
  }

  /**
   * Return the length of the components list
   * Components for which we are not confident are not counted
   *
   * @returns {Number} Components list length
   */
  length() {
    const list = Lists.get(this);
    return Object.keys(list).filter((i) => list[i].confidence >= 2).length;
  }
}

function getWrapperFunctions(context, pragma) {
  const componentWrapperFunctions = context.settings.componentWrapperFunctions || [];

  // eslint-disable-next-line arrow-body-style
  return componentWrapperFunctions.map((wrapperFunction) => {
    return typeof wrapperFunction === 'string'
      ? {property: wrapperFunction}
      : Object.assign({}, wrapperFunction, {
        object: wrapperFunction.object === '<pragma>' ? pragma : wrapperFunction.object
      });
  }).concat([
    {property: 'forwardRef', object: pragma},
    {property: 'memo', object: pragma}
  ]);
}

function componentRule(rule, context) {
  const createClass = getCreateClassFromContext(context);
  const pragma = getFromContext(context);
  const sourceCode = context.getSourceCode();
  const components = new Components$1();
  const wrapperFunctions = getWrapperFunctions(context, pragma);

  // Utilities for component detection
  const utils = {

    /**
     * Check if the node is a React ES5 component
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node is a React ES5 component, false if not
     */
    isES5Component(node) {
      if (!node.parent) {
        return false;
      }
      return new RegExp(`^(${pragma}\\.)?${createClass}$`).test(sourceCode.getText(node.parent.callee));
    },

    /**
     * Check if the node is a React ES6 component
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node is a React ES6 component, false if not
     */
    isES6Component(node) {
      if (utils.isExplicitComponent(node)) {
        return true;
      }

      if (!node.superClass) {
        return false;
      }
      return new RegExp(`^(${pragma}\\.)?(Pure)?Component$`).test(sourceCode.getText(node.superClass));
    },

    /**
     * Check if the node is explicitly declared as a descendant of a React Component
     *
     * @param {ASTNode} node The AST node being checked (can be a ReturnStatement or an ArrowFunctionExpression).
     * @returns {Boolean} True if the node is explicitly declared as a descendant of a React Component, false if not
     */
    isExplicitComponent(node) {
      let comment;
      // Sometimes the passed node may not have been parsed yet by eslint, and this function call crashes.
      // Can be removed when eslint sets "parent" property for all nodes on initial AST traversal: https://github.com/eslint/eslint-scope/issues/27
      // eslint-disable-next-line no-warning-comments
      // FIXME: Remove try/catch when https://github.com/eslint/eslint-scope/issues/27 is implemented.
      try {
        comment = sourceCode.getJSDocComment(node);
      } catch (e) {
        comment = null;
      }

      if (comment === null) {
        return false;
      }

      const commentAst = doctrine.parse(comment.value, {
        unwrap: true,
        tags: ['extends', 'augments']
      });

      const relevantTags = commentAst.tags.filter((tag) => tag.name === 'React.Component' || tag.name === 'React.PureComponent');

      return relevantTags.length > 0;
    },

    /**
     * Checks to see if our component extends React.PureComponent
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if node extends React.PureComponent, false if not
     */
    isPureComponent(node) {
      if (node.superClass) {
        return new RegExp(`^(${pragma}\\.)?PureComponent$`).test(sourceCode.getText(node.superClass));
      }
      return false;
    },

    /**
     * Check if variable is destructured from pragma import
     *
     * @param {string} variable The variable name to check
     * @returns {Boolean} True if createElement is destructured from the pragma
     */
    isDestructuredFromPragmaImport(variable) {
      const variables = variablesInScope(context);
      const variableInScope = getVariable(variables, variable);
      if (variableInScope) {
        const latestDef = getLatestVariableDefinition(variableInScope);
        if (latestDef) {
          // check if latest definition is a variable declaration: 'variable = value'
          if (latestDef.node.type === 'VariableDeclarator' && latestDef.node.init) {
            // check for: 'variable = pragma.variable'
            if (
              latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'Identifier'
              && latestDef.node.init.object.name === pragma
            ) {
              return true;
            }
            // check for: '{variable} = pragma'
            if (
              latestDef.node.init.type === 'Identifier'
              && latestDef.node.init.name === pragma
            ) {
              return true;
            }

            // "require('react')"
            let requireExpression = null;

            // get "require('react')" from: "{variable} = require('react')"
            if (latestDef.node.init.type === 'CallExpression') {
              requireExpression = latestDef.node.init;
            }
            // get "require('react')" from: "variable = require('react').variable"
            if (
              !requireExpression
              && latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'CallExpression'
            ) {
              requireExpression = latestDef.node.init.object;
            }

            // check proper require.
            if (
              requireExpression
              && requireExpression.callee
              && requireExpression.callee.name === 'require'
              && requireExpression.arguments[0]
              && requireExpression.arguments[0].value === pragma.toLocaleLowerCase()
            ) {
              return true;
            }

            return false;
          }

          // latest definition is an import declaration: import {<variable>} from 'react'
          if (
            latestDef.parent
            && latestDef.parent.type === 'ImportDeclaration'
            && latestDef.parent.source.value === pragma.toLocaleLowerCase()
          ) {
            return true;
          }
        }
      }
      return false;
    },

    /**
     * Checks to see if node is called within createElement from pragma
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if createElement called from pragma
     */
    isCreateElement(node) {
      // match `React.createElement()`
      if (
        node
        && node.callee
        && node.callee.object
        && node.callee.object.name === pragma
        && node.callee.property
        && node.callee.property.name === 'createElement'
      ) {
        return true;
      }

      // match `createElement()`
      if (
        node
        && node.callee
        && node.callee.name === 'createElement'
        && this.isDestructuredFromPragmaImport('createElement')
      ) {
        return true;
      }

      return false;
    },

    /**
     * Check if we are in a class constructor
     * @return {boolean} true if we are in a class constructor, false if not
     */
    inConstructor() {
      let scope = context.getScope();
      while (scope) {
        if (scope.block && scope.block.parent && scope.block.parent.kind === 'constructor') {
          return true;
        }
        scope = scope.upper;
      }
      return false;
    },

    /**
     * Determine if the node is MemberExpression of `this.state`
     * @param {Object} node The node to process
     * @returns {Boolean}
     */
    isStateMemberExpression(node) {
      return node.type === 'MemberExpression' && node.object.type === 'ThisExpression' && node.property.name === 'state';
    },

    getReturnPropertyAndNode(ASTnode) {
      let property;
      let node = ASTnode;
      switch (node.type) {
        case 'ReturnStatement':
          property = 'argument';
          break;
        case 'ArrowFunctionExpression':
          property = 'body';
          if (node[property] && node[property].type === 'BlockStatement') {
            node = utils.findReturnStatement(node);
            property = 'argument';
          }
          break;
        default:
          node = utils.findReturnStatement(node);
          property = 'argument';
      }
      return {
        node,
        property
      };
    },

    /**
     * Check if the node is returning JSX
     *
     * @param {ASTNode} ASTnode The AST node being checked
     * @param {Boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
     * @returns {Boolean} True if the node is returning JSX, false if not
     */
    isReturningJSX(ASTnode, strict) {
      const nodeAndProperty = utils.getReturnPropertyAndNode(ASTnode);
      const node = nodeAndProperty.node;
      const property = nodeAndProperty.property;

      if (!node) {
        return false;
      }

      const returnsConditionalJSX = isReturnsConditionalJSX(node, property, strict);
      const returnsLogicalJSX = isReturnsLogicalJSX(node, property, strict);
      const returnsSequentialJSX = isReturnsSequentialJSX(node, property);

      const returnsJSX = node[property] && isJSX(node[property]);
      const returnsPragmaCreateElement = this.isCreateElement(node[property]);

      return !!(
        returnsConditionalJSX
        || returnsLogicalJSX
        || returnsSequentialJSX
        || returnsJSX
        || returnsPragmaCreateElement
      );
    },

    /**
     * Check if the node is returning null
     *
     * @param {ASTNode} ASTnode The AST node being checked
     * @returns {Boolean} True if the node is returning null, false if not
     */
    isReturningNull(ASTnode) {
      const nodeAndProperty = utils.getReturnPropertyAndNode(ASTnode);
      const property = nodeAndProperty.property;
      const node = nodeAndProperty.node;

      if (!node) {
        return false;
      }

      return node[property] && node[property].value === null;
    },

    /**
     * Check if the node is returning JSX or null
     *
     * @param {ASTNode} ASTNode The AST node being checked
     * @param {Boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
     * @returns {Boolean} True if the node is returning JSX or null, false if not
     */
    isReturningJSXOrNull(ASTNode, strict) {
      return utils.isReturningJSX(ASTNode, strict) || utils.isReturningNull(ASTNode);
    },

    getPragmaComponentWrapper(node) {
      let isPragmaComponentWrapper;
      let currentNode = node;
      let prevNode;
      do {
        currentNode = currentNode.parent;
        isPragmaComponentWrapper = this.isPragmaComponentWrapper(currentNode);
        if (isPragmaComponentWrapper) {
          prevNode = currentNode;
        }
      } while (isPragmaComponentWrapper);

      return prevNode;
    },

    getComponentNameFromJSXElement(node) {
      if (node.type !== 'JSXElement') {
        return null;
      }
      if (node.openingElement && node.openingElement.name && node.openingElement.name.name) {
        return node.openingElement.name.name;
      }
      return null;
    },

    /**
     * Getting the first JSX element's name.
     * @param {object} node
     * @returns {string | null}
     */
    getNameOfWrappedComponent(node) {
      if (node.length < 1) {
        return null;
      }
      const body = node[0].body;
      if (!body) {
        return null;
      }
      if (body.type === 'JSXElement') {
        return this.getComponentNameFromJSXElement(body);
      }
      if (body.type === 'BlockStatement') {
        const jsxElement = body.body.find((item) => item.type === 'ReturnStatement');
        return jsxElement
          && jsxElement.argument
          && this.getComponentNameFromJSXElement(jsxElement.argument);
      }
      return null;
    },

    /**
     * Get the list of names of components created till now
     * @returns {string | boolean}
     */
    getDetectedComponents() {
      const list = components.list();
      return object_values(list).filter((val) => {
        if (val.node.type === 'ClassDeclaration') {
          return true;
        }
        if (
          val.node.type === 'ArrowFunctionExpression'
          && val.node.parent
          && val.node.parent.type === 'VariableDeclarator'
          && val.node.parent.id
        ) {
          return true;
        }
        return false;
      }).map((val) => {
        if (val.node.type === 'ArrowFunctionExpression') return val.node.parent.id.name;
        return val.node.id && val.node.id.name;
      });
    },

    /**
     * It will check wheater memo/forwardRef is wrapping existing component or
     * creating a new one.
     * @param {object} node
     * @returns {boolean}
     */
    nodeWrapsComponent(node) {
      const childComponent = this.getNameOfWrappedComponent(node.arguments);
      const componentList = this.getDetectedComponents();
      return !!childComponent && arrayIncludes(componentList, childComponent);
    },

    isPragmaComponentWrapper(node) {
      if (!node || node.type !== 'CallExpression') {
        return false;
      }

      return wrapperFunctions.some((wrapperFunction) => {
        if (node.callee.type === 'MemberExpression') {
          return wrapperFunction.object
            && wrapperFunction.object === node.callee.object.name
            && wrapperFunction.property === node.callee.property.name
            && !this.nodeWrapsComponent(node);
        }
        return wrapperFunction.property === node.callee.name
          && (!wrapperFunction.object
            // Functions coming from the current pragma need special handling
            || (wrapperFunction.object === pragma && this.isDestructuredFromPragmaImport(node.callee.name))
          );
      });
    },

    /**
     * Find a return statment in the current node
     *
     * @param {ASTNode} ASTnode The AST node being checked
     */
    findReturnStatement: findReturnStatement,

    /**
     * Get the parent component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentComponent() {
      return (
        utils.getParentES6Component()
        || utils.getParentES5Component()
        || utils.getParentStatelessComponent()
      );
    },

    /**
     * Get the parent ES5 component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentES5Component() {
      let scope = context.getScope();
      while (scope) {
        const node = scope.block && scope.block.parent && scope.block.parent.parent;
        if (node && utils.isES5Component(node)) {
          return node;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get the parent ES6 component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentES6Component() {
      let scope = context.getScope();
      while (scope && scope.type !== 'class') {
        scope = scope.upper;
      }
      const node = scope && scope.block;
      if (!node || !utils.isES6Component(node)) {
        return null;
      }
      return node;
    },

    /**
     * @param {ASTNode} node
     * @returns {boolean}
     */
    isInAllowedPositionForComponent(node) {
      switch (node.parent.type) {
        case 'VariableDeclarator':
        case 'AssignmentExpression':
        case 'Property':
        case 'ReturnStatement':
        case 'ExportDefaultDeclaration':
        case 'ArrowFunctionExpression': {
          return true;
        }
        case 'SequenceExpression': {
          return utils.isInAllowedPositionForComponent(node.parent)
            && node === node.parent.expressions[node.parent.expressions.length - 1];
        }
        default:
          return false;
      }
    },

    /**
     * Get node if node is a stateless component, or node.parent in cases like
     * `React.memo` or `React.forwardRef`. Otherwise returns `undefined`.
     * @param {ASTNode} node
     * @returns {ASTNode | undefined}
     */
    getStatelessComponent(node) {
      if (
        node.type === 'FunctionDeclaration'
        && (!node.id || isFirstLetterCapitalized(node.id.name))
        && utils.isReturningJSXOrNull(node)
      ) {
        return node;
      }

      if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
        if (node.parent.type === 'VariableDeclarator' && utils.isReturningJSXOrNull(node)) {
          if (isFirstLetterCapitalized(node.parent.id.name)) {
            return node;
          }
          return undefined;
        }
        if (utils.isInAllowedPositionForComponent(node) && utils.isReturningJSXOrNull(node)) {
          if (!node.id || isFirstLetterCapitalized(node.id.name)) {
            return node;
          }
          return undefined;
        }

        // Case like `React.memo(() => <></>)` or `React.forwardRef(...)`
        const pragmaComponentWrapper = utils.getPragmaComponentWrapper(node);
        if (pragmaComponentWrapper) {
          return pragmaComponentWrapper;
        }
      }

      return undefined;
    },

    /**
     * Get the parent stateless component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentStatelessComponent() {
      let scope = context.getScope();
      while (scope) {
        const node = scope.block;
        const statelessComponent = utils.getStatelessComponent(node);
        if (statelessComponent) {
          return statelessComponent;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get the related component from a node
     *
     * @param {ASTNode} node The AST node being checked (must be a MemberExpression).
     * @returns {ASTNode} component node, null if we cannot find the component
     */
    getRelatedComponent(node) {
      let i;
      let j;
      let k;
      let l;
      let componentNode;
      // Get the component path
      const componentPath = [];
      while (node) {
        if (node.property && node.property.type === 'Identifier') {
          componentPath.push(node.property.name);
        }
        if (node.object && node.object.type === 'Identifier') {
          componentPath.push(node.object.name);
        }
        node = node.object;
      }
      componentPath.reverse();
      const componentName = componentPath.slice(0, componentPath.length - 1).join('.');

      // Find the variable in the current scope
      const variableName = componentPath.shift();
      if (!variableName) {
        return null;
      }
      let variableInScope;
      const variables = variablesInScope(context);
      for (i = 0, j = variables.length; i < j; i++) {
        if (variables[i].name === variableName) {
          variableInScope = variables[i];
          break;
        }
      }
      if (!variableInScope) {
        return null;
      }

      // Try to find the component using variable references
      const refs = variableInScope.references;
      refs.some((ref) => {
        let refId = ref.identifier;
        if (refId.parent && refId.parent.type === 'MemberExpression') {
          refId = refId.parent;
        }
        if (sourceCode.getText(refId) !== componentName) {
          return false;
        }
        if (refId.type === 'MemberExpression') {
          componentNode = refId.parent.right;
        } else if (
          refId.parent
          && refId.parent.type === 'VariableDeclarator'
          && refId.parent.init
          && refId.parent.init.type !== 'Identifier'
        ) {
          componentNode = refId.parent.init;
        }
        return true;
      });

      if (componentNode) {
        // Return the component
        return components.add(componentNode, 1);
      }

      // Try to find the component using variable declarations
      const defs = variableInScope.defs;
      const defInScope = defs.find((def) => (
        def.type === 'ClassName'
        || def.type === 'FunctionName'
        || def.type === 'Variable'
      ));
      if (!defInScope || !defInScope.node) {
        return null;
      }
      componentNode = defInScope.node.init || defInScope.node;

      // Traverse the node properties to the component declaration
      for (i = 0, j = componentPath.length; i < j; i++) {
        if (!componentNode.properties) {
          continue; // eslint-disable-line no-continue
        }
        for (k = 0, l = componentNode.properties.length; k < l; k++) {
          if (componentNode.properties[k].key && componentNode.properties[k].key.name === componentPath[i]) {
            componentNode = componentNode.properties[k];
            break;
          }
        }
        if (!componentNode || !componentNode.value) {
          return null;
        }
        componentNode = componentNode.value;
      }

      // Return the component
      return components.add(componentNode, 1);
    }
  };

  // Component detection instructions
  const detectionInstructions = {
    CallExpression(node) {
      if (!utils.isPragmaComponentWrapper(node)) {
        return;
      }
      if (node.arguments.length > 0 && isFunctionLikeExpression(node.arguments[0])) {
        components.add(node, 2);
      }
    },

    ClassExpression(node) {
      if (!utils.isES6Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    ClassDeclaration(node) {
      if (!utils.isES6Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    ClassProperty(node) {
      node = utils.getParentComponent();
      if (!node) {
        return;
      }
      components.add(node, 2);
    },

    ObjectExpression(node) {
      if (!utils.isES5Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    FunctionExpression(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      const component = utils.getParentComponent();
      if (
        !component
        || (component.parent && component.parent.type === 'JSXExpressionContainer')
      ) {
        // Ban the node if we cannot find a parent component
        components.add(node, 0);
        return;
      }
      components.add(component, 1);
    },

    FunctionDeclaration(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      node = utils.getParentComponent();
      if (!node) {
        return;
      }
      components.add(node, 1);
    },

    ArrowFunctionExpression(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      const component = utils.getParentComponent();
      if (
        !component
        || (component.parent && component.parent.type === 'JSXExpressionContainer')
      ) {
        // Ban the node if we cannot find a parent component
        components.add(node, 0);
        return;
      }
      if (component.expression && utils.isReturningJSX(component)) {
        components.add(component, 2);
      } else {
        components.add(component, 1);
      }
    },

    ThisExpression(node) {
      const component = utils.getParentComponent();
      if (!component || !/Function/.test(component.type) || !node.parent.property) {
        return;
      }
      // Ban functions accessing a property on a ThisExpression
      components.add(node, 0);
    },

    ReturnStatement(node) {
      if (!utils.isReturningJSX(node)) {
        return;
      }
      node = utils.getParentComponent();
      if (!node) {
        const scope = context.getScope();
        components.add(scope.block, 1);
        return;
      }
      components.add(node, 2);
    }
  };

  // Update the provided rule instructions to add the component detection
  const ruleInstructions = rule(context, components, utils);
  const updatedRuleInstructions = Object.assign({}, ruleInstructions);
  const propTypesInstructions$1 = propTypesInstructions(context, components, utils);
  const usedPropTypesInstructions$1 = usedPropTypesInstructions(context, components, utils);
  const defaultPropsInstructions$1 = defaultPropsInstructions(context, components, utils);
  const allKeys = new Set(Object.keys(detectionInstructions).concat(
    Object.keys(propTypesInstructions$1),
    Object.keys(usedPropTypesInstructions$1),
    Object.keys(defaultPropsInstructions$1)
  ));

  allKeys.forEach((instruction) => {
    updatedRuleInstructions[instruction] = (node) => {
      if (instruction in detectionInstructions) {
        detectionInstructions[instruction](node);
      }
      if (instruction in propTypesInstructions$1) {
        propTypesInstructions$1[instruction](node);
      }
      if (instruction in usedPropTypesInstructions$1) {
        usedPropTypesInstructions$1[instruction](node);
      }
      if (instruction in defaultPropsInstructions$1) {
        defaultPropsInstructions$1[instruction](node);
      }
      if (ruleInstructions[instruction]) {
        return ruleInstructions[instruction](node);
      }
    };
  });

  // Return the updated rule instructions
  return updatedRuleInstructions;
}

var Components$2 = Object.assign(Components$1, {
  detect(rule) {
    return componentRule.bind(this, rule);
  }
});

var Components$3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': Components$2
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(Components$3);

function docsUrl$1(ruleName) {
  return `https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules/${ruleName}.md`;
}

var docsUrl$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': docsUrl$1
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(docsUrl$2);

/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */

// As for exceptions for props.children or props.className (and alike) look at
// https://github.com/yannickcr/eslint-plugin-react/issues/7

const Components = require$$0.default;
const docsUrl = require$$1.default;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var shouldSkipUpdate = {
  meta: {
    docs: {
      description: 'Prevent missing props validation in a React component definition',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('should-skip-update')
    },

    messages: {
      missingPropType: '\'{{name}}\' is missing in shouldSkipUpdate validation',
      missingFromShouldSkipUpdateDependencies: '\'{{name}}\' is missing in shouldSkipUpdate validation',
      missingShouldSkipUpdateDependency: 'shouldSkipUpdate has a missing dependency: \'{{name}}\'.',
    },

    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        customValidators: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        skipUndeclared: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components) => {
    const configuration = context.options[0] || {};
    const ignored = configuration.ignore || [];
    const skipUndeclared = configuration.skipUndeclared || false;

    /**
     * Checks if the prop is ignored
     * @param {String} name Name of the prop to check.
     * @returns {Boolean} True if the prop is ignored, false if not.
     */
    function isIgnored(name) {
      return ignored.indexOf(name) !== -1;
    }

    /**
     * Checks if the component must be validated
     * @param {Object} component The component to process
     * @returns {Boolean} True if the component must be validated, false if not.
     */
    function mustBeValidated(component) {
      const isSkippedByConfig = skipUndeclared && typeof component.declaredPropTypes === 'undefined';
      return Boolean(
        component
        && component.usedPropTypes
        && !component.ignorePropsValidation
        && !isSkippedByConfig
      );
    }

    function reportUndeclaredSkipUpdateArguments(component) {
      // console.info(component.node.parent.body)
      if (!component.node.parent.body) return
      const declaredDependenciesFunc = component.node.parent.body.reverse()[0];
      if (!declaredDependenciesFunc.declaration.arguments[1]) return
      const declaredDependencies = declaredDependenciesFunc.declaration.arguments[1].arguments[0].elements.map((e) => e.value);
      if (!declaredDependenciesFunc || !declaredDependencies) return
      let declaredNames = Array.from(new Set(component.usedPropTypes.flatMap((p) => {
        const names = [];
        p.allNames.reduce((sum, ins) => {
          const new_sum = [sum, ins].filter((n) => n).join('.');
          names.push(new_sum);
          return new_sum
        }, '');
        return names
      }))).sort();

      const ignoredDeclaredNames = declaredNames.filter((n) => {
        const childrenNames = declaredNames.filter((nn) => nn.startsWith(n + '.'));
        return !childrenNames.every((nn) => declaredNames.some((nnn) => nn === nnn.value))
      });

      const undeclareds = component.usedPropTypes.filter((propType) => (
        propType.node
        && !isIgnored(propType.allNames[0])
        && !ignoredDeclaredNames.includes(propType.allNames.join('.'))
        && !declaredDependencies.some((d) => {
          let declared = false;
          propType.allNames.reduce((sum, ins) => {
            const new_sum = [sum, ins].filter((n) => n).join('.');
            if (d === new_sum) declared = true;
            return new_sum
          }, '');
          return declared
        })
      ));


      undeclareds.forEach((propType) => {
        context.report({
          node: propType.node,
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {
            name: propType.allNames.join('.').replace(/\.__COMPUTED_PROP__/g, '[]')
          }
        });
        context.report({
          node: declaredDependenciesFunc.declaration.arguments[1].arguments[0],
          messageId: 'missingShouldSkipUpdateDependency',
          data: {
            name: propType.allNames.join('.').replace(/\.__COMPUTED_PROP__/g, '[]')
          }
        });
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'Program:exit'() {
        const list = components.list();
        // Report undeclared proptypes for all classes

        Object.keys(list).filter((component) => mustBeValidated(list[component])).forEach((component) => {
          reportUndeclaredSkipUpdateArguments(list[component]);
        });
        // Object.keys(list).filter((component) => mustBeValidated(list[component])).forEach((component) => {
        //   reportUndeclaredPropTypes(list[component]);
        // });
      }
    };
  })
};

var eslint = {
	rules: {
		'dependencies': shouldSkipUpdate,
	},
	configs: {
		recommended: {
			plugins: ['should-skip-update'],
			rules: {
				'dependencies': 1,
			},
		}
	}
};

module.exports = eslint;
