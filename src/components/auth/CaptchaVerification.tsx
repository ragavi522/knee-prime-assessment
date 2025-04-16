
import React, { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Replace with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "YOUR_ACTUAL_RECAPTCHA_SITE_KEY";

interface CaptchaVerificationProps {
  onVerify: (token: string | null) => void;
  onExpire?: () => void;
  error?: string | null;
}

export const CaptchaVerification: React.FC<CaptchaVerificationProps> = ({ 
  onVerify, 
  onExpire,
  error
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  useEffect(() => {
    // Reset captcha when mounted to ensure it's fresh
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, []);

  const handleExpire = () => {
    onVerify(null);
    if (onExpire) {
      onExpire();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {error && (
        <Alert variant="destructive" className="w-full mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-center w-full overflow-hidden">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onVerify}
          onExpired={handleExpire}
        />
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-1">
        This verification helps us ensure you're a human and not a bot.
      </p>
    </div>
  );
};
