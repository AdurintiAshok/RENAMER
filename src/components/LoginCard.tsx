import React from 'react';
import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../utils/firebase'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  const navigate = useNavigate();

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log("✅ User Info:", user.displayName);
  //     // Navigate to ImageRenamer screen
  //     navigate("/image-renamer");
  //   } catch (error) {
  //     console.error("❌ Google login failed:", error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm  rounded-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-white"
                fill="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">RENAMER</h1>
            <p className="text-blue-100 text-lg font-medium">Transform your images</p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            <button
      
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                Continue with Google
              </span>
            </button>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Secure login powered by Google OAuth
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;