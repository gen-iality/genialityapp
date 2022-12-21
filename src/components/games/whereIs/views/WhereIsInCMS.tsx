import WhereIsProvider from '../contexts/WhereIsContext';
import Loading from '@/components/profile/loading';
import useWhereIs from '../hooks/useWhereIs';
import CreateWhereIs from './cms/CreateWhereIs';
import UpdateWhereIs from './cms/UpdateWhereIs';

interface RenderViewProps {
	eventId: string;
}

const RenderView = (props: RenderViewProps) => {
	const { eventId } = props;
	const { whereIs, loading } = useWhereIs();

	// console.log('loading && !whereIs', loading && !whereIs )
	// console.log('loading && !!whereIs', loading && !!whereIs )

	if (loading && !whereIs) return <Loading />;

	return whereIs === null ? <CreateWhereIs eventId={eventId} /> : <UpdateWhereIs eventId={eventId} />;
};

interface Props {
	eventId: string;
}

export default function WhereIsInCMS(props: Props) {
	const { eventId } = props;
	return (
		<WhereIsProvider>
			<RenderView eventId={eventId} />
		</WhereIsProvider>
	);
}
