import * as React from 'react';
import { useMemo } from 'react';
import { Badge } from 'antd';

interface QuizBadgetProps {
  isRight?: boolean,
  message: string,
};

function QuizBadge(props: QuizBadgetProps) {
  const {
    isRight,
    message,
  } = props;

  /**
   * The badget color, gray while it is processing, red and green pretty to other states
   */
   const badgetColor = useMemo(() => {
    // Check out the 3 status
    if (isRight === undefined) return '#7D7D7D';
    return isRight ? '#5EB841' : '#B8415A';
  }, [isRight]);

  return (
    <Badge count={message} style={{ backgroundColor: badgetColor }}/>
  );
}

export default QuizBadge;