// @ts-check

const minimumTimeout = 15_000;

/**
 * @param {import("estree").ObjectExpression["properties"][number]} property
 * @returns {property is import("estree").Property}
 */
function isTimeoutProperty(property) {
  return (
    property.type === "Property" &&
    !property.computed &&
    property.key.type === "Identifier" &&
    property.key.name === "timeout"
  );
}

/** @type {import("eslint").Rule.RuleModule} */
export const requireToHaveUrlTimeout = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "require an explicit timeout of at least 15 seconds for toHaveURL assertions",
    },
    schema: [],
    messages: {
      timeout: "toHaveURL assertions must set a timeout of at least {{ minimumTimeout }}ms.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          callee.type !== "MemberExpression" ||
          callee.computed ||
          callee.property.type !== "Identifier" ||
          callee.property.name !== "toHaveURL"
        ) {
          return;
        }

        const options = node.arguments[1];
        const timeoutProperties =
          options?.type === "ObjectExpression" ? options.properties.filter(isTimeoutProperty) : [];
        const timeout = timeoutProperties[timeoutProperties.length - 1];
        const value = timeout?.value;
        if (
          value?.type === "Literal" &&
          typeof value.value === "number" &&
          value.value >= minimumTimeout
        ) {
          return;
        }

        context.report({
          node,
          messageId: "timeout",
          data: { minimumTimeout },
          fix(fixer) {
            if (timeout) {
              return value?.type === "Literal" && typeof value.value === "number"
                ? fixer.replaceText(value, String(minimumTimeout))
                : null;
            }

            if (options?.type !== "ObjectExpression") {
              const expected = node.arguments[0];
              return expected
                ? fixer.insertTextAfter(expected, `, { timeout: ${minimumTimeout} }`)
                : null;
            }

            const lastProperty = options.properties[options.properties.length - 1];
            if (lastProperty) {
              return fixer.insertTextAfter(lastProperty, `, timeout: ${minimumTimeout}`);
            }

            const range = options.range;
            return range
              ? fixer.insertTextBeforeRange(
                  [range[1] - 1, range[1] - 1],
                  ` timeout: ${minimumTimeout} `,
                )
              : null;
          },
        });
      },
    };
  },
};
