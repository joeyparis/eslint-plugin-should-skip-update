/**
 * @fileoverview Prevent usage of setState in lifecycle methods
 * @author Yannick Croissant
 */

'use strict';

import docsUrl from './docsUrl';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function mapTitle(methodName) {
  const map = {
    componentDidMount: 'did-mount',
    componentDidUpdate: 'did-update',
    componentWillUpdate: 'will-update'
  };
  const title = map[methodName];
  if (!title) {
    throw Error(`No docsUrl for '${methodName}'`);
  }
  return `no-${title}-set-state`;
}

function makeNoMethodSetStateRule(methodName, shouldCheckUnsafeCb) {
  return {
    meta: {
      docs: {
        description: `Prevent usage of setState in ${methodName}`,
        category: 'Best Practices',
        recommended: false,
        url: docsUrl(mapTitle(methodName))
      },

      messages: {
        noSetState: 'Do not use setState in {{name}}'
      },

      schema: [{
        enum: ['disallow-in-func']
      }]
    },

    create(context) {
      const mode = context.options[0] || 'allow-in-func';

      function nameMatches(name) {
        if (name === methodName) {
          return true;
        }

        if (typeof shouldCheckUnsafeCb === 'function' && shouldCheckUnsafeCb(context)) {
          return name === `UNSAFE_${methodName}`;
        }

        return false;
      }

      // --------------------------------------------------------------------------
      // Public
      // --------------------------------------------------------------------------

      return {

        CallExpression(node) {
          const callee = node.callee;
          if (
            callee.type !== 'MemberExpression'
            || callee.object.type !== 'ThisExpression'
            || callee.property.name !== 'setState'
          ) {
            return;
          }
          const ancestors = context.getAncestors(callee).reverse();
          let depth = 0;
          ancestors.some((ancestor) => {
            if (/Function(Expression|Declaration)$/.test(ancestor.type)) {
              depth++;
            }
            if (
              (ancestor.type !== 'Property' && ancestor.type !== 'MethodDefinition' && ancestor.type !== 'ClassProperty')
              || !nameMatches(ancestor.key.name)
              || (mode !== 'disallow-in-func' && depth > 1)
            ) {
              return false;
            }
            context.report({
              node: callee,
              messageId: 'noSetState',
              data: {
                name: ancestor.key.name
              }
            });
            return true;
          });
        }
      };
    }
  };
}

export default makeNoMethodSetStateRule;
