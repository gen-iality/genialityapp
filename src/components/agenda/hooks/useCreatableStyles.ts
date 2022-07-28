interface ParamType {
  data: {
    item: {
      color: any
    }
  }
};

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10,
  },
});

const useCreatableStyles = () => {
  // Some select styles
  const creatableStyles = {
    menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }),
    multiValue: (styles: object, param: ParamType) => (
      { ...styles, ...dot(param.data?.item?.color) }
    ),
  };
  return creatableStyles;
}

export default useCreatableStyles;
