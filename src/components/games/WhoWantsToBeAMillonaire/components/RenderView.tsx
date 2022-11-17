import Loading from '@/components/profile/loading';
import CreateMillonaire from './CreateMillonaire';
import UpdateMillonaire from './UpdateMillonaire';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const RenderView = () => {
  const { isNewGame } = useMillonaireCMS();

  if (isNewGame === true) {
    return <CreateMillonaire />;
  }
  return <UpdateMillonaire />;
};

export default RenderView;
