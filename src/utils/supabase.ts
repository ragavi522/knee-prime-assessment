
import { createClient } from '@supabase/supabase-js';

// Supabase configuration with your provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://btfinmlyszedyeadqgvl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZmlubWx5c3plZHllYWRxZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTgxMDgsImV4cCI6MjA1NzA5NDEwOH0.3jIu8RS9c7AEBCVu41Ti3aW6B0ogFoEnFWeU_PINfoM';

// Create a single Supabase client instance to avoid multiple instances warning
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch patient report PDF by patient ID
export const getPatientReport = async (patientId: string) => {
  try {
    console.log('Fetching patient data for ID:', patientId);
    
    // First, check if the patient exists to provide better error messages
    const { data: patientExists, error: checkError } = await supabase
      .from('patient')
      .select('Patient_ID')
      .eq('Patient_ID', patientId);
      
    console.log('Patient exists check result:', patientExists);
    
    if (checkError) {
      console.error('Error checking patient existence:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }
    
    if (!patientExists || patientExists.length === 0) {
      throw new Error(`Patient ID "${patientId}" not found in the database`);
    }
    
    // Fetch the report URL from the 'patient' table
    const { data: patientData, error: patientError } = await supabase
      .from('patient')
      .select('report_url')
      .eq('Patient_ID', patientId)
      .single();
    
    console.log('Patient data result:', patientData);
    
    if (patientError) {
      console.error('Error fetching patient data:', patientError);
      throw patientError;
    }
    
    if (!patientData) {
      throw new Error('No report URL found for this patient ID');
    }
    
    // Get the report URL from the patient data
    const reportUrl = patientData.report_url;
    console.log('Report URL:', reportUrl);
    
    if (!reportUrl || typeof reportUrl !== 'string') {
      throw new Error('Invalid report URL format');
    }
    
    // Instead of downloading the file, we'll use the public URL directly
    // Extract file name for display purposes
    const fileName = reportUrl.split('/').pop() || 'patient-report.pdf';
    
    // Return the public URL directly
    return { 
      fileUrl: reportUrl, 
      fileName 
    };
  } catch (error) {
    console.error('Error fetching patient report:', error);
    throw error;
  }
};

// Function to fetch annex report PDF by patient ID
export const getAnnexReport = async (patientId: string) => {
  try {
    console.log('Fetching annex report for patient ID:', patientId);
    
    // Fetch the annex report URL from the 'patient' table
    const { data: patientData, error: patientError } = await supabase
      .from('patient')
      .select('annex_report_url')
      .eq('Patient_ID', patientId)
      .single();
    
    console.log('Patient annex data result:', patientData);
    
    if (patientError) {
      console.error('Error fetching patient annex data:', patientError);
      throw patientError;
    }
    
    if (!patientData || !patientData.annex_report_url) {
      throw new Error('No annex report URL found for this patient ID');
    }
    
    // Get the annex report URL from the patient data
    const reportUrl = patientData.annex_report_url;
    console.log('Annex Report URL:', reportUrl);
    
    if (!reportUrl || typeof reportUrl !== 'string') {
      throw new Error('Invalid annex report URL format');
    }
    
    // Extract file name for display purposes
    const fileName = reportUrl.split('/').pop() || 'annex-report.pdf';
    
    // Return the public URL directly
    return { 
      fileUrl: reportUrl, 
      fileName 
    };
  } catch (error) {
    console.error('Error fetching annex report:', error);
    throw error;
  }
};
