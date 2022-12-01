import { BallotHistoryInterface, BingoWinnerOrLoserInterface, format } from '../interfaces/bingo';
import { Modal } from 'antd';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import {
  gridTextBreaking_5x5,
  gridTextNotBreaking_5x5,
  gridText_5x5,
  gridTextBreakingMobile_5x5,
  gridTextNotBreakingMobile_5x5,
  gridTextBreakingMobile_3x3,
  gridTextBreaking_3x3,
  gridTextNotBreakingMobile_3x3,
  gridTextNotBreaking_3x3,
  gridText_3x3,
  gridTextBreakingMobile_4x4,
  gridTextBreaking_4x4,
  gridTextNotBreakingMobile_4x4,
  gridTextNotBreaking_4x4,
  gridText_4x4,
  gridTextOnlyNumberMobile_4x4,
  gridTextOnlyNumber_4x4,
  gridTextOnlyNumber_3x3,
  gridTextOnlyNumberMobile_3x3,
  gridTextOnlyNumberMobile_5x5,
  gridTextOnlyNumber_5x5,
} from '../constants/styleConstants';

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

// funcion para determinar la cantidad de palabras en un string
const determineNumberWords = (text: string) => {
  let splitText: string[] = text.split(' ');
  /* console.log('splitText', splitText); */
  return splitText.length;
};
// funcion para determinar los estilos del texto en el carton
export const determineFontStyles = (
  text: string,
  format: format,
  screens: Partial<Record<Breakpoint, boolean>>
): React.CSSProperties => {
  const LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED = 6;
  let textLength = text.length;
  let cartonFormat = format;
  let numberOfWords = determineNumberWords(text);
  /* console.log('==============================');
  console.log('text', text);
  console.log('textLength', textLength);
  console.log('numberOfWords', numberOfWords);
  console.log('=============================='); */
  switch (cartonFormat) {
    case '3x3':
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 1) {
        return screens.xs ? gridTextBreakingMobile_3x3 : gridTextBreaking_3x3;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords > 2) {
        return screens.xs ? gridTextBreakingMobile_3x3 : gridTextBreaking_3x3;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 2) {
        return screens.xs ? gridTextNotBreakingMobile_3x3 : gridTextNotBreaking_3x3;
      }
      if (textLength <= 2){
        return screens.xs ? gridTextOnlyNumberMobile_3x3 :gridTextOnlyNumber_3x3
      }
      return gridText_3x3;
    case '4x4':
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 1) {
        return screens.xs ? gridTextBreakingMobile_4x4 : gridTextBreaking_4x4;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords > 2) {
        return screens.xs ? gridTextBreakingMobile_4x4 : gridTextBreaking_4x4;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 2) {
        return screens.xs ? gridTextNotBreakingMobile_4x4 : gridTextNotBreaking_4x4;
      }
      if (textLength <= 2){
        return screens.xs ? gridTextOnlyNumberMobile_4x4 :gridTextOnlyNumber_4x4
      }
      return gridText_4x4;
    case '5x5':
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 1) {
        return screens.xs ? gridTextBreakingMobile_5x5 : gridTextBreaking_5x5;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords > 2) {
        return screens.xs ? gridTextBreakingMobile_5x5 : gridTextBreaking_5x5;
      }
      if (textLength >= LONGITUDE_WHERE_VALIDATION_IS_TRIGGERED && numberOfWords === 2) {
        return screens.xs ? gridTextNotBreakingMobile_5x5 : gridTextNotBreaking_5x5;
      }
      if (textLength <= 2){
        return screens.xs ? gridTextOnlyNumberMobile_5x5 :gridTextOnlyNumber_5x5
      }
      return gridText_5x5;
    default:
      return gridText_5x5;
  }
};
