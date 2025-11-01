// Menu Types
export interface MenuItem {
  id: string;
  name_key: string;
  icon?: string;
  path?: string;
  parent_id?: string | null;
  menu_group: 'main' | 'masterData' | 'systemConfig';
  display_order: number;
  is_active: boolean;
  is_pro: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
  subItems?: MenuItem[];
}

export interface MenuGroup {
  group: 'main' | 'masterData' | 'systemConfig';
  titleKey: string;
  items: MenuItem[];
}

export interface MenuResponse {
  success: boolean;
  data?: MenuGroup[];
  error?: string;
}
