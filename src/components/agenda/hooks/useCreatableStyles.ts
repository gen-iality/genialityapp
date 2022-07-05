import useDot from "./useDot";

interface ParamType {
  data: {
    item: {
      color: any
    }
  }
};

const useCreatableStyles = () => {
  const dot = useDot();
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
