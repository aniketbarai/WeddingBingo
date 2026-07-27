import { Helmet } from 'react-helmet-async';
import Container from '../components/ui/Container.jsx';

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services | Wedding Studio</title>
      </Helmet>
      <Container className="py-12">
        <h1 className="text-3xl text-white mb-4">Services</h1>
        <p className="text-gray-300">Add your services content here.</p>
      </Container>
    </>
  );
}

