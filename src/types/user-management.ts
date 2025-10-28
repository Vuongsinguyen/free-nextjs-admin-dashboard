export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
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
  onDelete: (userId: number) => void;
  currentUser: any;
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
}