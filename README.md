# eslint-plugin-should-skip-update

Eslint plugin for making sure all used prop values are listed in the `shouldSkipUpdate` memo function argument for [`should-skip-update`](https://github.com/joeyparis/should-skip-update).

## Installation

```bash
npm intsall --save-dev eslint-plugin-should-skip-update
```

or

```bash
yarn add -D eslint-plugin-should-skip-update
```

## Usage

Add to your `eslint` configuration plugins:
```javascript
{
    ...
    plugins: [...other_plugins, 'should-skip-update'],
    ...
}
```

Enable the rule in your `eslint` configuration:
```javascript
{
    ...
    rules: {
        ...other_rules,
        'should-skip-update/dependencies': 1
    }
}
```

See [`should-skip-update`](https://github.com/joeyparis/should-skip-update) for more information.
