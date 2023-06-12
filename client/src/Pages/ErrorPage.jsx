import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className=" w-full px-16 md:px-0 h-screen flex items-center justify-center">
    <div className="bg-neutral border flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider ">404</p>
        <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider mt-4">Page Not Found</p>
        <p className="mt-8 py-2 border-y-2 text-center">Whoops, the page your are looking for does not exist.</p>
        <Link to={'/'}>
        <button className="btn btn-accent mt-4">Home</button>
        </Link>
    </div>
</div>
  );
}

export default ErrorPage;