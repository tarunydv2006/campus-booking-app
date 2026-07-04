import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const NotFound = () => (
  <PageTransition className="app-bg mesh-bg grid min-h-screen place-items-center px-4 text-center dark:text-white">
    <div className="floating-card max-w-md p-10">
      <p className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 bg-clip-text text-8xl font-black text-transparent">404</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Page not found</h1>
      <p className="muted-copy mt-2">This route is outside the campus workspace.</p>
      <Link to="/" className="btn-primary mt-6">Back home</Link>
    </div>
  </PageTransition>
);

export default NotFound;
