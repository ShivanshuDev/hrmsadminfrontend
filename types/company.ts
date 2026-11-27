export interface IBoardMember {
  name: string;
  designation: string;
}

export interface IBranch {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  isHq: boolean;
  companyId?: string;
  companyName?: string;
}

export interface Company {
  _id: string;
  id?: string;
  companyName: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber?: string;
  mobileNumber: string;
  email: string;
  websiteLink?: string;
  address: string;
  companyLogo?: string;
  companyImages?: string[];
  directorName: string;
  ceoName: string;
  ctoName?: string;
  cooName?: string;
  boardMembers?: IBoardMember[];
  businessSector: string;
  businessCategory?: string;
  sectorKey?: string;
  description?: string;
  rulesRegulations?: string;
  timing?: string;
  superAdminEmail?: string;
  branches: IBranch[];
  employeeCount?: number;
  createdAt: number;
  updatedAt: number;
}
