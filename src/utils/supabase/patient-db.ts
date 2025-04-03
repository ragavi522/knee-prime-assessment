
import { supabase } from './client';

// Function to check if patient ID already exists
export const checkPatientIdExists = async (patientId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('patient')
      .select('Patient_ID')
      .eq('Patient_ID', patientId);
      
    if (error) {
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking patient ID:', error);
    throw error;
  }
};

// Function to create a new patient record
export const createPatientRecord = async (patientData: {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  reportUrl: string | null;
  lastModifiedTime?: string;
}) => {
  try {
    console.log('Creating/updating patient record with data:', patientData);
    
    // Use upsert instead of insert to update if exists
    const { data, error } = await supabase
      .from('patient')
      .upsert([
        {
          Patient_ID: patientData.patientId,
          patient_name: patientData.patientName,
          phone: patientData.phoneNumber,
          report_url: patientData.reportUrl,
          last_modified_tm: patientData.lastModifiedTime || new Date().toISOString()
        }
      ], { 
        onConflict: 'Patient_ID',
        returning: 'minimal'
      });
      
    if (error) {
      console.error('Supabase error while storing patient record:', error);
      throw error;
    }
    
    console.log('Patient record saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error creating patient record:', error.message || error);
    throw error;
  }
};
