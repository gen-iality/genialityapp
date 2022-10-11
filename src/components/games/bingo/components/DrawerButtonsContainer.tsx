import { useState } from 'react';
import { DrawerButtonsInterface } from '../interfaces/bingo';
import DrawerChat from './auxiliarDrawers/DrawerChat';
import DrawerRules from './auxiliarDrawers/DrawerRules';
import DrawerButtons from './DrawerButtons';

const DrawerButtonsContainer = ({
  arrayLocalStorage,
  postBingoByUser,
  clearCarton,
  bingoData,
}: DrawerButtonsInterface) => {
  const [showDrawerChat, setshowDrawerChat] = useState<boolean>(false);
  const [showDrawerRules, setshowDrawerRules] = useState<boolean>(false);

  return (
    <>
      <DrawerButtons
        arrayLocalStorage={arrayLocalStorage}
        postBingoByUser={postBingoByUser}
        clearCarton={clearCarton}
        setshowDrawerChat={setshowDrawerChat}
        setshowDrawerRules={setshowDrawerRules}
      />
      <DrawerRules showDrawerRules={showDrawerRules} setshowDrawerRules={setshowDrawerRules} bingoData={bingoData} />
      <DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
    </>
  );
};

export default DrawerButtonsContainer;
