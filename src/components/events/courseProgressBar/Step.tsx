import * as React from 'react';
import { useMemo, memo, useEffect, useState } from 'react';
import './Step.css';

export interface StepProps {
  children: React.ReactNode;
  isActive?: boolean | number;
  isSurvey?: boolean;
  key?: string;
  /* onChangeFunction?: any; */
  setCurrentId?: any;
  currentId?: any;
  id?: string;
  onClick?: () => void;
}

function Step(props: StepProps) {
  const { children, isActive, isSurvey, key, currentId, setCurrentId, id, ...rest } = props;

  let className = useMemo(() => {
    if (isActive) {
      return 'Step active';
    }
    return 'Step';
  }, [isActive]);

  return (
    <div
      className={className}
      style={{
        borderRadius: isSurvey ? '' : '50%',
        backgroundColor: currentId == id ? '#043558' : '',
        color: currentId == id ? '#fff' : '',
      }}
      {...rest}
      onClick={() => {
        setCurrentId(id);
        props.onClick && props.onClick();
      }}
    >
      {children}
    </div>
  );
}

export default memo(Step);
