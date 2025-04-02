
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useTwilioAuthStore } from "../utils/twilio-auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isLoading } = useTwilioAuthStore();
  const [pageLoading, setPageLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const navigate = useNavigate();

  // Check authentication (using Twilio session)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          navigate("/login");
        }
        setPageLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [user, navigate]);

  // Redirect to login if not authenticated after initialization
  useEffect(() => {
    if (!pageLoading && !isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, pageLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Handle PDF report download and redirect after download completes (Approach #4)
  const handleDownloadReport = async () => {
    if (!user?.id) {
      setDownloadError("User not found");
      return;
    }

    try {
      setDownloadLoading(true);
      setDownloadError("");

      // Simulate PDF generation
      setTimeout(() => {
        setDownloadLoading(false);
        // In a real app, this would download a file instead
        alert("PDF Report would download here in a real application");
        // Redirect to the "Thank You" page after PDF generation/download
        navigate("/thank-you");
      }, 2000);
    } catch (error) {
      console.error("Error downloading report:", error);
      setDownloadError(
        error instanceof Error ? error.message : "Failed to download report"
      );
      setDownloadLoading(false);
    }
  };

  const handleViewReport = () => {
    navigate("/report-viewer");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 sm:p-8 bg-orange-50 border-b border-orange-100">
                <h1 className="text-2xl font-bold text-gray-900">
                  Your GATOR PRIME Report
                </h1>
                <p className="mt-2 text-gray-600">
                  Welcome to your personalized knee health dashboard.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <Tabs defaultValue="report" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="report" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      View Report
                    </TabsTrigger>
                    <TabsTrigger value="appointment" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Book an Appointment
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="report">
                    {/* Report actions */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="health"
                          size="default"
                          onClick={handleDownloadReport}
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? (
                            <>
                              <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Generating PDF...
                            </>
                          ) : (
                            "Download Full Report (PDF)"
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handleViewReport}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Report Online
                        </Button>
                      </div>

                      {downloadError && (
                        <div className="text-red-500 text-sm mt-2">
                          Error: {downloadError}. Please try again.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appointment">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule an Appointment</h3>
                      <p className="text-gray-600 mb-6">
                        Book a consultation with one of our knee health specialists to discuss your GATOR PRIME report results.
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-md bg-white hover:shadow-md transition-shadow">
                            <h4 className="font-medium text-health-600">Virtual Consultation</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              30-minute video call with a specialist
                            </p>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-md bg-white hover:shadow-md transition-shadow">
                            <h4 className="font-medium text-health-600">In-Person Visit</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Meet face-to-face at one of our clinics
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="health"
                          size="default"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Check Available Times
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Logout section */}
            <div className="mt-8 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/logout")}
                disabled={isLoading}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
