import DrawerMillonaire from './DrawerMillonaire';
import MillonaireLandingProvider from '../contexts/MillonaireLandingProvider';
export default function PlayMillonaire() {
  return (
    <MillonaireLandingProvider>
      <DrawerMillonaire />
    </MillonaireLandingProvider>
  );
}
