export interface User {
  id: string; // Changed from number to string for Supabase UUID
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  // New resident-specific fields
  propertyName?: string;
  roomNumber?: string;
  fullName?: string;
  gender?: string;
  contractType?: string;
  phoneNumber?: string;
  nationality?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportIssuePlace?: string;
  cohabitants?: string;
  otherInfo?: string;
}


export interface UserFilters {
  search: string;
  status: string;
  property?: string;
  province?: string;
  role?: string; // Optional for Residents page
}

export interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}

export interface UserTableProps {
  users: User[];
  sortConfig: SortConfig;
  onSort: (key: keyof User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  currentUser: { id: string; role: string; email: string; name: string } | null;
  showActions?: boolean;
  onView?: (user: User) => void;
  viewOnly?: boolean;
}

export interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}


export interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  users: User[];
  propertyOptions?: string[];
  provinceOptions?: string[];
}