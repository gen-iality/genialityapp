import Header from '@/antdComponents/Header';
import { Form, Tabs } from 'antd';
import TabResults from '../../components/cms/TabResults';
import TabSetup from '../../components/cms/TabSetup';
import useSharePhoto from '../../hooks/useSharePhoto';
import Loading from '@/components/profile/loading';
interface Props {
	eventId: string;
}

export default function UpdateSharePhoto(props: Props) {
	const { eventId } = props;
	const { sharePhoto, loading, deleteSharePhoto, updateSharePhoto } = useSharePhoto();

	const handleDelete = () => {
		if (sharePhoto !== null) {
			deleteSharePhoto(sharePhoto._id);
		}
	};

	const handleFinish = (values: {
		title: string;
		points_per_like: number;
		active: boolean;
		published: boolean;
		tematic: string;
	}) => {
		const { title, points_per_like, active, published, tematic } = values;
		if (sharePhoto !== null) {
			updateSharePhoto(sharePhoto._id, {
				title,
				points_per_like: Number(points_per_like),
				tematic,
				active,
				published,
			});
		}
	};
	if (sharePhoto === null) {
		return <p>Ups!, esta dinamica no existe aun</p>;
	}

	if (loading) return <Loading />;

	return (
		<Form layout='vertical' onFinish={handleFinish}>
			<Header title='Comparte tu foto' description={''} back edit save form remove={handleDelete} />
			<Tabs>
				<Tabs.TabPane tab='Configurar' key='sharePhotoConfigurar'>
					<TabSetup sharePhoto={sharePhoto} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Resultados' key='sharePhotoResultados'>
					<TabResults sharePhoto={sharePhoto} />
				</Tabs.TabPane>
			</Tabs>
		</Form>
	);
}
