import { useEffect } from 'react';
import { Col, Row } from 'antd';
import { PlayBingoInterface } from '../interfaces/bingo';
import BallotHistoryContainer from './BallotHistoryContainer';
import PlayBingoHeader from './PlayBingoHeader';
import BallotDrawCard from './BallotDrawCard';
import WinnersValidationCard from './WinnersValidationCard';
import playBingo from '../hooks/playBingo';

const PlayBingo = ({ bingoValues, event, notifications, dataFirebaseBingo, dimensions }: PlayBingoInterface) => {
  let demonstratedBallots: string[] = dataFirebaseBingo?.demonstratedBallots;

  const {
    pickedNumber,
    setPickedNumber,
    playing,
    setPlaying,
    inputValidate,
    setInputValidate,
    startBingo,
    restartBingo,
    endBingo,
    initPlayBingo,
    validarBingo,
    generateRandomBallot,
    disableBallotDrawButton,
    setDisableBallotDrawButton,
  } = playBingo();

  useEffect(() => {
    initPlayBingo({ event, dataFirebaseBingo, bingoValues, dimensions });
    return () => {
      setPlaying(false);
      setPickedNumber({ type: '', value: '' });
    };
  }, []);

  const handledeGenerateRandomBallot = () => {
    setDisableBallotDrawButton(true);
    setTimeout(() => {
      generateRandomBallot({ demonstratedBallots, event });
      setDisableBallotDrawButton(false);
    }, 3000);
  };
  const handleStartGame = () => {
    startBingo({ event, dataFirebaseBingo, bingoValues, dimensions });
  };

  const handleEndGame = () => {
    endBingo({ event, bingoValues });
  };

  const handleRestartGame = () => {
    restartBingo({ event, dataFirebaseBingo, bingoValues });
  };

  return (
    <Row
      gutter={[16, 16]}
      style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px', paddingBottom: '10px' }}>
      <Col span={24}>
        <PlayBingoHeader
          bingoValues={bingoValues}
          playing={playing}
          pickedNumber={pickedNumber}
          startGame={handleStartGame}
          endGame={handleEndGame}
          restartGame={handleRestartGame}
          dimensions={dimensions}
        />
      </Col>
      <Col span={24}>
        <Row gutter={[32, 8]}>
          <Col span={8}>
            <BallotDrawCard
              pickedNumber={pickedNumber}
              playing={playing}
              generateRandomBallot={handledeGenerateRandomBallot}
              disableBallotDrawButton={disableBallotDrawButton}
            />
          </Col>
          <Col span={16}>
            <WinnersValidationCard
              event={event}
              notifications={notifications}
              inputValidate={inputValidate}
              setInputValidate={setInputValidate}
              validarBingo={validarBingo}
              dimensions={dimensions}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <BallotHistoryContainer demonstratedBallots={demonstratedBallots} />
      </Col>
    </Row>
  );
};

export default PlayBingo;
