export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          permissions: string[]
          status: string
          created_at: string
          updated_at: string
          property_name?: string
          room_number?: string
          full_name?: string
        }
        Insert: {
          email: string
          name: string
          role: string
          permissions: string[]
          status: string
          property_name?: string
          room_number?: string
          full_name?: string
        }
        Update: {
          email?: string
          name?: string
          role?: string
          permissions?: string[]
          status?: string
          property_name?: string
          room_number?: string
          full_name?: string
        }
      }
      facilities: {
        Row: {
          id: string
          name: string
          type: string
          location?: string
          capacity?: number
          status: string
          description?: string
          created_at: string
          updated_at: string
          tenant_id?: string
        }
        Insert: {
          name: string
          type: string
          location?: string
          capacity?: number
          status?: string
          description?: string
          tenant_id?: string
        }
        Update: {
          name?: string
          type?: string
          location?: string
          capacity?: number
          status?: string
          description?: string
          tenant_id?: string
        }
      }
      bookings: {
        Row: {
          id: string
          facility_id: string
          user_id: string
          title: string
          description?: string
          start_time: string
          end_time: string
          status: string
          created_at: string
          updated_at: string
          tenant_id?: string
        }
        Insert: {
          facility_id: string
          user_id: string
          title: string
          description?: string
          start_time: string
          end_time: string
          status?: string
          tenant_id?: string
        }
        Update: {
          facility_id?: string
          user_id?: string
          title?: string
          description?: string
          start_time?: string
          end_time?: string
          status?: string
          tenant_id?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description?: string
          start_date: string
          end_date: string
          location?: string
          organizer?: string
          status: string
          created_at: string
          updated_at: string
          tenant_id?: string
        }
        Insert: {
          title: string
          description?: string
          start_date: string
          end_date: string
          location?: string
          organizer?: string
          status?: string
          tenant_id?: string
        }
        Update: {
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          organizer?: string
          status?: string
          tenant_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}