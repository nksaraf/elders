const {declare} = require('@babel/helper-plugin-utils');
const {types: t} = require('@babel/core');

module.exports = declare((api) => {
  api.assertVersion(7);

  const visitor = {
    JSXOpeningElement(path, state) {
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development')
        return;

      const location = path.container.openingElement.loc;

      // The element was generated and doesn't have location information
      if (!location) return;

      // ignore React.Fragment
      if (
        path.container.openingElement.name &&
        path.container.openingElement.name.object &&
        path.container.openingElement.name.property &&
        path.container.openingElement.name.object.name === 'React' &&
        path.container.openingElement.name.property.name === 'Fragment'
      ) {
        return;
      }

      const attributes = path.container.openingElement.attributes;

      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('data-source-filename'),
          t.stringLiteral(state.filename)
        ),
        t.jsxAttribute(
          t.jsxIdentifier('data-source-line-start'),
          t.stringLiteral(location.start.line.toString())
        ),
        t.jsxAttribute(
          t.jsxIdentifier('data-source-line-end'),
          t.stringLiteral(location.end.line.toString())
        )
      );
    }
  };

  return {
    name: 'transform-react-jsx-source-data-attributes',
    visitor
  };
});
