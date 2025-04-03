
// Re-export the client for direct access
export { supabase } from './supabase/client';

// Re-export patient database operations
export { 
  checkPatientIdExists,
  createPatientRecord 
} from './supabase/patient-db';

// Re-export patient report operations
export { 
  getPatientReport,
  getAnnexReport,
  getSupportingDocument 
} from './supabase/patient-reports';

// Re-export storage operations
export { 
  uploadPatientDocument, 
  checkBucketExists 
} from './supabase/storage';
