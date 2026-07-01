import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="app-bg grid min-h-screen place-items-center px-4 text-center dark:text-white">
    <div>
      <p className="text-8xl font-black text-teal-500">404</p>
      <h1 className="mt-4 text-3xl font-black">Page not found</h1>
      <Link to="/" className="btn-primary mt-6">Back home</Link>
    </div>
  </main>
);

export default NotFound;
