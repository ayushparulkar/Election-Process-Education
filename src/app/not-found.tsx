export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">404</h1>
      <p className="text-xl text-gray-400 mb-8">The page you're looking for has vanished into the digital void.</p>
      <a 
        href="/"
        className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}
