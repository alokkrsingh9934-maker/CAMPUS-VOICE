export enum ComplaintCategory {
  MESS = 'Mess',
  HOSTEL = 'Hostel',
  FACULTY = 'Faculty',
  FACILITIES = 'Facilities',
  INFRASTRUCTURE = 'Infrastructure'
}

export enum Department {
  CSE = 'Computer Science & Engineering',
  IT = 'Information Technology',
  ECE = 'Electronics & Communication',
  EE = 'Electrical Engineering',
  ME = 'Mechanical Engineering',
  CIVIL = 'Civil Engineering',
  CE = 'Chemical Engineering',
  MBA = 'Management Studies (MBA)',
  BBA = 'Business Administration (BBA)',
  PHARMACY = 'Pharmacy',
  LAW = 'School of Law',
  PHYSICS = 'Department of Physics',
  CHEMISTRY = 'Department of Chemistry',
  MATHS = 'Department of Mathematics',
  HUMANITIES = 'Humanities & Social Sciences',
  PLACEMENT = 'Training & Placement Cell',
  GENERAL = 'General/Administrative'
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  RESOLVED = 'Resolved'
}

export enum UserRole {
  STUDENT = 'Student',
  MESS_INCHARGE = 'Mess Incharge',
  HOSTEL_INCHARGE = 'Hostel Incharge',
  HOD_CSE = 'HOD - CSE',
  HOD_IT = 'HOD - IT',
  HOD_ECE = 'HOD - ECE',
  HOD_EE = 'HOD - EE',
  HOD_ME = 'HOD - ME',
  HOD_CIVIL = 'HOD - CIVIL',
  HOD_CE = 'HOD - CE',
  HOD_MBA = 'HOD - MBA',
  HOD_BBA = 'HOD - BBA',
  HOD_PHARMACY = 'HOD - PHARMACY',
  HOD_LAW = 'HOD - LAW',
  HOD_PHYSICS = 'HOD - PHYSICS',
  HOD_CHEMISTRY = 'HOD - CHEMISTRY',
  HOD_MATHS = 'HOD - MATHS',
  HOD_HUMANITIES = 'HOD - HUMANITIES',
  HOD_PLACEMENT = 'HOD - PLACEMENT',
  INFRASTRUCTURE_INCHARGE = 'Infrastructure Incharge',
  VICE_CHANCELLOR = 'Vice Chancellor'
}

export interface StudentRecord {
  admissionId: string;
  rollNo: string;
  name: string;
  fatherName: string;
  section: string;
}

export interface AuthUser {
  role: UserRole;
  studentData?: StudentRecord;
  name: string;
}

export interface Complaint {
  id: string;
  studentName: string;
  studentId: string;
  category: ComplaintCategory;
  department?: Department;
  subject: string;
  description: string;
  timestamp: string;
  resolvedAt?: string;
  status: ComplaintStatus;
  resolutionNote?: string;
  imageUrl?: string;
}

export interface AISummary {
  report: string;
  categoryScores: { name: string; score: number }[];
  deptScores: { category: string; dept: string; score: number }[];
  overallHealth: number;
}