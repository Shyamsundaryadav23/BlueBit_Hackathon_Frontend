import { Link } from "react-router-dom";
import { DollarSign, Users, PieChart, ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-bold text-center text-gray-900 mb-8 leading-tight tracking-tight">
            Split Bills <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Without Drama
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            Say goodbye to awkward money conversations. Split expenses with
            friends, track balances, and settle up with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link
              to="/signup"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-4 text-gray-900 font-medium rounded-full hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="border-t border-blue-100 py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-blue-50">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Smart Splitting
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Split bills equally or create custom splits with percentages and
                fixed amounts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-blue-50">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Real-time Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Always know who owes what with automatic balance calculations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-blue-50">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Group Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create unlimited groups for different events and trips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
