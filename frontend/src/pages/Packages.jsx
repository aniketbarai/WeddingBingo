import { Helmet } from 'react-helmet-async';
import Container from '../components/ui/Container.jsx';

export default function Packages() {
  return (
    <>
      <Helmet>
        <title>Packages | Wedding Studio</title>
      </Helmet>
      <Container className="py-12">
        <h1 className="text-3xl text-white mb-4">Packages</h1>
        <p className="text-gray-300">Packages will be loaded from API.</p>
      </Container>
    </>
  );
}

