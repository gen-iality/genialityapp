import { weAreInCms } from '../functions';
import BallotHistory from './BallotHistory';

const BallotHistoryContainer = ({ demonstratedBallots }: { demonstratedBallots: string[] | [] }) => {
  return <BallotHistory demonstratedBallots={demonstratedBallots} renderingInCms={weAreInCms()} />;
};

export default BallotHistoryContainer;
