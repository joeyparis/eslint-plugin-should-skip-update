/**
 * @fileoverview Utility functions for AST
 */

import escapeRegExp from 'escape-string-regexp';

const anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/u;
const anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/u;

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
    for (; i >= 0; i -= 1) {
      if (nodes[i].type === 'ReturnStatement') {
        return nodes[i];
      }
      if (nodes[i].type === 'SwitchStatement') {
        let j = nodes[i].cases.length - 1;
        for (; j >= 0; j -= 1) {
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
function getPropertyName(node) {
  const nameNode = getPropertyNameNode(node);
  return nameNode ? nameNode.name : '';
}

/**
 * Get properties for a given AST node
 * @param {ASTNode} node The AST node being checked.
 * @returns {Array} Properties array.
 */
function getComponentProperties(node) {
  switch (node.type) {
    case 'ClassDeclaration':
    case 'ClassExpression':
      return node.body.body;
    case 'ObjectExpression':
      return node.properties;
    default:
      return [];
  }
}

/**
 * Gets the first node in a line from the initial node, excluding whitespace.
 * @param {Object} context The node to check
 * @param {ASTNode} node The node to check
 * @return {ASTNode} the first node in the line
 */
function getFirstNodeInLine(context, node) {
  const sourceCode = context.getSourceCode();
  let token = node;
  let lines;
  do {
    token = sourceCode.getTokenBefore(token);
    lines = token.type === 'JSXText'
      ? token.value.split('\n')
      : null;
  } while (
    token.type === 'JSXText'
        && /^\s*$/.test(lines[lines.length - 1])
  );
  return token;
}

/**
 * Checks if the node is the first in its line, excluding whitespace.
 * @param {Object} context The node to check
 * @param {ASTNode} node The node to check
 * @return {Boolean} true if it's the first node in its line
 */
function isNodeFirstInLine(context, node) {
  const token = getFirstNodeInLine(context, node);
  const startLine = node.loc.start.line;
  const endLine = token ? token.loc.end.line : -1;
  return startLine !== endLine;
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
// function isFunction(node) {
//   return node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
// }

/**
 * Checks whether a given node is a function node or not.
 * The following types are function nodes:
 *
 * - ArrowFunctionExpression
 * - FunctionDeclaration
 * - FunctionExpression
 * @param {ASTNode|null} node A node to check.
 * @returns {boolean} `true` if the node is a function node.
 */
function isFunction(node) {
  return Boolean(node && anyFunctionPattern.test(node.type));
}

/**
 * Checks if the node is a class.
 * @param {ASTNode} node The node to check
 * @return {Boolean} true if it's a class
 */
function isClass(node) {
  return node.type === 'ClassDeclaration' || node.type === 'ClassExpression';
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

/* Borrowed from eslint */

/**
 * Checks whether a given node is a loop node or not.
 * The following types are loop nodes:
 *
 * - DoWhileStatement
 * - ForInStatement
 * - ForOfStatement
 * - ForStatement
 * - WhileStatement
 * @param {ASTNode|null} node A node to check.
 * @returns {boolean} `true` if the node is a loop node.
 */
function isLoop(node) {
  return Boolean(node && anyLoopPattern.test(node.type));
}

/**
 * Checks whether the given node is in a loop or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is in a loop.
 */
function isInLoop(node) {
  for (let currentNode = node; currentNode && !isFunction(currentNode); currentNode = currentNode.parent) {
    if (isLoop(currentNode)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds a function node from ancestors of a node.
 * @param {ASTNode} node A start node to find.
 * @returns {Node|null} A found function node.
 */
function getUpperFunction(node) {
  for (let currentNode = node; currentNode; currentNode = currentNode.parent) {
    if (anyFunctionPattern.test(currentNode.type)) {
      return currentNode;
    }
  }
  return null;
}

/**
* Get the `loc` object of a given name in a `/*globals` directive comment.
* @param {SourceCode} sourceCode The source code to convert index to loc.
* @param {Comment} comment The `/*globals` directive comment which include the name.
* @param {string} name The name to find.
* @returns {SourceLocation} The `loc` object.
*/
function getNameLocationInGlobalDirectiveComment(sourceCode, comment, name) {
  const namePattern = new RegExp(`[\\s,]${escapeRegExp(name)}(?:$|[\\s,:])`, 'gu');

  // To ignore the first text "global".
  namePattern.lastIndex = comment.value.indexOf('global') + 6;

  // Search a given variable name.
  const match = namePattern.exec(comment.value);

  // Convert the index to loc.
  const start = sourceCode.getLocFromIndex(
    comment.range[0]
      + '/*'.length
      + (match ? match.index + 1 : 0)
  );
  const end = {
    line: start.line,
    column: start.column + (match ? name.length : 1)
  };

  return {start, end};
}

export {
  findReturnStatement,
  getFirstNodeInLine,
  getPropertyName,
  getPropertyNameNode,
  getComponentProperties,
  getKeyValue,
  isAssignmentLHS,
  isClass,
  isFunction,
  isFunctionLikeExpression,
  isNodeFirstInLine,
  unwrapTSAsExpression,
  isTSTypeReference,
  isTSTypeAnnotation,
  isTSTypeLiteral,
  isTSIntersectionType,
  isTSInterfaceHeritage,
  isTSInterfaceDeclaration,
  isTSTypeAliasDeclaration,
  isTSParenthesizedType,
  isTSFunctionType,
  isTSTypeQuery,
  isTSTypeParameterInstantiation,
  isInLoop,
  getUpperFunction,
  getNameLocationInGlobalDirectiveComment
};
