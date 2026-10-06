// @ts-check

const defaultMinimumTimeout = 15_000;

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
export const requireNavigationAssertionTimeout = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "require explicit timeouts for configured assertions",
    },
    schema: [
      {
        type: "array",
        items: {
          type: "object",
          required: ["name", "index"],
          properties: {
            name: { type: "string" },
            index: { type: "integer", minimum: 0 },
            timeout: { type: "number", minimum: 1 },
          },
          additionalProperties: false,
        },
      },
    ],
    messages: {
      timeout: "{{ assertion }} assertions must set a timeout of at least {{ minimumTimeout }}ms.",
    },
  },
  create(context) {
    /** @type {import("../oxlint").NavigationAssertionTimeoutConfig} */
    const assertions = context.options[0] ?? [];

    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== "MemberExpression" || callee.computed) {
          return;
        }

        const propertyName =
          callee.property.type === "Identifier" ? callee.property.name : undefined;
        const assertion = assertions.find(({ name }) => name === propertyName);
        if (!assertion) return;

        const minimumTimeout = assertion.timeout ?? defaultMinimumTimeout;
        const optionsIndex = assertion.index;
        const options = node.arguments[optionsIndex];
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
          data: { assertion: assertion.name, minimumTimeout },
          fix(fixer) {
            if (timeout) {
              return value?.type === "Literal" && typeof value.value === "number"
                ? fixer.replaceText(value, String(minimumTimeout))
                : null;
            }

            if (options?.type !== "ObjectExpression") {
              const previousArgument = node.arguments[optionsIndex - 1];
              return optionsIndex === node.arguments.length && previousArgument
                ? fixer.insertTextAfter(previousArgument, `, { timeout: ${minimumTimeout} }`)
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
