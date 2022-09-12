import * as React from 'react';
import { useMemo, memo } from 'react';
import './Step.css';

export interface StepProps {
  children: React.ReactNode,
  isActive?: boolean,
  isSurvey?: boolean,
};

function Step(props: StepProps) {
  const {
    children,
    isActive,
    isSurvey,
    ...rest
  } = props;

  const className = useMemo(() => {
    if (isActive) {
      return 'Step active';
    }
    return 'Step';
  }, [isActive]);

  return (
    <div
      className={className}
      style={{ borderRadius: isSurvey ? '':'50%'}}
      {...rest}
    >
      {children}
    </div>
  );
}

export default memo(Step);
