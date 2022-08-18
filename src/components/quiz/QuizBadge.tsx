import * as React from 'react';
import { useMemo } from 'react';
import { Badge } from 'antd';

interface QuizBadgetProps {
  isPassedQuiz?: boolean,
  passedMessage: string,
};

function QuizBadge(props: QuizBadgetProps) {
  const {
    isPassedQuiz,
    passedMessage,
  } = props;

  /**
   * The badget color, gray while it is processing, red and green pretty to other states
   */
   const badgetColor = useMemo(() => {
    // Check out the 3 status
    if (isPassedQuiz === undefined) return '#7D7D7D';
    return isPassedQuiz ? '#5EB841' : '#B8415A';
  }, [isPassedQuiz]);

  return (
    <Badge count={passedMessage} style={{ backgroundColor: badgetColor }}/>
  );
}

export default QuizBadge;