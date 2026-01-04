import { StudentRecord } from '../types';

// Registry of students extracted from the provided PDF pages
export const STUDENT_REGISTRY: StudentRecord[] = [
  // Page 1 Records (CH1A)
  { admissionId: '25031008956', rollNo: '2025061001', name: 'ABHISHEK YADAV', fatherName: 'AMARJEET YADAV', section: 'CH1A' },
  { admissionId: '25031038496', rollNo: '2025061002', name: 'ADHYAN MODANWAL', fatherName: 'NAVJEET KUMAR GUPTA', section: 'CH1A' },
  { admissionId: '25031077571', rollNo: '2025061003', name: 'ADITYA MISHRA', fatherName: 'SHATRUGHAN MISHRA', section: 'CH1A' },
  { admissionId: '25031125935', rollNo: '2025061021', name: 'DISHA KEDIA', fatherName: 'MANISH KUMAR KEDIA', section: 'CH1A' },
  
  // Page 4 Records (IT1A)
  { admissionId: '25031057496', rollNo: '2025071001', name: 'ABHISHEK KUMAR', fatherName: 'RANJEET KUMAR CHOUDHARY', section: 'IT1A' },
  { admissionId: '25031123891', rollNo: '2025071002', name: 'ADARSH KUMAR PANDEY', fatherName: 'GUNAKESH PANDEY', section: 'IT1A' },
  
  // Page 7 Records (IT1B)
  { admissionId: '25031100189', rollNo: '2025071101', name: 'ABHAY KUMAR', fatherName: 'SUBHASH CHANDRA', section: 'IT1B' },
  { admissionId: '25031018386', rollNo: '2025071102', name: 'ABHIJEET SINGH', fatherName: 'DHRUV NARAYAN SINGH', section: 'IT1B' },
  
  // Page 10 Records (IOT1A)
  { admissionId: '25031021868', rollNo: '2025041301', name: 'ABHIMANYU', fatherName: 'ARJUN PRASAD', section: 'IOT1A' },
  { admissionId: '25031040502', rollNo: '2025041302', name: 'ABHINAV RAI', fatherName: 'DAYANAND RAI', section: 'IOT1A' },
  
  // Page 40 Records (CSE1A)
  { admissionId: 'SII', rollNo: '2025021001', name: 'AADTYA SINGH', fatherName: 'MANISH SINGH', section: 'CSE1A' },
  { admissionId: '25031001140', rollNo: '2025021002', name: 'ABHYUDAYA ANAND', fatherName: 'MANOJ KUMAR', section: 'CSE1A' }
];