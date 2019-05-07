module.exports = {
    "extends": [
        "airbnb",
        "plugin:jsx-a11y/recommended"
    ],
    "plugins": [
        "import",
        "react",
        "jsx-a11y"
    ],
    "env": {
        "browser": true
    },
    "rules": {
        "jsx-a11y/href-no-hash": "off",
        "jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }],
        "linebreak-style": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "indent": 0,
        "react/jsx-indent": 0,
        "react/prefer-stateless-function": 0,
        "max-len": 0,
        "spaced-comment": 0,
        "no-unused-vars": 0,
        "prefer-template": 0,
        "import/no-dynamic-require": 0,
        "no-param-reassign": 0,
        "import/newline-after-import": 0,
        "object-shorthand": 0,
        "eqeqeq": 0,
        "no-shadow": 0,
        "prefer-const": 0,
        "no-tailing-spaces": 0,
        "no-tabs": 0,
        "react/prop-types": 0,
        "arrow-body-style": 0,
        "space-in-parens": 0,
        "react/jsx-no-bind": 0,
        "react/no-array-index-key": 0,
        "react/jsx-boolean-value": 0,
        "react/jsx-indent-props": 0,
        "react/self-closing-comp": 0,
        "dot-notation": 0,
        "no-underscore-dangle": 0,
    }

};