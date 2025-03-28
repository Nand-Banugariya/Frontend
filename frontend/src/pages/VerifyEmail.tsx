import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const API_URL = 'http://localhost:5000/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
          setVerificationStatus('error');
          setErrorMessage('Verification token is missing.');
          return;
        }

        // Send verification request to backend
        const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
        
        if (response.data.success) {
          setVerificationStatus('success');
          
          // Save token if provided
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // Show success message
          toast.success('Email verified successfully!');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setErrorMessage(response.data.message || 'Verification failed.');
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  const handleResendVerification = async () => {
    // For this to work, user would need to enter their email
    // A simpler approach is to redirect to login page
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
          </div>

          {verificationStatus === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium mb-2">Email verified successfully!</p>
              <p className="text-gray-600 mb-4">You will be redirected to the login page...</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 font-medium mb-2">Verification Failed</p>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <div className="space-y-2">
                <Button 
                  onClick={handleResendVerification}
                  className="w-full"
                >
                  Return to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 