import { Helmet } from 'react-helmet-async';
import Container from '../components/ui/Container.jsx';

export default function BookNow() {
  return (
    <>
      <Helmet>
        <title>Book Now | Wedding Studio</title>
      </Helmet>
      <Container className="py-12">
        <h1 className="text-3xl text-white mb-4">Book Now</h1>
        <p className="text-gray-300">Booking form will be wired to API.</p>
      </Container>
    </>
  );
}

