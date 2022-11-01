import Loading from '@/components/profile/loading';
import CreateMillonaire from './CreateMillonaire';
import UpdateMillonaire from './UpdateMillonaire';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const RenderView = () => {
  const { loading, isNewGame } = useMillonaireCMS();
  console.log('🚀 ~ file: RenderView.tsx ~ line 7 ~ RenderView ~ isNewGame', isNewGame);
  if (loading) return <Loading />;
  if (isNewGame === true) {
    return <CreateMillonaire />;
  }
  return <UpdateMillonaire />;
};

export default RenderView;
