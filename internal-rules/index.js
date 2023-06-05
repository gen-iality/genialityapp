function formatStateSetterName(input) {
  if (input.toLowerCase() === 'set') return 'setX'

  if (input.startsWith('set')) {
    if (input.charAt(3) !== input.charAt(3).toUpperCase()) {
      return 'set' + input.charAt(3).toUpperCase() + input.slice(4)
    }
  } else {
    return 'set' + input.charAt(0).toUpperCase() + input.slice(1)
  }

  return input
}

const niceStateSetterName = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure state setter names are nicely written',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        enum: [0, 1],
      },
    ],
  },

  create: function (context) {
    const severity = context.options[0] === 0 ? 0 : 1
    // console.log('context', context)

    function checkVariableName(node) {
      // console.log('node type:', node.type)
      // console.log('type:', node.id?.type)
      // console.log('init name', node.init?.name, node)
      if (
        !node.init ||
        node.init.type !== 'CallExpression' ||
        node.init.callee.name !== 'useState'
      )
        return

      const [_, setVariable] = node.id.elements
      const name = setVariable && setVariable.name
      // console.log('name', name)

      const pattern = /^set[A-Z]\w*$/

      if (!pattern.test(name)) {
        context.report({
          node,
          message: `The state setter should have the formato setVarName.`,
          severity,
          fix: (fixer) => {
            fixer.replaceText(name, formatStateSetterName(name))
          },
          data: {
            name,
          },
        })
      }
    }

    return {
      VariableDeclarator: checkVariableName,
      // VariableDeclaration: checkVariableName,
    }
  },
}

module.exports = {
  rules: {
    'nice-state-setter-name': niceStateSetterName,
  },
}
