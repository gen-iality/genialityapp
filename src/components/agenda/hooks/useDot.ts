const useDot = () => {
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

  return dot;
}

export default useDot;
