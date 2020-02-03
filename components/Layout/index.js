import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import './style.css';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
