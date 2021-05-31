/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/should-skip-update');
// const rule = require('eslint-plugin-react').rules['prop-types']

const parsers = require('../../helpers/parsers');

const settings = {
  react: {
    pragma: 'Foo',
    version: 'detect'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tests = {
  valid: [].concat(
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello World {this.props.children}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{
        ignore: ['children']
      }]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
        // 'memo(Hello, shouldSkipUpdate([\'foo\']))'
      ].join('\n')
    },
    {
      // TODO: Always gets this error `ReferenceError: Cannot access 'variablesInScope' before initialization`
      skip: true,
      code: [
        'var Hello = createReactClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: externalPropTypes.mySharedPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'Hello.propTypes.lastname = PropTypes.string;',
        'memo(Hello, shouldSkipUpdate([\'firstname\', \'lastname\']))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...other } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {firstname, lastname} = this.state, something = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'something\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (Object.prototype.hasOwnProperty.call(this.props, \'firstname\')) {',
        '      return <div>Hello {this.props.firstname}</div>;',
        '    }',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'Hello.propTypes.a = PropTypes.shape({',
        '  b: PropTypes.string',
        '});',
        'memo(Hello, shouldSkipUpdate([\'a.b\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.shape({',
        '    b: PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'Hello.propTypes.a.b.c = PropTypes.number;',
        'memo(Hello, shouldSkipUpdate([\'a.b.c\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.objectOf(',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      d: PropTypes.string,',
        '      e: PropTypes.array',
        '    })',
        '  )',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a.b.c\',\'a.__.d\',\'a.anything.e\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      d: PropTypes.string,',
        '      e: PropTypes.array',
        '    })',
        '  )',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a.length\', \'a[].c\',\'a[].d.length\',\'a[].e\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.oneOfType([',
        '    PropTypes.array,',
        '    PropTypes.string',
        '  ])',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.c;',
        '    this.props.a[2] === true;',
        '    this.props.a.e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.oneOfType([',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      e: PropTypes.array',
        '    }).isRequired,',
        '    PropTypes.arrayOf(',
        '      PropTypes.bool',
        '    )',
        '  ])',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a.c\',\'a.length\', \'a.e\']))'
      ].join('\n')
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOfType([
            PropTypes.shape({
              bar: PropTypes.string
            }),
            PropTypes.shape({
              baz: PropTypes.string
            })
          ])
        };
        memo(Hello, shouldSkipUpdate(['foo.baz']))
      `
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOfType([
            PropTypes.shape({
              bar: PropTypes.string
            }),
            PropTypes.instanceOf(Baz)
          ])
        };
        memo(Hello, shouldSkipUpdate(['foo.baz']))
      `
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOf(['bar', 'baz'])
        };
        memo(Hello, shouldSkipUpdate(['foo.baz']))
      `
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.render;',
        '    this.props.a.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.instanceOf(Hello)',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a.render\',\'a.c\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.arr;',
        '    this.props.arr[3];',
        '    this.props.arr.length;',
        '    this.props.arr.push(3);',
        '    this.props.bo;',
        '    this.props.bo.toString();',
        '    this.props.fu;',
        '    this.props.fu.bind(this);',
        '    this.props.numb;',
        '    this.props.numb.toFixed();',
        '    this.props.stri;',
        '    this.props.stri.length();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  arr: PropTypes.array,',
        '  bo: PropTypes.bool.isRequired,',
        '  fu: PropTypes.func,',
        '  numb: PropTypes.number,',
        '  stri: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'arr\',\'bo\',\'fu\',\'numb\',\'stri\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      propX,',
        '      "aria-controls": ariaControls, ',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "propX": PropTypes.string,',
        '  "aria-controls": PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'propX\',\'aria-controls\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "some.value": PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'some.value\']))'
      ].join('\n')
    },
    // {
    //   code: [
    //     'class Hello extends React.Component {',
    //     '  render() {',
    //     '    this.props["arr"][1];',
    //     '    return <div>Hello</div>;',
    //     '  }',
    //     '}',
    //     'Hello.propTypes = {',
    //     '  "arr": PropTypes.array',
    //     '};'
    //   ].join('\n')
    // },
    // {
    //   code: [
    //     'class Hello extends React.Component {',
    //     '  render() {',
    //     '    this.props["arr"][1]["some.value"];',
    //     '    return <div>Hello</div>;',
    //     '  }',
    //     '}',
    //     'Hello.propTypes = {',
    //     '  "arr": PropTypes.arrayOf(',
    //     '    PropTypes.shape({"some.value": PropTypes.string})',
    //     '  )',
    //     '};',
    //     'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
    //   ].join('\n')
    // },
    {
      code: `
        class ArrayLengthTest extends React.Component {
          render() {
            use(this.props.arr.length)
            use(this.props.arr2.length)
            return <div />
          }
        }

        ArrayLengthTest.propTypes = {
          arr: PropTypes.array,
          arr2: PropTypes.arrayOf(PropTypes.number),
        }
        memo(Hello, shouldSkipUpdate(['arr.length','arr2.length']))
        `
    },
    {
      code: [
        'var TestComp1 = createReactClass({',
        '  propTypes: {',
        '    size: PropTypes.string',
        '  },',
        '  render: function() {',
        '    var foo = {',
        '      baz: \'bar\'',
        '    };',
        '    var icons = foo[this.props.size].salut;',
        '    return <div>{icons}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'size\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      options: [{ignore: ['name']}]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {firstname, lastname} = this.props.name;',
        '    return <div>{firstname} {lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape({',
        '    firstname: PropTypes.string,',
        '    lastname: PropTypes.string',
        '  })',
        '};',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\',\'name.lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'const foo = {};',
        'class Hello extends React.Component {',
        '  render() {',
        '    const {firstname, lastname} = this.props.name;',
        '    return <div>{firstname} {lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape(foo)',
        '};',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\', \'name.lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    let {firstname} = this;',
        '    return <div>{firstname}</div>;',
        '  }',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    router: PropTypes.func',
        '  },',
        '  render: function() {',
        '    var nextPath = this.props.router.getCurrentQuery().nextPath;',
        '    return <div>{nextPath}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'router\']))'
      ].join('\n')
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    firstname: CustomValidator.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: CustomValidator.map',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'outer.inner\']))'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    outer: PropTypes.shape({',
        '      inner: CustomValidator.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'outer.inner\']))'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: PropTypes.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'outer.inner\']))'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name.get("test")}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name.get\']))'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'class Comp2 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp2.propTypes = {',
        '  prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '};',
        'memo(Comp1, shouldSkipUpdate([]))',
        'memo(Comp2, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'class Comp2 extends Component {',
        '  static propTypes = {',
        '    prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '  }',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'memo(Comp1, shouldSkipUpdate([]))',
        'memo(Comp2, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'var Comp2 = createReactClass({',
        '  propTypes: {',
        '    prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '  },',
        '  render() {',
        '    return <span />;',
        '  }',
        '});',
        'memo(Comp1, shouldSkipUpdate([]))',
        'memo(Comp2, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'const SomeComponent = createReactClass({',
        '  propTypes: SomeOtherComponent.propTypes',
        '});',
        'memo(SomeComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    let { a, ...b } = obj;',
        '    let c = { ...d };',
        '    return <div />;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}',
        'memo(DynamicHello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      // TODO: `users.length` should be a dependency, but it's not
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    var users = this.props.users.find(user => user.name === \'John\');',
        '    return <div>Hello you {users.length}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  users: PropTypes.arrayOf(PropTypes.object)',
        '};',
        'memo(Hello, shouldSkipUpdate([\'users[].name\', \'users.find\']))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {} = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var foo = \'fullname\';',
        '    var { [foo]: firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}',
        'memo(Hello, shouldSkipUpdate([\'source.uri\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}',
        'memo(Hello, shouldSkipUpdate([\'source.uri\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'function HelloComponent() {',
        '  class Hello extends React.Component {',
        '    render() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '  Hello.propTypes = { name: PropTypes.string };',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();',
        'memo(HelloComponent, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'function HelloComponent() {',
        '  var Hello = createReactClass({',
        '    propTypes: { name: PropTypes.string },',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();',
        'memo(HelloComponent(), shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      // only: true,
      code: [
        'class DynamicHello extends Component {',
        '  render() {',
        '    const {firstname} = this.props;',
        '    class Hello extends Component {',
        '      render() {',
        '        const {name} = this.props;',
        '        return <div>Hello {name}</div>;',
        '      }',
        '    }',
        '    Hello.propTypes = {',
        '      name: PropTypes.string',
        '    };',
        '    Hello = connectReduxForm({name: firstname})(Hello);',
        '    return <Hello />;',
        '  }',
        '}',
        'DynamicHello.propTypes = {',
        '  firstname: PropTypes.string,',
        '};',
        'memo(DynamicHello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'Hello.propTypes = {',
        '  names: PropTypes.array,',
        '  company: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'names\',\'company\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    // {
    //   code: [
    //     'export default {',
    //     '  renderHello() {',
    //     '    let {name} = this.props;',
    //     '    return <div>{name}</div>;',
    //     '  }',
    //     '};'
    //   ].join('\n'),
    //   parser: parsers.BABEL_ESLINT
    // },
    {
      code: [
        'export default function FooBar(props) {',
        '  const bar = props.bar;',
        '  return (<div bar={bar}><div {...props}/></div>);',
        '}',
        'if (process.env.NODE_ENV !== \'production\') {',
        '  FooBar.propTypes = {',
        '    bar: PropTypes.string',
        '  }',
        '}',
        'memo(FooBar, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var {...other} = this.props;',
        '    return (',
        '      <div {...other} />',
        '    );',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'const StatelessComponent = (props) => {',
        '  const subRender = () => {',
        '    return <span>{props.someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'StatelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};',
        'memo(StatelessComponent, shouldSkipUpdate([\'someProp\']))'
      ].join('\n')
    },
    {
      code: [
        'const StatelessComponent = ({ someProp }) => {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'StatelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};',
        'memo(StatelessComponent, shouldSkipUpdate([\'someProp\']))'
      ].join('\n')
    },
    {
      code: [
        'const StatelessComponent = function({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'StatelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};',
        'memo(StatelessComponent, shouldSkipUpdate([\'someProp\']))'
      ].join('\n')
    },
    {
      code: [
        'function StatelessComponent({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'StatelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};',
        'memo(StatelessComponent, shouldSkipUpdate([\'someProp\']))'
      ].join('\n')
    },
    {
      // Validation is ignored on reassigned props object
      code: [
        'const StatelessComponent = (props) => {',
        '  let newProps = props;',
        '  return <span>{newProps.someProp}</span>;',
        '}',
        'memo(StatelessComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: string;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {\'data-action\': string};',
        'function Button({ \'data-action\': dataAction }: Props) {',
        '  return <div data-action={dataAction} />;',
        '}',
        'memo(Button, shouldSkipUpdate([\'data-action\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: {',
        '      firstname: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string; lastname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {name: {firstname: string;}};',
        'class Hello extends React.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'people.length\',\'people[].name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'people.length\',\'people[].name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[]|Person;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    if (Array.isArray(this.props.people)) {',
        '      for (var i = 0; i < this.props.people.length; i++) {',
        '        names.push(this.props.people[i].name.firstname);',
        '      }',
        '    } else {',
        '      names.push(this.props.people.name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'people.name.firstname\',\'people.length\',\'people[].name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {ok: string | boolean;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.ok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'ok\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props = {a: 123};',
        '  render () {',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      // Ignore component validation if propTypes are composed using spread
      code: [
        'class Hello extends React.Component {',
        '    render() {',
        '        return  <div>Hello {this.props.firstName} {this.props.lastName}</div>;',
        '    }',
        '};',
        'const otherPropTypes = {',
        '    lastName: PropTypes.string',
        '};',
        'Hello.propTypes = {',
        '    ...otherPropTypes,',
        '    firstName: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstName\', \'lastName\']))'
      ].join('\n')
    },
    {
      // Ignore destructured function arguments
      code: [
        'class Hello extends React.Component {',
        '  render () {',
        '    return ["string"].map(({length}) => <div>{length}</div>);',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      // Flow annotations on stateless components
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'function Hello(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\', \'lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = function(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\', \'lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = (props: Props): React.Element => {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\', \'lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {',
        '  \'completed?\': boolean,',
        '};',
        'const Hello = (props: Props): React.Element => {',
        '  return <div>{props[\'completed?\']}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([\'completed?\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {',
        '  name: string,',
        '};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render() {',
        '    const {name} = this.props;',
        '    return name;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type PropsUnionA = {',
        '  a: string,',
        '  b?: void,',
        '};',
        'type PropsUnionB = {',
        '  a?: void,',
        '  b: string,',
        '};',
        'type Props = {',
        '  name: string,',
        '} & (PropsUnionA | PropsUnionB);',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render() {',
        '    const {name} = this.props;',
        '    return name;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      // Impossible intersection type
      code: `
        import React from 'react';
        type Props = string & {
          fullname: string
        };
        class Test extends React.PureComponent<Props> {
          render() {
            return <div>Hello {this.props.fullname}</div>
          }
        }
        memo(Text, shouldSkipUpdate(['fullname']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'Card.propTypes = {',
        '  title: PropTypes.string.isRequired,',
        '  children: PropTypes.element.isRequired,',
        '  footer: PropTypes.node',
        '}',
        'function Card ({ title, children, footer }) {',
        '  return (',
        '    <div/>',
        '  )',
        '}',
        'memo(Hello, shouldSkipUpdate([\'title\',\'children\',\'footer\']))'
      ].join('\n')
    },
    {
      code: [
        'function JobList(props) {',
        '  props',
        '  .jobs',
        '  .forEach(() => {});',
        '  return <div></div>;',
        '}',
        'JobList.propTypes = {',
        '  jobs: PropTypes.array',
        '};',
        'memo(JobList, shouldSkipUpdate([\'jobs\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {',
        '  firstname: ?string,',
        '};',
        'function Hello({firstname}: Props): React$Element {',
        '  return <div>Hello {firstname}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'function Greetings() {',
        '  return <div>{({name}) => <Hello name={name} />}</div>',
        '}',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'function Greetings() {',
        '  return <div>{function({name}) { return <Hello name={name} />; }}</div>',
        '}',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      // Should stop at the decorator when searching for a parent component
      code: [
        '@asyncConnect([{',
        '  promise: ({dispatch}) => {}',
        '}])',
        'class Something extends Component {}',
        'memo(Something, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      // Should not find any used props
      code: [
        'function Hello(props) {',
        '  const {...rest} = props;',
        '  return <div>Hello</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'let Greetings = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '};',
        'Greetings.propTypes = {',
        '  name: PropTypes.string',
        '}',
        'memo(Greetings, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'let Greetings = {',
        '  Hello: class extends React.Component {',
        '    render () {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {',
        '  name: PropTypes.string',
        '};',
        'memo(Greetings.Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      code: [
        'let Greetings = {};',
        'Greetings.Hello = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '};',
        'Greetings.Hello.propTypes = {',
        '  name: PropTypes.string',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n')
    },
    {
      // This should be detected as a component but isn't for some reason
      skip: true,
      code: [
        'function Hello({names}) {',
        '  return names.map((name) => {',
        '    return <div>{name}</div>;',
        '  });',
        '}',
        'memo(Hello, shouldSkipUpdate([\'names\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Target = { target: EventTarget }',
        'class MyComponent extends Component {',
        '  static propTypes = {',
        '    children: PropTypes.any,',
        '  }',
        '  handler({ target }: Target) {}',
        '  render() {',
        '    return <div>{this.props.children}</div>;',
        '  }',
        '}',
        'memo(MyComponent, shouldSkipUpdate([\'children\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends Component {}',
        'Hello.Foo = ({foo}) => (',
        '  <div>Hello {foo}</div>',
        ')',
        'Hello.Foo.propTypes = {',
        '  foo: PropTypes.node',
        '}',
        'memo(Hello.Foo, shouldSkipUpdate([\'foo\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      options: [{skipUndeclared: false}]
    },
    {
      // Flow annotations with variance
      code: [
        'type Props = {',
        '  +firstname: string;',
        '  -lastname: string;',
        '};',
        'function Hello(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\',\'lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  async onSelect({ name }) {',
        '    return null;',
        '  }',
        '  render() {',
        '    return <Greeting onSelect={this.onSelect} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n')
    },
    {
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    onDelete: PropTypes.func.isRequired',
        '  }',
        '  handleDeleteConfirm = () => {',
        '    this.props.onDelete();',
        '  };',
        '  handleSubmit = async ({certificate, key}) => {};',
        '}',
        'memo(Hello, shouldSkipUpdate([\'onDelete\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  ...data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {|',
        '  ...data,',
        '  lastname: string',
        '|};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  ...$Exact<data>,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type {Data} from \'./Data\'',
        'type Person = {',
        '  ...Data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type {Data} from \'some-libdef-like-flow-typed-provides\'',
        'type Person = {',
        '  ...Data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type {BasePerson} from \'./types\'',
        'type Props = {',
        '  person: {',
        '   ...$Exact<BasePerson>,',
        '   lastname: string',
        '  }',
        '};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type OtherProps = {',
        '  firstname: string,',
        '};',
        'type Props = {',
        '   ...OtherProps,',
        '   lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type FooProps = {
          ...any,
          ...42,
        }
        function Foo(props: FooProps) {
          return <p />;
        }
        memo(Foo, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const { firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const { firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      // TODO: Should `notes` be required if a child attribute is specified?
      code: [
        'type Note = {text: string, children?: Note[]};',
        'type Props = {',
        '  notes: Note[];',
        '};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.notes[0].text}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'notes\', \'notes[].text\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {flowVersion: '0.52'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props;

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo','bar']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo','bar','zap']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        import type { PropsA } from "./myPropsA";
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo','bar','zap']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsA = { bar: string };
        type PropsB = { zap: string };
        type Props = PropsA & {
          baz: string
        };

        class Bar extends React.Component {
          props: Props & PropsB;

          render() {
            return <div>{this.props.bar} - {this.props.zap} - {this.props.baz}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['bar','zap','baz']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsA = { bar: string };
        type PropsB = { zap: string };
        type Props =  {
          baz: string
        } & PropsA;

        class Bar extends React.Component {
          props: Props & PropsB;

          render() {
            return <div>{this.props.bar} - {this.props.zap} - {this.props.baz}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['bar','zap','baz']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = { foo: string }
        function higherOrderComponent<Props>() {
          return class extends React.Component<Props> {
            render() {
              return <div>{this.props.foo}</div>
            }
          }
        }
        memo(higherOrderComponent, shouldSkipUpdate(['foo']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div>{this.props.foo}</div>
            }
          }
        }
        memo(higherOrderComponent, shouldSkipUpdate(['foo']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        const withOverlayState = <P: {foo: string}>(WrappedComponent: ComponentType<P>): CpmponentType<P> => (
          class extends React.Component<P> {
            constructor(props) {
              super(props);
              this.state = {foo: props.foo}
            }
            render() {
              return <div>Hello World</div>
            }
          }
        )

        memo(withOverlayState, shouldSkipUpdate(['foo']))
      `,
      parser: parsers.BABEL_ESLINT
    },

    // issue #1288
    `function Foo() {
      const props = {}
      props.bar = 'bar'
      return <div {...props} />
    };
    memo(Foo, shouldSkipUpdate([]))`,
    // issue #1288
    `function Foo(props) {
      props.bar = 'bar';
      return <div {...props} />;
    };
    memo(Foo, shouldSkipUpdate([]))`,
    {
      // issue #106
      code: `
      import React from 'react';
      import SharedPropTypes from './SharedPropTypes';

      export default class A extends React.Component {
        render() {
          return (
            <span
              a={this.props.a}
              b={this.props.b}
              c={this.props.c}>
              {this.props.children}
            </span>
          );
        }
      }

      A.propTypes = {
        a: React.PropTypes.string,
        ...SharedPropTypes // eslint-disable-line object-shorthand
      };

      memo(A, shouldSkipUpdate(['a','b','c','children']))
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        const Slider = props => (
          <RcSlider {...props} />
        );

        Slider.propTypes = RcSlider.propTypes;

        memo(Slider, shouldSkipUpdate([]))
      `
    },
    {
      code: `
        const Slider = props => (
          <RcSlider foo={props.bar} />
        );

        Slider.propTypes = RcSlider.propTypes;

        memo(Slider, shouldSkipUpdate(['bar']))
      `
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => ({ current: props.current }));
          }
          render() {
            return <div />;
          }
        }

        Foo.propTypes = {
          current: PropTypes.number.isRequired,
        };

        memo(Foo, shouldSkipUpdate(['current']))
      `
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => {
              function f(_, {aaaaaaa}) {}
            });
          }
        }
        memo(Foo, shouldSkipUpdate([]))
      `
    },
    {
      code: `
        class Foo extends React.Component {
          static getDerivedStateFromProps(props) {
            const { foo } = props;
            return {
              foobar: foo
            };
          }

          render() {
            const { foobar } = this.state;
            return <div>{foobar}</div>;
          }
        }

        Foo.propTypes = {
          foo: PropTypes.func.isRequired,
        };

        memo(Foo, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {version: '16.3.0'}}
    },
    {
      code: `
        const HeaderBalance = React.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate(['cryptoCurrency']));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `
    },
    {
      code: `
        import React, { memo } from 'react';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate(['cryptoCurrency']));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `
    },
    {
      code: `
        import Foo, { memo } from 'foo';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate(['cryptoCurrency']));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
        memo(Label, shouldSkipUpdate(['text']))
      `
    },
    {
      code: `
        const Label = Foo.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
        memo(Label, shouldSkipUpdate(['text']))
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
        import React, { forwardRef } from 'react';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
        memo(Label, shouldSkipUpdate(['text']))
      `
    },
    {
      code: `
        import Foo, { forwardRef } from 'foo';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
        memo(Label, shouldSkipUpdate(['text']))
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
      class Foo extends React.Component {
        propTypes = {
          actions: PropTypes.object.isRequired,
        };
        componentWillReceiveProps (nextProps) {
          this.props.actions.doSomething();
        }

        componentWillUnmount () {
          this.props.actions.doSomething();
        }

        render() {
          return <div>foo</div>;
        }
      }
      memo(Foo, shouldSkipUpdate(['actions.doSomething']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      class Foo extends React.Component {
        componentDidUpdate() { this.inputRef.focus(); }
        render() {
          return (
            <div>
              <input ref={(node) => { this.inputRef = node; }} />
            </div>
          )
        }
      }
      memo(Foo, shouldSkipUpdate([]))
      `
    },
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate(nextProps, nextState) {
            const {
                first_organization,
                second_organization,
            } = this.state;
            return true;
          }
          render() {
            return <div>hi</div>;
          }
        }
        memo(Foo, shouldSkipUpdate([]))
      `
    },
    {
      code: `
      class Foo extends React.Component {
        shouldComponentUpdate(nextProps) {
          if (this.props.search !== nextProps.search) {
            let query = nextProps.query;
            let result = nextProps.list.filter(item => {
              return (item.name.toLowerCase().includes(query.trim().toLowerCase()));
            });

            this.setState({ result });

            return true;
          }
        }
        render() {
          return <div>foo</div>;
        }
      }
      Foo.propTypes = {
        search: PropTypes.object,
        list: PropTypes.array,
        query: PropTypes.string,
      };
      memo(Foo, shouldSkipUpdate(['search','list.filter','query.trim']))
      `
    },
    {
      code: [
        'export default class LazyLoader extends Component {',
        '  static propTypes = {',
        '    children: PropTypes.node,',
        '    load: PropTypes.any,',
        '  };',
        '  state = { mod: null };',
        '  shouldComponentUpdate(prevProps) {',
        '    assert(prevProps.load === this.props.load);',
        '    return true;',
        '  }',
        '  load() {',
        '    this.props.load(mod => {',
        '      this.setState({',
        '        mod: mod.default ? mod.default : mod',
        '      });',
        '    });',
        '  }',
        '  render() {',
        '    if (this.state.mod !== null) {',
        '      return this.props.children(this.state.mod);',
        '    }',
        '    this.load();',
        '    return null;',
        '  }',
        '}',
        'memo(LazyLoader, shouldSkipUpdate([\'load\', \'children\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        import {connect} from 'react-redux';

        class Foo extends React.Component {
          render() {
            return this.props.children;
          }
        }

        Foo.propTypes = {
          children: PropTypes.element.isRequired
        };

        memo(Foo, shouldSkipUpdate(['children']))

        export const Unconnected = Foo;
        export default connect(Foo);
      `
    },
    {
      // issue #2138
      code: `
        type UsedProps = {|
          usedProp: number,
        |};

        type UnusedProps = {|
          unusedProp: number,
        |};

        type Props = {| ...UsedProps, ...UnusedProps |};

        function MyComponent({ usedProp }: Props) {
          return <div>{usedProp}</div>;
        }

        memo(MyComponent, shouldSkipUpdate(['usedProp']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: "'notOne' is missing in props validation",
        line: 8,
        column: 34
      }]
    },
    {
      // issue #1259
      code: `
        const Hello = props => {
          const { notInProp } = dict[props.foo];
          return <div />
        }

        Hello.propTypes = {
          foo: PropTypes.number,
        }

        memo(Hello, shouldSkipUpdate(['foo']))
      `
    },
    {
      // issue #2298
      code: `
      type Props = {|
        firstname?: string
      |};

      function Hello({ firstname = 'John' }: Props = {}) {
        return <div>Hello {firstname}</div>
      }

      memo(Hello, shouldSkipUpdate(['firstname']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      // issue #2330
      code: `
        type Props = {
          user: {
            [string]: string
          }
        };

        export function Bar(props: Props) {
          return (
            <div>
              {props.user}
              {props.user.name}
            </div>
          );
        }

        memo(Bar, shouldSkipUpdate(['user.name']))
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        const Label = React.memo(React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate(['text']));
        Label.propTypes = {
          text: PropTypes.string
        };
      `
    },
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate(['text']));
        Label.propTypes = {
          text: PropTypes.string
        };
      `
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate(['text']));
        Label.propTypes = {
          text: PropTypes.string
        };
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
        const Foo = ({length, ordering}) => (
          length > 0 && (
            <Paginator items={ordering} pageSize={10} />
          )
        );
        Foo.propTypes = {
          length: PropTypes.number,
          ordering: PropTypes.array
        };
        memo(Foo, shouldSkipUpdate(['length', 'ordering']))
      `
    },
    {
      code: `
        function Component(props) {
          return 0,
          <div>
            Hello, { props.name }!
          </div>
        }

        Component.propTypes = {
          name: PropTypes.string.isRequired
        }

        memo(Component, shouldSkipUpdate(['name']))
      `
    },
    {
      code: `
      const SideMenu = styled(
        ({ componentId }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={componentId} />
          </S.Container>
        ),
      );
      SideMenu.propTypes = {
        componentId: PropTypes.string.isRequired
      }

      memo(SideMenu, shouldSkipUpdate(['componentId']))
      `,
      settings: {
        componentWrapperFunctions: [{property: 'styled'}]
      }
    },
    parsers.TS([
      {
        code: `
          interface Props {
            'aria-label': string // 'undefined' PropType is defined but prop is never used eslint(react/no-unused-prop-types)
            // 'undefined' PropType is defined but prop is never used eslint(react-redux/no-unused-prop-types)
          }

          export default function Component({
            'aria-label': ariaLabel, // 'aria-label' is missing in props validation eslint(react/prop-types)
          }: Props): JSX.Element {
            return <div aria-label={ariaLabel} />
          }
          memo(Component, shouldSkipUpdate(['aria-label']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          interface Props {
            value?: string;
          }

          // without the | null, all ok, with it, it is broken
          function Test ({ value }: Props): React.ReactElement<Props> | null {
            if (!value) {
              return null;
            }

            return <div>{value}</div>;
          }
          memo(Test, shouldSkipUpdate(['value']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          interface Props {
            value?: string;
          }

          // without the | null, all ok, with it, it is broken
          function Test ({ value }: Props): React.ReactElement<Props> | null {
            if (!value) {
              return <div>{value}</div>;;
            }

            return null;
          }
          memo(Test, shouldSkipUpdate(['value']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          interface Props {
            value?: string;
          }
          const Hello = (props: Props) => {
            if (props.value) {
              return <div></div>;
            }
            return null;
          }
          memo(Hello, shouldSkipUpdate(['value']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          interface Props {
            'aria-label': string // 'undefined' PropType is defined but prop is never used eslint(react/no-unused-prop-types)
            // 'undefined' PropType is defined but prop is never used eslint(react-redux/no-unused-prop-types)
          }

          export default function Component({
            'aria-label': ariaLabel, // 'aria-label' is missing in props validation eslint(react/prop-types)
          }: Props): JSX.Element {
            return <div aria-label={ariaLabel} />
          }
          memo(Component, shouldSkipUpdate(['aria-label']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface Props {
            value?: string;
          }

          // without the | null, all ok, with it, it is broken
          function Test ({ value }: Props): React.ReactElement<Props> | null {
            if (!value) {
              return null;
            }
            return <div>{value}</div>;
          }
          memo(Test, shouldSkipUpdate(['value']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface Props {
            value?: string;
          }

          // without the | null, all ok, with it, it is broken
          function Test ({ value }: Props): React.ReactElement<Props> | null {
            if (!value) {
              return <div>{value}</div>;;
            }

            return null;
          }
          memo(Test, shouldSkipUpdate(['value']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface Props {
            value?: string;
          }
          const Hello = (props: Props) => {
            if (props.value) {
              return <div></div>;
            }
            return null;
          }
          memo(Hello, shouldSkipUpdate(['value']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          import * as React from 'react';

          interface Props {
            text: string;
          }

          export const Test: React.FC<Props> = (props: Props) => {
            const createElement = (text: string) => {
              return (
                <div>
                  {text}
                </div>
              );
            };

            return <>{createElement(props.text)}</>;
          };

          memo(Test, shouldSkipUpdate(['text']))
        `,
        parser: parsers.TYPESCRIPT_ESLINT
      },
      {
        code: `
          interface Props {
            value?: string;
          }
          const Hello = (props: Props) => {
            if (props.value) {
              return <div></div>;
            }
            return null;
          }
          memo(Hello, shouldSkipUpdate(['value']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          const mapStateToProps = state => ({
            books: state.books
          });

          interface InfoLibTableProps extends ReturnType<typeof mapStateToProps> {
          }

          const App = (props: InfoLibTableProps) => {
            props.books();
            return <div></div>;
          }
          memo(App, shouldSkipUpdate(['books']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          const mapStateToProps = state => ({
            books: state.books
          });

          interface BooksTable extends ReturnType<typeof mapStateToProps> {
            username: string;
          }

          const App = (props: BooksTable) => {
            props.books();
            return <div><span>{props.username}</span></div>;
          }

          memo(App, shouldSkipUpdate(['books', 'username']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface infoLibTable {
            removeCollection(): Array<string>;
          }

          interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => infoLibTable> {
          }

          const App = (props: InfoLibTableProps) => {
            props.removeCollection();
            return <div></div>;
          }
          memo(App, shouldSkipUpdate(['removeCollection']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface addTable {
            createCollection: () => Array<string>
          }

          type infoLibTable = addTable & {
            removeCollection: () => Array<string>
          }

          interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => infoLibTable> {
          }

          const App = (props: InfoLibTableProps) => {
            props.createCollection();
            props.removeCollection();
            return <div></div>;
          }

          memo(App, shouldSkipUpdate(['createCollection', 'removeCollection']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => {
            removeCollection:  () => Array<string>,
          }> {
          }

          const App = (props: InfoLibTableProps) => {
            props.removeCollection();
            return <div></div>;
          }

          memo(App, shouldSkipUpdate([removeCollection]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface addTable {
            createCollection: () => Array<string>;
          }

          type infoLibTable = {
            removeCollection: () => Array<string>,
          };

          interface InfoLibTableProps extends  ReturnType<
          (dispatch: storeDispatch) => infoLibTable & addTable,
          >{}

          const App = (props: InfoLibTableProps) => {
            props.createCollection();
            props.removeCollection();
            return <div></div>;
          };
          memo(App, shouldSkipUpdate(['createCollection', 'removeCollection']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface addTable {
            createCollection: () => Array<string>;
          }

          type infoLibTable = ReturnType<(dispatch: storeDispatch) => infoLibTable & addTable> & {
            removeCollection: () => Array<string>,
          };

          interface InfoLibTableProps {}

          const App = (props: infoLibTable) => {
            props.createCollection();
            props.removeCollection();
            return <div></div>;
          };

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => ({
            removeCollection:  () => Array<string>,
          })> {
          }

          const App = (props: InfoLibTableProps) => {
            props.removeCollection();
            return <div></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface ThingProps extends React.HTMLAttributes<HTMLDivElement> {
            thing?: number
          }

          const Thing = ({ thing = 1, style, ...props }: ThingProps) => {
            return <div />;
          }

          export default memo(Thing, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface ThingProps {
            thing?: number
          }

          const Thing = ({ thing = 1, style, ...props }: ThingProps & React.HTMLAttributes<HTMLDivElement>) => {
            return <div />;
          }

          export default memo(Thing, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          type User = {
            user: string;
          }

          type Props = User & UserProps;

          const MyComponent = (props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          }

          export default memo(MyComponent, shouldSkipUpdate(['userId','user']));
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          type User = {
          }

          type Props = User & UserProps;

          const MyComponent = (props: Props) => {
            const { user } = props;

            if (user === 0) {
              return <p>user is 0</p>;
            }

            return null;
          }

          export default memo(MyComponent, shouldSkipUpdate(['user']));
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface GenericProps {
            onClose: () => void
          }

          interface ImplementationProps extends GenericProps {
            onClick: () => void
          }

          const Implementation: FC<ImplementationProps> = (
            {
              onClick,
              onClose,
            }: ImplementationProps
          ) => (<div />)

          export default memo(Implementation, shouldSkipUpdate(['onClick', 'onClose']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          interface Props extends V2SocialLoginProps {
            autoLoad: boolean;
          }

          const DKFacebookButton = ({
            autoLoad,
            authAction,
            errorHandler,
            redirectUrl,
            isSignup,
          }: Props): JSX.Element | null => {
            if (!APP_ID) {
              rollbar.error('Missing Facebook OAuth App Id');
              return null;
            }

            const fbButtonText = isSignup ? 'Sign up with Facebook' : 'Log in with Facebook';

            const responseCallback = async ({
              accessToken,
              email = '',
              name = '',
            }: ReactFacebookLoginInfo) => {
              const [firstName, lastName] = name.split(' ');

              const requestData: DK.SocialLogin = {
                accessToken,
                email,
                firstName,
                lastName,
                intercomUserId: intercomService.getVisitorId(),
              };

              try {
                await authAction(requestData, redirectUrl);
              } catch (err) {
                errorHandler(err.message);
              }
            };

            const FacebookIcon = () => (
              <img
                style={{ marginRight: '8px' }}
                src={facebookIcon}
                alt='Facebook Login'
              />
            );

            return (
              <FacebookLogin
                cssClass='ant-btn dk-button dk-facebook-button dk-button--secondary ant-btn-primary ant-btn-lg'
                autoLoad={autoLoad}
                textButton={fbButtonText}
                size='small'
                icon={<FacebookIcon />}
                appId={APP_ID}
                fields='name,email'
                callback={responseCallback}
                data-testId='dk-facebook-button'
              />
            );
          };

          export default memo(DKFacebookButton, shouldSkipUpdate([]));
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          function Foo({ bar = "" }: { bar: string }): JSX.Element {
            return <div>{bar}</div>;
          }

          memo(Foo, shouldSkipUpdate(['bar']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      // Issue: #2795
      {
        code: `
        type ConnectedProps = DispatchProps &
          StateProps

        const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
          // Do stuff
          return (
            <StyledComponent>...</StyledComponent>
          )
        }

        const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => ({
          ...bindActionCreators<{prop1: ()=>void,prop2: ()=>string}>(
            { prop1: importedAction, prop2: anotherImportedAction },
            dispatch,
          ),
        })

        const mapStateToProps = (state: State) => ({
          prop3: Selector.value(state),
        })

        type StateProps = ReturnType<typeof mapStateToProps>
        type DispatchProps = ReturnType<typeof mapDispatchToProps>

        memo(Component, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      // Issue: #2795
      {
        code: `
        type ConnectedProps = DispatchProps &
          StateProps

        const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
          // Do stuff
          return (
            <StyledComponent>...</StyledComponent>
          )
        }

        const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => ({
          ...bindActionCreators<ActionCreatorsMapObject<Types.RootAction>>(
            { prop1: importedAction, prop2: anotherImportedAction },
            dispatch,
          ),
        })

        const mapStateToProps = (state: State) => ({
          prop3: Selector.value(state),
        })

        type StateProps = ReturnType<typeof mapStateToProps>
        type DispatchProps = ReturnType<typeof mapDispatchToProps>

        memo(Component, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      // Issue: #2795
      {
        code: `
        type ConnectedProps = DispatchProps &
          StateProps

        const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
          // Do stuff
          return (
            <StyledComponent>...</StyledComponent>
          )
        }

        const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) =>
          bindActionCreators<{prop1: ()=>void,prop2: ()=>string}>(
            { prop1: importedAction, prop2: anotherImportedAction },
            dispatch,
          )

        const mapStateToProps = (state: State) => ({
          prop3: Selector.value(state),
        })

        type StateProps = ReturnType<typeof mapStateToProps>
        type DispatchProps = ReturnType<typeof mapDispatchToProps>

        memo(Component, shouldSkipUpdate(['prop1', 'prop2', 'prop3']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
        import React from 'react'

        interface Meta {
          touched: boolean,
          error: string;
        }

        interface Props {
          input: string,
          meta: Meta,
          cssClasses: object
        }
        const InputField = ({ input, meta: { touched, error }, cssClasses = {}, ...restProps }: Props) => {
          restProps.className = cssClasses.base

          if (cssClasses.custom) {
            restProps.className += 'cssClasses.custom'
          }
          if (touched && error) {
            restProps.className += 'cssClasses.error'
          }

          return(
            <input
              {...input}
              {...restProps}
            />
          )
        }
        export default memo(InputField, shouldSkipUpdate(['input', 'meta.touched', 'meta.error', 'cssClasses']))`,
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
          import React from 'react'

          type ComponentProps = {
            name: string
          }

          class Factory {
            getComponent() {
              return function Component({ name }: ComponentProps) {
                return <div>Hello {name}</div>
              }
            }
          }

          memo(Factory, shouldSkipUpdate(['name']))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT']
      }
    ])
  ),

  invalid: [].concat(
    {
      code: [
        'type Props = {',
        '  name: string,',
        '};',
        'class Hello extends React.Component {',
        '  foo(props: Props) {}',
        '  render() {',
        '    return this.props.name;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return React.createElement("div", {}, this.props.name);',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { foo: { bar } } = this.props;
            return <p>{bar}</p>
          }
        }

        memo(Hello, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.bar'}
        }
      ]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { foo: { bar } } = this.props;
            return <p>{bar}</p>
          }
        }

        Hello.propTypes = {
          foo: PropTypes.shape({
            _: PropTypes.string,
          })
        }

        memo(Hello, shouldSkipUpdate(['foo._']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.bar'}
        }
      ]
    },
    {
      code: `
        function Foo({ foo: { bar } }) {
          return <p>{bar}</p>
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.bar'}
        }
      ]
    },
    {
      code: `
        function Foo({ a }) {
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }

        memo(Foo, shouldSkipUpdate(['a._']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.nope'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.nope'}
        }
      ]
    },
    {
      code: `
        function Foo({ a }) {
          const { b } = a
          return <p>{ b.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            b: PropType.shape({
              _: PropType.string,
            }),
          })
        }

        memo(Foo, shouldSkipUpdate(['a.b._']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b.nope'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b.nope'}
        }
      ]
    },
    {
      code: `
        function Foo(props) {
          const { a } = props
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }

        memo(Foo, shouldSkipUpdate(['a._']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.nope'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.nope'}
        }
      ]
    },
    {
      code: `
        function Foo(props) {
          const a = props.a
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }
        memo(Foo, shouldSkipUpdate(['a._']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.nope'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.nope'}
        }
      ]
    },
    {
      code: `
        class Foo extends Component {
          render() {
            const props = this.props
            return <div>{props.cat}</div>
          }
        }
        memo(Foo, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cat'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cat'}
        }
      ]
    },
    {
      code: `
        class Foo extends Component {
          render() {
            const {props} = this
            return <div>{props.cat}</div>
          }
        }
        memo(Foo, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cat'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cat'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const { name, ...rest } = this.props',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const { name, title, ...rest } = this.props',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.string',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'title'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'title'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '   renderStuff() {',
        '    const { name, ...rest } = this.props',
        '    return (<div {...rest}>{name}</div>);',
        '  }',
        '  render() {',
        '    this.renderStuff()',
        '  }',
        '}',
        'Hello.propTypes = {}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        '/** @extends React.Component */',
        'class Hello extends ChildComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))',
        'memo(HelloBis, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([\'name\']))',
        'memo(Hello2, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'propWithoutTypeDefinition'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'propWithoutTypeDefinition'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, lastname } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      skip: true,
      code: [
        'class Hello extends React.Component {',
        '  static propTypes: { ',
        '    firstname: PropTypes.string', // Seems to be an eslint test bug?
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.shape({',
        '  })',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.shape({',
        '    b: PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b.c'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b.c'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.shape({})',
        '};',
        'Hello.propTypes.a.b = PropTypes.shape({});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b.c'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b.c'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.objectOf(',
        '    PropTypes.shape({',
        '    })',
        '  )',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b.c'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.__.d.length'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.anything.e'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b.c'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.__.d.length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.anything.e'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '    })',
        '  )',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [

        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a[].c'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a[].d.length'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a[].e'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a[].c'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a[].d.length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a[].e'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.length'}
        },
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    this.props.a.b;',
        '    this.props.a.e.length;',
        '    this.props.a.e.anyProp;',
        '    this.props.a.c.toString();',
        '    this.props.a.c.someThingElse();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.oneOfType([',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      e: PropTypes.array',
        '    })',
        '  ])',
        '};',
        'memo(Hello, shouldSkipUpdate([\'a.c\',\'a.e\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.length'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      "aria-controls": ariaControls, ',
        '      propX,',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "aria-controls": PropTypes.string',
        '};',
        'memo(Hello, shouldSkipUpdate([\'aria-controls\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'propX'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'propX'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'some.value'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'some.value'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'arr'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'arr'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": PropTypes.arrayOf(',
        '    PropTypes.shape({})',
        '  )',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'arr'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'arr[].some.value'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'arr[].some.value'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'arr'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var text;',
        '    text = \'Hello \';',
        '    let {props: {firstname}} = this;',
        '    return <div>{text} {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {\'props\': {firstname}} = this;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (true) {',
        '      return <span>{this.props.firstname}</span>',
        '    } else {',
        '      return <span>{this.props.lastname}</span>',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  lastname: PropTypes.string',
        '}',
        'memo(Hello, shouldSkipUpdate([\'lastname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'var Hello = function(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'function Hello(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'var Hello = (props) => {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'var Hello = (props) => {',
        '  const {name} = props;',
        '  return <div>Hello {name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'function Hello({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'const Hello = function({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'const Hello = ({ name }) => {',
        '  return <div>Hello {name}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var props = {firstname: \'John\'};',
        '    return <div>Hello {props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source }',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'source'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'source'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'source.uri'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'source.uri'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source }',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'source'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'source'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source.uri }',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'source.uri'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'source.uri'}
        }
      ]
    },
    {
      // only: true,
      code: [
        'function HelloComponent() {',
        '  class Hello extends React.Component {',
        '    render() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '  return Hello;',
        '}',
        'module.exports = memo(HelloComponent(), shouldSkipUpdate([]));'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'function HelloComponent() {',
        '  var Hello = createReactClass({',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = memo(HelloComponent(), shouldSkipUpdate([]));'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class DynamicHello extends Component {',
        '  render() {',
        '    const {firstname} = this.props;',
        '    class Hello extends Component {',
        '      render() {',
        '        const {name} = this.props;',
        '        return <div>Hello {name}</div>;',
        '      }',
        '    }',
        '    Hello = connectReduxForm({name: firstname})(Hello);',
        '    return <Hello />;',
        '  }',
        '}',
        'memo(DynamicHello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        },
      ]
    },
    {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'names.map'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'company'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'names.map'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'company'}
        }
      ]
    },
    {
      code: [
        'const Annotation = props => (',
        '  <div>',
        '    {props.text}',
        '  </div>',
        ')',
        'memo(Annotation, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: [
        'for (var key in foo) {',
        '  var Hello = createReactClass({',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      skip: true, // Looks like some kind of eslint test bug
      code: [
        'var propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'class Test extends React.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = propTypes;',
        'memo(Test, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'memo(Test, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      settings,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = forbidExtraProps({',
        '  firstname: PropTypes.string',
        '});',
        'memo(Test, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = Object.freeze({',
        '  firstname: PropTypes.string',
        '});',
        'memo(Test, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['Object.freeze']
      }),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        '/** @jsx Foo */',
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'memo(Test, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {};',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'type Props = {name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: {',
        '      firstname: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name.lastname'}
        }
      ]
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name.lastname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {person: {name: {firstname: string;};};};',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.name.lastname'}
        }
      ]
    },
    {
      code: [
        'type Props = {person: {name: {firstname: string;};};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.name.lastname'}
        }
      ]
    },
    {
      code: [
        'type Person = {name: {firstname: string;}};',
        'class Hello extends React.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'people.length'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'people[].name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'people.length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'people[].name.lastname'}
        }
      ]
    },
    {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'people.length\',\'people[].name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'people[].name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'people[].name.lastname'}
        }
      ]
    },
    {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'result.notok'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'result.notok'}
        }
      ]
    },
    {
      code: [
        'let Greetings = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Greetings.propTypes = {};',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'let Greetings = {',
        '  Hello: class extends React.Component {',
        '    render () {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {};',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'let Greetings = {};',
        'Greetings.Hello = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {};',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'function Greetings({names}) {',
        '  names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);',
        '  return <Hello>{names}</Hello>;',
        '}',
        'memo(Greetings, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'names.map'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'names.map'}
        }
      ]
    },
    {
      code: [
        'const MyComponent = props => (',
        '  <div onClick={() => props.toggle()}></div>',
        ')',
        'memo(MyComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'toggle'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'toggle'}
        }
      ]
    },
    {
      code: [
        'const MyComponent = props => props.test ? <div /> : <span />',
        'memo(MyComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'test'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'test'}
        }
      ]
    },
    {
      code: [
        'const TestComponent = props =>',
        '  <div onClick={() => props.test()} />',
        'const mapStateToProps = (_, props) => ({',
        '  otherProp: props.otherProp,',
        '})',
        'memo(TestComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'test'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'test'}
        }
      ]
    },
    {
      code: [
        'type Props = {',
        '  firstname: ?string,',
        '};',
        'function Hello({firstname, lastname}: Props): React$Element {',
        '  return <div>Hello {firstname} {lastname}</div>;',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    const firstname = props.firstname;',
        '    const {lastname} = props;',
        '    this.state = {',
        '      firstname,',
        '      lastname',
        '    }',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      code: [
        'function Hello(props) {',
        '  return <div>{props.name.constructor.firstname}</div>',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape({',
        '    firstname: PropTypes.object',
        '  })',
        '};',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name.constructor.firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name.constructor.firstname'}
        }
      ]
    },
    {
      code: `
      function Hello({ foo = '' }) {
        return <p>{foo}</p>
      }
      memo(Hello, shouldSkipUpdate([]))
    `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'function SomeComponent({bar}) {',
        '  function f({foo}) {}',
        '  return <div className={f()}>{bar}</div>;',
        '}',
        'memo(SomeComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ]
    },
    {
      code: [
        'function SomeComponent({bar} = baz) {',
        '  function f({foo}) {}',
        '  return <div className={f()}>{bar}</div>;',
        '}',
        'memo(SomeComponent, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.PureComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'class Hello extends PureComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'type MyComponentProps = {',
        '  a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}',
        'memo(MyComponent, shouldSkipUpdate([\'a\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'b'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'b'}
        }
      ]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {},',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'var Hello = function(props) {',
        '  return <div>{props.firstname}</div>;',
        '};',
        'Hello.propTypes = {}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {};',
        '  }',
        '  render() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      options: [{skipUndeclared: false}],
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'type MyComponentProps = {',
        '  +a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}',
        'memo(MyComponent, shouldSkipUpdate([\'a\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'b'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'b'}
        }
      ]
    },
    {
      code: [
        'type MyComponentProps = {',
        '  -a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}',
        'memo(MyComponent, shouldSkipUpdate([\'a\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'b'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'b'}
        }
      ]
    },
    {
      code: [
        'type Props = {+name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'+name\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'firstname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'firstname'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  onSelect = async ({ name }) => {',
        '    return this.props.foo;',
        '  }',
        '  render() {',
        '    return <Greeting onSelect={this.onSelect} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  static propTypes = forbidExtraProps({',
        '    bar: PropTypes.func',
        '  })',
        '  componentWillReceiveProps(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps(nextProps) {',
        '    const {foo} = nextProps;',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  static propTypes = forbidExtraProps({',
        '    bar: PropTypes.func',
        '  })',
        '  shouldComponentUpdate(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        'memo(Hello, shouldSkipUpdate([\'bar\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo'}
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes() {',
        '    return {',
        '      name: PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([]))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const {',
        '      lastname,',
        '    } = this.props;',
        '    return <div>Hello {lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const {',
        '      lastname,',
        '    } = this.props;',
        '    return <div>Hello {lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'name.firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'result.notok'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'result.notok'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'result.ok\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'result.notok'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'result.notok'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.firstname\']))'
      ].join('\n'),
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.lastname}</div>;',
        '  }',
        '}',
        'memo(Hello, shouldSkipUpdate([\'person.firstname\']))'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }

        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }

        memo(Bar,shouldSkipUpdate(['foo']))
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }

        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }
        memo(Bar, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
        memo(Hello, shouldSkipUpdate(['person.firstname']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
        memo(Hello, shouldSkipUpdate(['person.firstname']))
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'person.lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'person.lastname'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type Props = { foo: string }
        function higherOrderComponent<Props>() {
          return class extends React.Component<Props> {
            render() {
              return <div>{this.props.foo} - {this.props.bar}</div>
            }
          }
        }

        memo(higherOrderComponent, shouldSkipUpdate(['foo']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div>{this.props.foo} - {this.props.bar}</div>
            }
          }
        }

        memo(higherOrderComponent, shouldSkipUpdate(['foo']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        const withOverlayState = <P: {foo: string}>(WrappedComponent: ComponentType<P>): CpmponentType<P> => (
          class extends React.Component<P> {
            constructor(props) {
              super(props);
              this.state = {foo: props.foo, bar: props.bar}
            }
            render() {
              return <div>Hello World</div>
            }
          }
        )

        memo(withOverlayState, shouldSkipUpdate(['foo']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsA = {foo: string };
        type PropsB = { bar: string };
        type Props = PropsA & PropsB;

        class MyComponent extends React.Component {
          props: Props;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.fooBar}</div>
          }
        }

        memo(MyComponent, shouldSkipUpdate(['foo', 'bar', 'baz', 'zap']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'fooBar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'fooBar'}
        }
      ]
    },
    {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap} - {this.props.fooBar}</div>
          }
        }

        memo(Bar, shouldSkipUpdate(['foo', 'bar', 'baz', 'zap']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'fooBar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'fooBar'}
        }
      ]
    },
    {
      code: `
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsB & {
          baz: string
        };

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.bar} - {this.props.baz} - {this.props.fooBar}</div>
          }
        }

        memo(Bar, shouldSkipUpdate(['bar', 'baz', 'zap']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'fooBar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'fooBar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = {
          baz: string
        } & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.bar} - {this.props.baz} - {this.props.fooBar}</div>
          }
        }

        memo(Bar, shouldSkipUpdate(['bar', 'baz', 'zap']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'fooBar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'fooBar'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      type ReduxState = {bar: number};

      const mapStateToProps = (state: ReduxState) => ({
          foo: state.bar,
      });
      // utility to extract the return type from a function
      type ExtractReturn_<R, Fn: (...args: any[]) => R> = R;
      type ExtractReturn<T> = ExtractReturn_<*, T>;

      type PropsFromRedux = ExtractReturn<typeof mapStateToProps>;

      type OwnProps = {
          baz: string,
      }

      // I want my Props to be {baz: string, foo: number}
      type Props = PropsFromRedux & OwnProps;

      const Component = (props: Props) => (
        <div>
            {props.baz}
            {props.bad}
        </div>
      );

      memo(Component, shouldSkipUpdate(['baz', 'foo']))
    `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bad'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bad'}
        }
      ],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }

        memo(Component, shouldSkipUpdate(['foo.bar']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.baz'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.baz'}
        }
      ]
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => ({ current: props.current, bar: props.bar }));
          }
          render() {
            return <div />;
          }
        }

        memo(Foo, shouldSkipUpdate(['current']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ]
    },
    {
      code: `
        class Foo extends React.Component {
          setZoo() {
            this.setState((state, {zoo}) => ({ zoo }));
          }
          render() {
            return <div />;
          }
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'zoo'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'zoo'}
        }
      ]
    },
    {
      code: `
        class Foo extends React.Component {
          static getDerivedStateFromProps(props) {
            const { foo, bar } = props;
            return {
              foobar: foo + bar
            };
          }

          render() {
            const { foobar } = this.state;
            return <div>{foobar}</div>;
          }
        }

        memo(Foo, shouldSkipUpdate(['foo']))
      `,
      settings: {react: {version: '16.3.0'}},
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }
      ]
    },
    {
      code: `
        const ForAttendees = ({ page }) => (
          <>
            <section>{page}</section>
          </>
        );

        export default memo(ForAttendees, shouldSkipUpdate([]));
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'page'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'page'}
        }
      ]
    },
    {
      code: `
        const HeaderBalance = React.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate([]));
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cryptoCurrency'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cryptoCurrency'}
        }
      ]
    },
    {
      code: `
        import React, { memo } from 'react';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate([]));
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cryptoCurrency'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cryptoCurrency'}
        }
      ]
    },
    {
      // only: true,
      code: `
        const HeaderBalance = Foo.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate([]));
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cryptoCurrency'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cryptoCurrency'}
        }
      ]
    },
    {
      code: `
        import Foo, { memo } from 'foo';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ), shouldSkipUpdate([]));
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'cryptoCurrency'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'cryptoCurrency'}
        }
      ]
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        memo(Label, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        import React, { forwardRef } from 'react';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        memo(Label, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        const Label = Foo.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        memo(Label, shouldSkipUpdate([]))
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        import Foo, { forwardRef } from 'foo';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        memo(Label, shouldSkipUpdate([]))
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    }, {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent = (props) => {
          switch (props.usedProp) {
            case 1:
              return (<div />);
            default:
              return <div />;
          }
        };

        export default memo(MyComponent, shouldSkipUpdate([]));
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'usedProp'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'usedProp'}
        }
      ]
    },
    {
      code: `
        export default memo(class Controller extends React.Component {
          handleAdd = id => {
            this.setState((state, { name }) => {
                const item = this.buildItem(id);
            });
          };
        }, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: `
        export default memo(class extends React.Component {
          onSubmit = () => {
            this.setState((state, { a }) => {
              a.b.c();
              return null;
            });
          };

          render() {
            return null;
          }
        }, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'a.b.c'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'a.b.c'}
        }
      ]
    },
    {
      code: `
        class Foo extends React.Component {
          contructor(props) {
            super(props);
            this.initialValues = {
              test: '',
            };
          }

          render = () => {
            return (
              <Component
                initialValues={this.props.initialValues || this.initialValues}
              >
                {formikProps => (
                  <Input {...formikProps} />
                )}
              </Component>
            );
          }
        }
        memo(Foo, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'initialValues'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'initialValues'}
        }
      ]
    },
    {
      // issue #2138
      code: `
        type UsedProps = {|
          usedProp: number,
        |};

        type UnusedProps = {|
          unusedProp: number,
        |};

        type Props = {| ...UsedProps, ...UnusedProps |};

        function MyComponent({ usedProp, notOne }: Props) {
          return <div>{usedProp}</div>;
        }

        memo(MyComponent, shouldSkipUpdate(['usedProp', 'unusedProp']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'notOne'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'notOne'}
        }
      ]
    },
    {
      // issue #2298
      code: `
        type Props = {|
          firstname?: string
        |};

        function Hello({ firstname = 'John', lastname = 'Doe' }: Props = {}) {
          return <div>Hello {firstname} {lastname}</div>
        }

        memo(Hello, shouldSkipUpdate(['firstname']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'lastname'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'lastname'}
        }
      ]
    },
    {
      // issue #2330
      code: `
        type Props = {
          user: {
            name: {
              firstname: string,
              [string]: string
            }
          }
        };

        function Bar(props: Props) {
          return (
            <div>
              {props.user}
              {props.user.name.firstname}
              {props.user.name.lastname}
              {props.user.age}
            </div>
          );
        }

        export default memo(Bar, shouldSkipUpdate(['user.name.firstname', 'user.name.lastname']))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'user.age'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'user.age'}
        }
      ]
    },
    {
      code: `
        const Label = React.memo(React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate([]));
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate([]));
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }), shouldSkipUpdate([]));
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'text'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'text'}
        }
      ]
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }

        Foo.propTypes = {
          foo: PropTypes.shape({
            bar: PropTypes.arrayOf(PropTypes.string).isRequired,
          }).isRequired,
        };

        memo(Foo, shouldSkipUpdate(['foo.bar']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.baz'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.baz'}
        }
      ]
    },
    {
      code: `
        const Foo = ({length, ordering}) => (
          length > 0 && (
            <Paginator items={ordering} pageSize={10} />
          )
        );
        memo(Foo, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'length'}
        },
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'ordering'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'length'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'ordering'}
        }
      ]
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        });
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType.isRequired,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
        memo(ComponentX, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'first.name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'first.name'}
        }
      ]
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        }).isRequired;
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
        memo(ComponentX, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'first.name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'first.name'}
        }
      ]
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        });
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
        memo(ComponentX, shouldSkipUpdate([]))
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'first.name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'first.name'}
        }
      ]
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        const fooType = PropTypes.shape({
          bar: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired
        Foo.propTypes = {
          foo: fooType,
        };
        memo(Foo, shouldSkipUpdate(['foo.bar']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.baz'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.baz'}
        }
      ]
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        const fooType = PropTypes.shape({
          bar: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
        Foo.propTypes = {
          foo: fooType.isRequired,
        };
        memo(Foo, shouldSkipUpdate(['foo.bar']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.baz'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.baz'}
        }
      ]
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        
        memo(Foo, shouldSkipUpdate(['foo.bar']))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'foo.baz'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'foo.baz'}
        }
      ]
    },
    {
      code: `
        function Component(props) {
          return 0,
          <div>
            Hello, { props.name }!
          </div>
        }
        memo(Component, shouldSkipUpdate([]))
      `,
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'name'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'name'}
        }
      ]
    },
    {
      code: `
      const SideMenu = observer(
        ({ componentId }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={componentId} />
          </S.Container>
        ),
      );
      memo(SideMenu, shouldSkipUpdate([]))
      `,
      settings: {
        componentWrapperFunctions: ['observer']
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'componentId'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'componentId'}
        }
      ]
    },
    {
      code: `
      const SideMenu = Mobx.observer(
        ({ id }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={id} />
          </S.Container>
        ),
      );
      memo(SideMenu, shouldSkipUpdate([]))
      `,
      settings: {
        componentWrapperFunctions: [{property: 'observer', object: 'Mobx'}]
      },
      errors: [
        {
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'id'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'id'}
        }
      ]
    },
    parsers.TS([
      {
        code: `
          interface Props {
          }
          const Hello = (props: Props) => {
            if (props.value) {
              return <div></div>;
            }
            return null;
          }
          memo(Hello, shouldSkipUpdate([]))
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'value'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'value'}
          }
        ]
      },
      {
        code: `
          interface Props {
          }
          const Hello = (props: Props) => {
            if (props.value) {
              return <div></div>;
            }
            return null;
          }

          memo(Hello, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'value'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'value'}
          }
        ]
      },
      {
        code: `
          type User = {
            user: string;
          }

          type Props = User & {
          };

          export default (props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          };
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [{
          messageId: 'missingPropType',
          data: {name: 'userId'}
        }]
      },
      {
        code: `
          type User = {
            user: string;
          }

          type Props = User & {
          };

          export default (props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          };
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [{
          messageId: 'missingPropType',
          data: {name: 'userId'}
        }]
      },
      {
        code: `
          type User = {
          }

          type Props = User & {
            userId
          };

          export default (props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          };
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [{
          messageId: 'missingPropType',
          data: {name: 'user'}
        }]
      },
      {
        code: `
          type User = {
          }

          type Props = User & {
            userId
          };

          export default memo((props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          }, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [{
          messageId: 'missingPropType',
          data: {name: 'user'}
        }]
      },
      {
        code: `
          type User = {
            user: string;
          }
          type UserProps = {
          }

          type Props = User & UserProps;

          export default (props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          };
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [{
          messageId: 'missingPropType',
          data: {name: 'userId'}
        }]
      },
      {
        code: `
          type User = {
            user: string;
          }
          type UserProps = {
          }

          type Props = User & UserProps;

          export default memo((props: Props) => {
            const { userId, user } = props;

            if (userId === 0) {
              return <p>userId is 0</p>;
            }

            return null;
          }, shouldSkipUpdate([]));
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'userId'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'user'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'userId'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'user'}
          }
        ]
      },
      {
        code: `
          interface GenericProps {
            onClose: () => void
          }

          interface ImplementationProps extends GenericProps {
          }

          const Implementation: FC<ImplementationProps> = (
            {
              onClick,
              onClose,
            }: ImplementationProps
          ) => (<div />)

          memo(Implementation, shouldSkipUpdate([]))
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'onClick'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'onClose'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'onClick'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'onClose'}
          }
        ]
      },
      {
        code: `
          interface GenericProps {
            onClose: () => void
          }

          interface ImplementationProps extends GenericProps {
          }

          const Implementation: FC<ImplementationProps> = (
            {
              onClick,
              onClose,
            }: ImplementationProps
          ) => (<div />)

          memo(Implementation, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'onClick'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'onClose'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'onClick'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'onClose'}
          }
        ]
      },
      {
        code: `
          const mapStateToProps = state => ({
          });

          interface BooksTable extends ReturnType<typeof mapStateToProps> {
            username: string;
          }

          const App = (props: BooksTable) => {
            props.books();
            return <div><span>{props.username}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'books'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'username'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'books'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'username'}
          }
        ]
      },
      {
        code: `
          const mapStateToProps = state => ({
          });

          interface BooksTable extends ReturnType<typeof mapStateToProps> {
            username: string;
          }

          const App = (props: BooksTable) => {
            props.books();
            return <div><span>{props.username}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'books'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'username'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'books'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'username'}
          }
        ]
      },
      {
        code: `
          const mapStateToProps = state => ({
            books: state.books,
          });

          interface BooksTable extends ReturnType<typeof mapStateToProps> {
          }

          const App = (props: BooksTable) => {
            props.books();
            return <div><span>{props.username}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'books'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'username'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'books'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'username'}
          }
        ]
      },
      {
        code: `
          const mapStateToProps = state => ({
            books: state.books,
          });

          interface BooksTable extends ReturnType<typeof mapStateToProps> {
          }

          const App = (props) => {
            props.books();
            return <div><span>{props.username}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'books'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'username'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'books'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'username'}
          }
        ]
      },
      {
        code: `
          type Event = {
              name: string;
              type: string;
          }

          interface UserEvent extends Event {
              UserId: string;
          }
          const App = (props: UserEvent) => {
            props.name();
            props.type;
            props.UserId;
            return <div><span>{props.dateCreated}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers.TYPESCRIPT_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'name'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'type'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'UserId'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'dateCreated'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'name'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'type'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'UserId'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'dateCreated'}
          }
        ]
      },
      {
        code: `
          type Event = {
              name: string;
              type: string;
          }

          interface UserEvent extends Event {
              UserId: string;
          }

          const App = (props: UserEvent) => {
            props.name();
            props.type;
            props.UserId;
            return <div><span>{props.dateCreated}</span></div>;
          }

          memo(App, shouldSkipUpdate([]))
        `,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'name'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'type'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'UserId'}
          },
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'dateCreated'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'name'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'type'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'UserId'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'dateCreated'}
          }
        ]
      },
      {
        code: `
          function Zoo(props) {
            return (
              <>
                {props.foo.c}
              </>
            );
          }

          memo(Zoo, shouldSkipUpdate(['foo.a', 'foo.b']))
        `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'foo.c'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'foo.c'}
          }
        ]
      },
      {
        code: `
          function Zoo(props) {
            return (
              <>
                {props.foo.c}
              </>
            );
          }

          memo(Zoo, shouldSkipUpdate(['foo.a', 'foo.b']))
        `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'foo.c'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'foo.c'}
          }
        ]
      },
      {
        code: `
          function Zoo(props) {
            return (
              <>
                {props.foo.c}
              </>
            );
          }

          memo(Zoo, shouldSkipUpdate(['foo.a', 'foo.b']))
        `,
        settings,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'foo.c'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'foo.c'}
          }
        ]
      },
      {
        code: `
          const Foo: JSX.Element = ({ bar }) => {
            return <div>{bar}</div>;
          }

          memo(foo, shouldSkipUpdate([]))
        `,
        settings,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [{
          messageId: 'missingFromShouldSkipUpdateDependencies',
          data: {name: 'bar'}
        },
        {
          messageId: 'missingShouldSkipUpdateDependency',
          data: {name: 'bar'}
        }]
      },
      {
        code: `
          const Foo: JSX.Element = function foo ({ bar }) {
            return <div>{bar}</div>;
          }

          memo(Foo, shouldSkipUpdate([]))
        `,
        settings,
        parser: parsers['@TYPESCRIPT_ESLINT'],
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'bar'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'bar'}
          }
        ]
      },
      // fix #2804
      {
        code: `
        import React from 'react'

        const InputField = ({ type, ...restProps }) => {

          return(
            <input
              type={type}
              {...restProps}
            />
          )
        }

        export default memo(InputField, shouldSkipUpdate([]));
      `,
        parser: parsers.BABEL_ESLINT,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'type'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'type'}
          }
        ]
      },
      {
        code: `
        const Foo: JSX.Element = ({ bar = "" }) => {
          return <div>{bar}</div>;
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'bar'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'bar'}
          }
        ],
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
        function Foo({ foo = "" }): JSX.Element {
          return <div>{foo}</div>;
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'foo'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'foo'}
          }
        ],
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
        const Foo: JSX.Element = function foo ({ bar = "" }) {
          return <div>{bar}</div>;
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'bar'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'bar'}
          }
        ],
        parser: parsers['@TYPESCRIPT_ESLINT']
      },
      {
        code: `
        function Foo({ bar = "" as string }): JSX.Element {
          return <div>{bar}</div>;
        }

        memo(Foo, shouldSkipUpdate([]))
      `,
        errors: [
          {
            messageId: 'missingFromShouldSkipUpdateDependencies',
            data: {name: 'bar'}
          },
          {
            messageId: 'missingShouldSkipUpdateDependency',
            data: {name: 'bar'}
          }
        ],
        parser: parsers['@TYPESCRIPT_ESLINT']
      }
    ])
  )
};

