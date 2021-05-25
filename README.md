# eslint-plugin-should-skip-update

Eslint plugin for making sure all used prop values are listed in the `shouldSkipUpdate` memo function argument.

## Usage

Add to your `eslint` configuration plugins:
```
{
    ...
    plugins: [...other_plugins, 'should-skip-update'],
    ...
}
```

Enable the rule in your `eslint` configuration:
```
{
    ...
    rules: {
        ...other_rules,
        'should-skip-update/dependencies': 1
    }
}
```

See `should-skip-update` for more information.