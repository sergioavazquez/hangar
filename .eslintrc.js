module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": ["airbnb-base", "prettier", "plugin:node/recommended", "plugin:security/recommended"],
    "plugins": ["prettier", "security"],
    "rules": {
        "no-console": "off",
        "func-names": "off",
        "no-underscore-dangle":"off",
        "prettier/prettier": [
          "error",
          { "singleQuote": true, "trailingComma": "es5" }
        ]
      }
};