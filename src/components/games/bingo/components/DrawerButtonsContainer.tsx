import { useState } from 'react';
import { DrawerButtonsInterface, Template } from '../interfaces/bingo';
import DrawerChat from './auxiliarDrawers/DrawerChat';
import DrawerRules from './auxiliarDrawers/DrawerRules';
import DrawerButtons from './DrawerButtons';

interface Props extends DrawerButtonsInterface {
	template?: Template | null;
	demostratedBallots: string[];
}

const DrawerButtonsContainer = ({
	template,
	arrayLocalStorage,
	demostratedBallots,
	postBingoByUser,
	clearCarton,
	bingoData,
	closedrawer,
}: Props) => {
	const [showDrawerChat, setshowDrawerChat] = useState<boolean>(false);
	const [showDrawerRules, setshowDrawerRules] = useState<boolean>(false);

	return (
		<>
			<DrawerButtons
				template={template}
				arrayLocalStorage={arrayLocalStorage}
				demostratedBallots={demostratedBallots}
				postBingoByUser={postBingoByUser}
				clearCarton={clearCarton}
				setshowDrawerChat={setshowDrawerChat}
				setshowDrawerRules={setshowDrawerRules}
				closedrawer={closedrawer}
			/>
			<DrawerRules showDrawerRules={showDrawerRules} setshowDrawerRules={setshowDrawerRules} bingoData={bingoData} />
			<DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
		</>
	);
};

export default DrawerButtonsContainer;
