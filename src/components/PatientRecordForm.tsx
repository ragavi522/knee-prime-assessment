
import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatientRecord } from "../utils/supabase/patient-db";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadPatientDocument } from "../utils/supabase";

interface PatientRecord {
  patientName: string;
  patientId: string;
  phoneNumber: string;
  reportFiles: FileList | null;
  xrayFiles: FileList | null;
  mriFiles: FileList | null;
}

export default function PatientRecordForm() {
  const [formData, setFormData] = useState<PatientRecord>({
    patientName: "",
    patientId: "",
    phoneNumber: "",
    reportFiles: null,
    xrayFiles: null,
    mriFiles: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === "reportFiles" && files) {
      setFormData({ ...formData, reportFiles: files });
    } else if (name === "xrayFiles" && files) {
      setFormData({ ...formData, xrayFiles: files });
    } else if (name === "mriFiles" && files) {
      setFormData({ ...formData, mriFiles: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const validateForm = () => {
    if (!formData.patientName.trim()) {
      setError("Patient name is required");
      return false;
    }
    
    if (!formData.patientId.trim()) {
      setError("Patient ID is required");
      return false;
    }
    
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    
    if (!formData.reportFiles || formData.reportFiles.length === 0) {
      setError("Please upload at least one PDF report");
      return false;
    }
    
    return true;
  };
  
  const uploadFiles = async () => {
    try {
      setUploadProgress(10);
      const uniqueTimestamp = Date.now();
      const patientId = formData.patientId;
      let reportUrl = null;
      let xrayUrl = null;
      let mriUrl = null;
      
      // Upload main report file
      if (formData.reportFiles && formData.reportFiles.length > 0) {
        const file = formData.reportFiles[0];
        setUploadProgress(20);
        console.log('Uploading main report file...');
        reportUrl = await uploadPatientDocument(file, patientId, 'main');
        setUploadProgress(40);
      }
      
      // Upload X-ray file if provided
      if (formData.xrayFiles && formData.xrayFiles.length > 0) {
        const file = formData.xrayFiles[0];
        setUploadProgress(60);
        console.log('Uploading X-ray file...');
        xrayUrl = await uploadPatientDocument(file, patientId, 'xray');
        setUploadProgress(70);
      }
      
      // Upload MRI file if provided
      if (formData.mriFiles && formData.mriFiles.length > 0) {
        const file = formData.mriFiles[0];
        setUploadProgress(80);
        console.log('Uploading MRI file...');
        mriUrl = await uploadPatientDocument(file, patientId, 'mri');
        setUploadProgress(90);
      }
      
      setUploadProgress(100);
      return { reportUrl, xrayUrl, mriUrl };
    } catch (error: any) {
      console.error("File upload error:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    toast.info("Processing patient record...");
    
    try {
      // Step 1: Upload files and get the URLs
      const { reportUrl, xrayUrl, mriUrl } = await uploadFiles();
      console.log('Report URLs after upload:', { reportUrl, xrayUrl, mriUrl });
      
      // Step 2: Get current date and time in format MM/DD/YYYY, hh:mm:ss AM/PM
      const now = new Date();
      const formattedDateTime = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }) + ' ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      console.log('Current formatted date/time for database:', formattedDateTime);
      
      // Step 3: Create the patient record with strong typing
      const patientData = {
        patientId: formData.patientId,
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber,
        reportUrl: reportUrl,
        xrayReportUrl: xrayUrl,
        mriReportUrl: mriUrl,
        lastModifiedTime: formattedDateTime
      };
      
      // Step 4: Submit the data to Supabase
      const result = await createPatientRecord(patientData);
      
      console.log('Patient record creation result:', result);
      toast.success("Patient record created successfully");
      
      // Reset form after successful submission
      setFormData({
        patientName: "",
        patientId: "",
        phoneNumber: "",
        reportFiles: null,
        xrayFiles: null,
        mriFiles: null
      });
      
      // Reset file inputs
      const fileInputs = ['reportFiles', 'xrayFiles', 'mriFiles'];
      fileInputs.forEach(inputId => {
        const fileInput = document.getElementById(inputId) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      });
      
    } catch (err: any) {
      console.error("Error creating patient record:", err);
      setError(err.message || "An error occurred while creating the patient record");
      toast.error("Failed to create patient record");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Patient Record</h2>
        <p className="text-gray-600 mt-2">Enter patient details and upload reports</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input 
              id="patientName" 
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="Enter patient name" 
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input 
              id="patientId" 
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              placeholder="Enter unique patient ID" 
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number" 
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="reportFiles">Main Report (PDF)</Label>
            <Input 
              id="reportFiles" 
              name="reportFiles"
              type="file"
              onChange={handleInputChange}
              accept=".pdf"
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload main patient report (required)
            </p>
          </div>
          
          <div>
            <Label htmlFor="xrayFiles">X-ray Report (PDF)</Label>
            <Input 
              id="xrayFiles" 
              name="xrayFiles"
              type="file"
              onChange={handleInputChange}
              accept=".pdf"
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload patient X-ray report (optional)
            </p>
          </div>
          
          <div>
            <Label htmlFor="mriFiles">MRI Report (PDF)</Label>
            <Input 
              id="mriFiles" 
              name="mriFiles"
              type="file"
              onChange={handleInputChange}
              accept=".pdf"
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload patient MRI report (optional)
            </p>
          </div>
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-orange-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
          
          <Button
            variant="health"
            size="lg"
            className="w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Save Patient Record"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
