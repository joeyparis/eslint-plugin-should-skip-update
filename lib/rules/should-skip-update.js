/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */

// As for exceptions for props.children or props.className (and alike) look at
// https://github.com/yannickcr/eslint-plugin-react/issues/7
// const equal = require('fast-deep-equal/es6/react');
// const equal = require('../util/equal');
const { circularDeepEqual } = require('fast-equals')
const uniqBy = require('lodash/uniqBy')

const Components = require('../util/Components').default;
const docsUrl = require('../util/docsUrl').default;
const { variablesInScope } = require('../util/variable')
const { create } = require('../util/no-unused-vars')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// function getAllFuncs(toCheck) {
//   let props = [];
//   let obj = toCheck;
//   do {
//     props = props.concat(Object.getOwnPropertyNames(obj));
//   } while (obj = Object.getPrototypeOf(obj));

//   return props.sort().filter((e, i, arr) => {
//     if (e != arr[i + 1] && typeof toCheck[e] === 'function') return true;
//   });
// }

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'verifies the list of dependencies for shouldSkipUpdate',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('should-skip-update')
    },

    messages: {
      missingFromShouldSkipUpdateDependencies: '\'{{name}}\' is missing in shouldSkipUpdate validation',
      missingShouldSkipUpdateDependency: 'shouldSkipUpdate has a missing dependency: \'{{name}}\'.',
      missingShouldSkipUpdateDependencySuggestion: 'Update the dependencies array to be: [\'{{name}}\']',
      missingShouldSkipUpdateDependencies: 'shouldSkipUpdate must be passed a dependency array.',
      extraShouldSkipUpdateDependency: 'shouldSkipUpdate has an extra dependency: \'{{name}}\'.'
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
        },
        ignoreExtra: {
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
    const ignoreExtra = configuration.ignoreExtra || false

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

    /**
     * Internal: Checks if the prop is declared
     * @param {Object} declaredPropTypes Description of propTypes declared in the current component
     * @param {String[]} keyList Dot separated name of the prop to check.
     * @returns {Boolean} True if the prop is declared, false if not.
     */
    // function internalIsDeclaredInComponent(declaredPropTypes, keyList) {
    //   for (let i = 0, j = keyList.length; i < j; i++) {
    //     const key = keyList[i];
    //     const propType = (
    //       declaredPropTypes && (
    //         // Check if this key is declared
    //         (declaredPropTypes[key] // If not, check if this type accepts any key
    //         || declaredPropTypes.__ANY_KEY__) // eslint-disable-line no-underscore-dangle
    //       )
    //     );

    //     if (!propType) {
    //       // If it's a computed property, we can't make any further analysis, but is valid
    //       return key === '__COMPUTED_PROP__';
    //     }
    //     if (typeof propType === 'object' && !propType.type) {
    //       return true;
    //     }
    //     // Consider every children as declared
    //     if (propType.children === true || propType.containsUnresolvedSpread || propType.containsIndexers) {
    //       return true;
    //     }
    //     if (propType.acceptedProperties) {
    //       return key in propType.acceptedProperties;
    //     }
    //     if (propType.type === 'union') {
    //       // If we fall in this case, we know there is at least one complex type in the union
    //       if (i + 1 >= j) {
    //         // this is the last key, accept everything
    //         return true;
    //       }
    //       // non trivial, check all of them
    //       const unionTypes = propType.children;
    //       const unionPropType = {};
    //       for (let k = 0, z = unionTypes.length; k < z; k++) {
    //         unionPropType[key] = unionTypes[k];
    //         const isValid = internalIsDeclaredInComponent(
    //           unionPropType,
    //           keyList.slice(i)
    //         );
    //         if (isValid) {
    //           return true;
    //         }
    //       }

    //       // every possible union were invalid
    //       return false;
    //     }
    //     declaredPropTypes = propType.children;
    //   }
    //   return true;
    // }

    /**
     * Checks if the prop is declared
     * @param {ASTNode} node The AST node being checked.
     * @param {String[]} names List of names of the prop to check.
     * @returns {Boolean} True if the prop is declared, false if not.
     */
    // function isDeclaredInComponent(node, names) {
    //   while (node) {
    //     const component = components.get(node);

    //     const isDeclared = component && component.confidence === 2
    //       && internalIsDeclaredInComponent(component.declaredPropTypes || {}, names);

    //     if (isDeclared) {
    //       return true;
    //     }

    //     node = node.parent;
    //   }
    //   return false;
    // }

    const isMemo = (node, originalName) => {
      const expressionDeclaration = node.expression || node.declaration || node.init;

      if (expressionDeclaration && (expressionDeclaration.callee || expressionDeclaration.right)) {
        const callee = expressionDeclaration.callee || expressionDeclaration.right.callee

        if (!callee) return false

        const name = callee.name || callee.property?.name;
        if (!originalName) {
          return name === 'memo'
        }

        const firstArg = expressionDeclaration.arguments?.[0]
        return name === 'memo' && (firstArg?.name === originalName || firstArg?.type !== 'Identifier' /*=== 'ArrowFunctionExpression'*/);
      }
      return false;
    };

    function isDeclaredInFunction(node, name) {
      // let name;
      // if (node.id || node.parent.id) {
      //   name = node.id ? node.id.name : node.parent.id.name;
      // }

      while (node) {
        if (node.body) {
          if (typeof node.body.find === 'function') {
            const memoFuncs = node.body.filter((n) => isMemo(n));
            const memoFunc = memoFuncs.length === 1 ? memoFuncs[0] : node.body.find((n) => isMemo(n, name));
            if (memoFunc && memoFunc.expression && memoFunc.expression.right) return memoFunc.expression.right
            if (memoFunc) return memoFunc.expression || memoFunc.declaration || node.init;
          // } else if (isMemo(node.body)) { //
          //   return node.body.expression || node.body.declaration || node.init;
          }
        } else if (node.init && isMemo(node)) {
          return node.init;
        }

        node = node.parent;
      }
    }

    function reportUndeclaredSkipUpdateArguments(component, unusedVars) {
      const componentName = component.node.id?.name || component.node.parent?.id?.name || component.node.parent?.parent?.id?.name
      const memoFunc = isDeclaredInFunction(component.node, componentName);
      if (!memoFunc) return;

      const memoComponentName = memoFunc.arguments[0].name

      if (memoComponentName && componentName && memoComponentName !== componentName) return

      const shouldSkipUpdateFunc = memoFunc.arguments[1];
      if (shouldSkipUpdateFunc?.callee?.name !== 'shouldSkipUpdate') return;
      if (!shouldSkipUpdateFunc.arguments[0]) {
        context.report({
          node: shouldSkipUpdateFunc,
          messageId: 'missingShouldSkipUpdateDependencies'
        });
        return;
      }

      const declaredDependenciesNodes = shouldSkipUpdateFunc.arguments[0].elements;
      const declaredDependencies = declaredDependenciesNodes.map((e) => e.value);

      const declaredNames = Array.from(new Set(component.usedPropTypes.flatMap((p) => {
        const names = [];
        p.allNames.reduce((sum, ins) => {
          const newSum = [sum, ins].filter((n) => n).join('.').replace(/\.__COMPUTED_PROP__/g, '[]');
          names.push(newSum);
          return newSum;
        }, '');
        return names;
      }))).sort();


      const propIsUsed = (name) => {
        const lastName = name.split('.').pop()
        return variablesInScope(context).filter((v) => v.name === lastName).some((variable) => (
          variable.references.some((reference) => {
              return [
                'ArrayExpression', // I'm not 100% sold on this one
                'CallExpression',
                'ExperimentalSpreadProperty',
                'JSXExpressionContainer',
                'UnaryExpression'
              ].includes(reference.identifier.parent.type)
          })
        ))
      }

      const buildFullName = (allNames) => allNames.join('.').replace(/\.__COMPUTED_PROP__/g, '[]')

      const getChildrenNames = (name) => declaredNames.filter((n) => n.startsWith(`${name}.`));
      const getImmediateChildrenNames = (name) => declaredNames.filter((n) => n.match(new RegExp('^' + name + '\.[^\.]*$')))

      const hasChildren = (name) => getChildrenNames(name).length !== 0

      const shouldIgnore = (name) => {
        const childrenNames = getChildrenNames(name)
        if (childrenNames.length === 0) {
          return false
        } else {
          return !propIsUsed(name) && childrenNames.some((name) => declaredDependencies.includes(name))
        }
      }

      let ignoredDeclaredNames = declaredNames.filter((n) => {
        const childrenNames = getChildrenNames(n);
        // if (childrenNames.length === 0) {
          const usedNode = component.usedPropTypes.find((p) => p.allNames.join('.') === n)?.node//?.key

          if (usedNode) {
            // Variable is unused so it's not our concern (no-unused will pick it up)
            if (usedNode && unusedVars.some((v) => circularDeepEqual(v.node, usedNode.key))) {
              return true
            }

            if (typeof usedNode.loc.identifierName === 'undefined') {
              const usedNodeName = usedNode.loc.identifierName || usedNode.parent.value?.name || usedNode.value?.name || usedNode.name
              if (unusedVars.some((v) => v.node.name === usedNodeName)) {
                return true
              }
            }
          }
        // }

        return shouldIgnore(n)
      })

      let undeclareds = uniqBy(component.usedPropTypes, (p) => buildFullName(p.allNames)).filter((propType) => (
        propType.node
        && !isIgnored(propType.allNames[0])
        && !ignoredDeclaredNames.includes(buildFullName(propType.allNames))
        && !declaredDependencies.some((d) => {
          let declared = false;
          propType.allNames.reduce((sum, ins) => {
            const newSum = buildFullName([sum, ins].filter((n) => n));
            if (d === newSum) declared = true;
            return newSum;
          }, '');
          return declared;
        })
      ));

      undeclareds = undeclareds.filter((propType) => {
        const childrenNames = getChildrenNames(buildFullName(propType.allNames))
        if (childrenNames.some((nn) => undeclareds.some((nnn) => buildFullName(nnn.allNames) === nn)))
          return false
        return true
      })

      const extraDependencies = declaredDependencies.filter((e) => ignoredDeclaredNames.includes(e) || !declaredNames.includes(e));

      // STOP: Don't delete this one when cleaning up console comments, it's the most helpful
      // console.info({
      //   declaredDependencies,
      //   declaredNames,
      //   ignoredDeclaredNames,
      //   extraDependencies,
      //   undeclaredNames: undeclareds.map((p) => buildFullName(p.allNames)),
      //   unusedVars: unusedVars.map((v) => v.data.varName),
      //   usedVars: component.usedPropTypes.map((p) => p.allNames.join('.'))
      // });

      const extraDependenciesNodes = declaredDependenciesNodes.filter((n) => extraDependencies.includes(n.value));

      undeclareds.forEach((propType) => {
        const name = buildFullName(propType.allNames);
        // if (name.includes('[]') && !ignoreExtra)
        //   return
        context.report({
          node: propType.node,
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {
            name
          }
          // suggest: [{
          //   messageId: 'missingShouldSkipUpdateDependencySuggestion',
          //   fix(fixer) {
          //     return fixer.replaceText(shouldSkipUpdateFunc.arguments[0], `['${name}']`)
          //   },
          //   data: {
          //     name,
          //   },
          //   output: "memo(MyComponent, shouldSkipUpdate(['foo.bar.baz']))"
          // }]
        });
        context.report({
          node: shouldSkipUpdateFunc.arguments[0],
          messageId: 'missingShouldSkipUpdateDependency',
          data: {
            name
          }
          // suggest: [{
          //   messageId: 'missingShouldSkipUpdateDependencySuggestion',
          //   fix(fixer) {
          //     return fixer.replaceText(shouldSkipUpdateFunc.arguments[0], `['${name}']`)
          //   },
          //   data: {
          //     name,
          //   },
          //   output: "memo(MyComponent, shouldSkipUpdate(['foo.bar.baz']))"
          // }]
        });
      });

      if (!ignoreExtra) {
        extraDependenciesNodes.forEach((node) => {
          if (node.value.includes('[]'))
            return

          context.report({
            node,
            messageId: 'extraShouldSkipUpdateDependency',
            data: {
              name: node.value
            }
          });
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'Program:exit'(programNode) {
        const list = components.list();

        // todo: Enable this when running test only
        // if (!Object.keys(list).length) {
        //   throw(new Error())
        // }
        const unusedVars = create(context)['Program:exit'](programNode)

        // Report undeclared proptypes for all classes
        Object.keys(list).filter((component) => mustBeValidated(list[component])).forEach((component) => {
        // Object.keys(list)/* .filter((component) => mustBeValidated(list[component])) */.forEach((component) => {
          reportUndeclaredSkipUpdateArguments(list[component], unusedVars);
        });
      }
    };
  })
};
