import UserRating from './UserRating';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
export default function PlayMillonaire() {
  const { event } = useMillonaireCMS();
  console.log('🚀 ~ file: PlayMillonaire.tsx ~ line 5 ~ PlayMillonaire ~ event', event);
  return (
    <div>
      PlayMillonaire
      <UserRating />
    </div>
  );
}
