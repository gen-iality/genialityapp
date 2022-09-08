import * as React from 'react';
import { useMemo, memo } from 'react';
import './Step.css';

export interface StepProps {
  children: React.ReactNode,
  isActive?: boolean,
};

function Step(props: StepProps) {
  const {
    children,
    isActive,
    ...rest
  } = props;

  const className = useMemo(() => {
    if (isActive) {
      return 'Step active';
    }
    return 'Step';
  }, [isActive]);

  return (
    <div {...rest} className={className}>
      {children}
    </div>
  );
}

export default memo(Step);
