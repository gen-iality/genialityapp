import * as React from 'react';
import { useMemo, memo } from 'react';
import './Line.css';

export interface LineProps {
  isActive?: boolean | number;
  isSurvey?: boolean;
}

function Step(props: LineProps) {
  const { isActive, ...rest } = props;

  const className = useMemo(() => {
    if (isActive) {
      return 'Line active';
    }
    return 'Line';
  }, [isActive]);

  return <div className={className} {...rest}></div>;
}

export default memo(Step);
