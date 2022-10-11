import { BallotHistoryInterface, BingoWinnerOrLoserInterface } from '../interfaces/bingo';
import { Modal } from 'antd';

export const orderedDemonstratedBallots = ({ demonstratedBallots }: BallotHistoryInterface) => {
  const demonstratedBallotsArray = [...demonstratedBallots].reverse();

  return demonstratedBallotsArray;
};

export const bingoWinnerOrLoser = ({ title, type, onOk }: BingoWinnerOrLoserInterface) => {
  Modal[type]({
    title: title,
    cancelButtonProps: { style: { display: 'none' } },
    onOk() {
      onOk();
    },
  });
};

export const weAreInCms = () => {
  const urlPathname: string = window.location.pathname;
  const renderingInCms: boolean = urlPathname.includes('eventadmin');
  return renderingInCms;
};
