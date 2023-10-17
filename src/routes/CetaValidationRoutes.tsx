import { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router';

interface Props {
  children: ReactNode;
}
const CetaValidationRoutes = ({ children }: Props) => {
  const location = useLocation();
  console.log('location.pathname', location.pathname);
  return <>{children}</>;
};

export default CetaValidationRoutes;