if (!process.env.CI) {
  const only = [];
  const skipped = [];

  const newTests = Array.from(tests.valid).concat(Array.from(tests.invalid));

  newTests.forEach((t) => {
    if (t.skip) {
      delete t.skip;
      skipped.push(t);
    }
    if (t.only) {
      delete t.only;
      only.push(t);
    }
  });

  const predicate = (t) => {
    // These tests never seem to run proptype checks anyway
    if (t.parser === parsers['@TYPESCRIPT_ESLINT']) {
      return false;
    }
    if (only.length > 0) {
      return only.indexOf(t) !== -1;
    }
    if (skipped.length > 0) {
      return skipped.indexOf(t) === -1;
    }
    return true;
  };

  tests.valid = tests.valid.filter(predicate).map((t) => {
    const settings = t.settings || {}
    if (!t.code) t = {code: t}
    return {...t, settings: {...settings, react: {version: 'detect', ...settings.react}}}
  });
  tests.invalid = tests.invalid.filter(predicate).map((t) => {
    const options = t.options || [];
    const settings = t.settings || {};
    if (options.length > 1) {
      throw (new Error('Idk what is going on'));
    } else if (options.length === 1) {
      // console.info(8192, {...t, options: [{...options[0], ignoreExtra: true}], settings: {...settings, react: {version: 'detect', ...settings.react}}})
      return {...t, options: [{...options[0], ignoreExtra: true}], settings: {...settings, react: {version: 'detect', ...settings.react}}}
      // return Object.assign({}, t, {options: [Object.assign({}, options[0], {ignoreExtra: true})]});
    } else {
      // console.info(8196, {...t, options: [{ignoreExtra: true}], settings: {...settings, react: {version: 'detect', ...settings.react}}})
      return {...t, options: [{ignoreExtra: true}], settings: {...settings, react: {version: 'detect', ...settings.react}}}
      // return Object.assign({}, t, {options: [{ignoreExtra: true}]});
    }

    // Object.assign({}, t, {options: (t.options || []).concat([{ignoreExtra: true}])})
  });
}

describe('should-skip-update', () => {
  const parserOptions = {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  };

  tests.valid.forEach((t) => {
  	it('should contain shouldSkipUpdate', () => {
  		if (!t.code) t = {code: t};
  		if (!t.code.includes('shouldSkipUpdate')) {
  			console.info(t.code);
  		}
  		expect(t.code).toContain('shouldSkipUpdate');
  	});
  });

  tests.invalid.forEach((t) => {
  	it('should contain shouldSkipUpdate', () => {
  		if (!t.code) t = {code: t};
  		if (!t.code.includes('shouldSkipUpdate')) {
  			console.info(t.code);
  		}
  		expect(t.code).toContain('shouldSkipUpdate');
  	});
  });

  const ruleTester = new RuleTester({parserOptions});
  ruleTester.run('should-skip-update', rule, tests);
});
