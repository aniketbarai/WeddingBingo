import { Helmet } from 'react-helmet-async';
import Container from '../components/ui/Container.jsx';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | Wedding Studio</title>
      </Helmet>
      <Container className="py-12">
        <h1 className="text-3xl text-white mb-4">About</h1>
        <p className="text-gray-300">Add your about content here.</p>
      </Container>
    </>
  );
}

