import { useState } from 'react';
import { DrawerButtonsInterface } from '../interfaces/whereIs';
import DrawerChat from './auxiliarDrawers/DrawerChat';
import DrawerRules from './auxiliarDrawers/DrawerRules';
import DrawerButtons from './DrawerButtons';

const DrawerButtonsContainer = ({ arrayLocalStorage, postWhereIsByUser, whereIsData }: DrawerButtonsInterface) => {
  const [showDrawerChat, setshowDrawerChat] = useState<boolean>(false);
  const [showDrawerRules, setshowDrawerRules] = useState<boolean>(false);

  return (
    <>
      <DrawerButtons
        arrayLocalStorage={arrayLocalStorage}
        postWhereIsByUser={postWhereIsByUser}
        setshowDrawerChat={setshowDrawerChat}
        setshowDrawerRules={setshowDrawerRules}
      />
      <DrawerRules
        showDrawerRules={showDrawerRules}
        setshowDrawerRules={setshowDrawerRules}
        WhereIsData={whereIsData}
      />
      <DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
    </>
  );
};

export default DrawerButtonsContainer;
