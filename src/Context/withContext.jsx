export const withContext = (Component) => (props) => (
  <ThemeContext.Consumer>{(context) => <Component themeContext={context} {...props} />}</ThemeContext.Consumer>
);
