import Header from '@/antdComponents/Header';
import { Form, Tabs } from 'antd';
import TabResults from '../../components/cms/TabResults';
import TabSetup from '../../components/cms/TabSetup';
import Loading from '@/components/profile/loading';
import useWhereIs from '../../hooks/useWhereIs';
import { UpdateWhereIsDto } from '../../types';
import { useEffect, useState } from 'react';
import TabSetupPoints from '../../components/cms/TabSetupPoints';

interface Props {
	eventId: string;
}

export default function UpdateWhereIs(props: Props) {
	const { eventId } = props;
	const { whereIs, deleteWhereIs, loading, updateWhereIs } = useWhereIs();
	const [gameImage, setGameImage] = useState('');
	const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

	useEffect(() => {
		if (whereIs) {
			setGameImage(whereIs.game_image);
			setDimensions({
				width: whereIs.game_image_width,
				height: whereIs.game_image_height,
			});
		}
	}, [whereIs?.game_image, whereIs?.game_image_width, whereIs?.game_image_height]);

	const handleDelete = () => {
		if (whereIs) {
			deleteWhereIs();
		}
	};

	const handleFinish = (values: Omit<Required<UpdateWhereIsDto>, 'event_id' | 'game_image'>) => {
		const { active, lifes, published, title, game_image_height, game_image_width, instructions } = values;
		updateWhereIs({
			active,
			lifes,
			game_image: gameImage,
			published,
			title,
			game_image_height: dimensions.height,
			game_image_width: dimensions.width,
			instructions,
		});
	};

	if (!whereIs) {
		return <p>Ups!, esta dinamica no existe aun</p>;
	}

	if (loading) return <Loading />;

	return (
		<Form layout='vertical' onFinish={handleFinish}>
			<Header title='Buscando el Elemento' description={''} back edit save form remove={handleDelete} />
			<Tabs>
				<Tabs.TabPane tab='Configurar' key='whereIsSetup'>
					<TabSetup whereIs={whereIs} gameImage={gameImage} setGameImage={setGameImage} dimensions={dimensions} setDimensions={setDimensions} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Configurar puntos' key='whereIsSetupPoints' disabled={!whereIs.game_image.length}>
					<TabSetupPoints whereIs={whereIs} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Resultados' key='whereIsResults'>
					<TabResults whereIs={whereIs} />
				</Tabs.TabPane>
			</Tabs>
		</Form>
	);
}
