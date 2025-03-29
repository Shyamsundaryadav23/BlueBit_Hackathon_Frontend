import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section with Gradient Background */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Logo/Icon */}
          {/* <div className="mb-8 bg-white p-4 rounded-full shadow-xl">
            <svg className="w-16 h-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div> */}

          {/* Logo/Icon */}
          <div className="mb-6 bg-white p-0 rounded-full shadow-xl w-40 h-40 flex items-center justify-center">
            <img
              src="/logo_bluebit.png"
              alt="App Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            SplitBro <br />
            <span className="text-blue-300">Split Bills Effortlessly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mb-12 leading-relaxed">
            Say goodbye to awkward money conversations. Manage shared expenses
            with friends, roommates, and family in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 w-full max-w-md">
            <Link
              to="/signup"
              className="flex-1 px-8 py-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="flex-1 px-8 py-4 bg-white bg-opacity-10 text-black  font-extrabold border border-white border-opacity-30 backdrop-blur-sm rounded-lg  hover:bg-opacity-20 transition shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights (optional - can be removed if you only want a pure hero section) */}
      <div className="bg-white py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Split Any Bill</h3>
              <p className="text-gray-600">
                Easily divide expenses equally or create custom splits in
                seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Balances</h3>
              <p className="text-gray-600">
                Always know who owes what with real-time balance tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Group Expenses</h3>
              <p className="text-gray-600">
                Create multiple groups for different events or living
                situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
