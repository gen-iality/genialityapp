import { GetBingo, listenBingoData } from '@/components/games/bingo/services';
import { useState, useEffect } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { getUserBingo, saveBingoByUser } from '@/components/games/bingo/services';
import {
  Bingo,
  BingoByUserInterface,
  PickedNumberInterface,
  RamdonBingoValue,
} from '@/components/games/bingo/interfaces/bingo';
export const useDrawerBingo = () => {
  const { value } = UseEventContext();
  const cUser = UseUserEvent();

  const [arrayLocalStorage, setArrayLocalStorage] = useState<number[]>([]);
  const [arrayDataBingo, setArrayDataBingo] = useState<RamdonBingoValue[]>([]);
  const [arrayDataBingoBallot, setArrayDataBingoBallot] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardboardCode, setCardboardCode] = useState<string>('');
  const [demonstratedBallots, setDemonstratedBallots] = useState<string[]>([]);
  const [ballotValue, setBallotValue] = useState<PickedNumberInterface>({ type: '', value: '¡BINGO!' });
  const [userCartons, setUserCartons] = useState<string[]>(['1']);
  const [bingoData, setBingoData] = useState<Bingo>();

  const [mediaUrl, setMediaUrl] = useState<string>(
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807'
  );
  const [dataFirebaseBingo, setDataFirebaseBingo] = useState<{
    currentValue: {
      type: string;
      value: string;
    };
    demonstratedBallots: string[];
    bingoData: {
      type: string;
      carton_value: string;
      ballot_value: string;
      active: boolean;
      index: number;
    }[];
    startGame: boolean;
    _id: string;
  }>();
  useEffect(() => {
    const getBingo = async () => {
      setIsLoading(true);
      const responseBingoCardsForTheUser = await getUserBingo(cUser.value._id);
      const responseBingoData = await GetBingo(value._id);

      if (responseBingoCardsForTheUser && responseBingoData) {
        setBingoData(responseBingoData);
        distributionDataUser(responseBingoCardsForTheUser[0]);
      }
      setIsLoading(false);
    };

    getBingo();
    return () => {
      setCardboardCode('');
      setDemonstratedBallots([]);
      setArrayDataBingo([]);
    };
  }, []);

  useEffect(() => {
    return () => {
      setDataFirebaseBingo({
        currentValue: {
          value: '¡BINGO!',
          type: '',
        },
        bingoData: [],
        _id: '',
        demonstratedBallots: [],
        startGame: false,
      });
    };
  }, [value._id]);

  useEffect(() => {
    //  obtiene el array de valores del localStorage si existe y lo guarda en el array de estado
    setIsLoading(true);
    const arrayLocalStorage = localStorage.getItem('arrayLocalStorage');
    if (arrayLocalStorage) {
      setArrayLocalStorage(JSON.parse(arrayLocalStorage));
    }
    // si no existe el array de valores del localStorage lo crea y lo guarda en el array de estado
    else {
      const arrayLocalStorage: number[] = new Array(50).fill(0);
      setArrayLocalStorage(arrayLocalStorage);
      return () => {
        setArrayLocalStorage([]);
      };
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('arrayLocalStorage', JSON.stringify(arrayLocalStorage));
  }, [arrayLocalStorage]);

  useEffect(() => {
    if (dataFirebaseBingo) {
      setBallotValue(dataFirebaseBingo.currentValue ?? { type: '', value: '¡BINGO!' });
      //  distributionData(dataFirebaseBingo.bingoData);
      setDemonstratedBallots(dataFirebaseBingo.demonstratedBallots);
    }

    return () => {
      setBallotValue({ type: '', value: '¡BINGO!' });
      setDemonstratedBallots([]);
    };
  }, [dataFirebaseBingo]);

  function getBingoListener() {
    const unSuscribe = listenBingoData(value._id, setDataFirebaseBingo, clearCarton);
    return unSuscribe;
  }

  // funcion para distribuir los datos de bingoData a arrayDataBingo
  const distributionData = (
    data: { type: string; carton_value: string; ballot_value: string; active: boolean; index: number }[]
  ) => {
    const arrayDataDemonstrated: string[] = [];
    data.forEach((item) => {
      if (item.active === true) {
        arrayDataDemonstrated.push(item.ballot_value);
      }
    });
    setDemonstratedBallots(arrayDataDemonstrated);
  };
  const distributionDataUser = (data: BingoByUserInterface) => {
    if (data) {
      const { values_bingo_card } = data;
      const arrayDataBingo: RamdonBingoValue[] = [];
      let arrayDataBingoBallot: string[] = [];

      setCardboardCode(data._id);
      values_bingo_card.forEach((item) => {
        arrayDataBingo.push({ ...item });
        arrayDataBingoBallot.push(item.ballot_value.value);
      });
      setArrayDataBingoBallot(arrayDataBingoBallot);
      setArrayDataBingo(arrayDataBingo);
    }
  };

  // funcion que cambia de 0 a 1  y vicerversas el valor del array de localStorage
  const changeValueLocalStorage = (index: number) => {
    const newArrayLocalStorage = [...arrayLocalStorage];
    newArrayLocalStorage[index] = newArrayLocalStorage[index] === 0 ? 1 : 0;
    setArrayLocalStorage(newArrayLocalStorage);
  };

  //funcion para colocar la boleta mostrada en el array de boletas mostradas
  const addDemonstratedBallots = (ballotValue: string) => {
    setDemonstratedBallots([...demonstratedBallots, ballotValue]);
  };

  //funcion para limpiar el carto  cambiar todos los valores de 1 a 0
  const clearCarton = () => {
    const newArrayLocalStorage = [...arrayLocalStorage];
    newArrayLocalStorage.forEach((value, index) => {
      newArrayLocalStorage[index] = 0;
    });
    setArrayLocalStorage(newArrayLocalStorage);
  };

  const postBingoByUser = () => {
    const { properties } = cUser.value;
    const dataBingoUser = {
      cardId: cardboardCode,
      values_bingo_card: arrayDataBingo,
      values_ballot: arrayDataBingoBallot,
      names: properties.names,
      dimensions: bingoData?.dimensions,
    };
    saveBingoByUser({ event: value._id, user: cUser.value._id, data: dataBingoUser });
  };

  return {
    arrayLocalStorage,
    arrayDataBingo,
    isLoading,
    changeValueLocalStorage,
    ballotValue,
    cardboardCode,
    demonstratedBallots,
    userCartons,
    clearCarton,
    mediaUrl,
    getBingoListener,
    postBingoByUser,
    setDemonstratedBallots,
    dataFirebaseBingo,
    bingoData,
  };
};
