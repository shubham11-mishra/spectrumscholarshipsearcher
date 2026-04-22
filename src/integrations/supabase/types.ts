export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          postcode: string | null
          state: string | null
          suburb: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          postcode?: string | null
          state?: string | null
          suburb?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          postcode?: string | null
          state?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          acara_id: string | null
          application_close_date: string | null
          application_fee: string | null
          application_open_date: string | null
          category: string | null
          closing_label: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          days_left: string | null
          description: string | null
          eligibility_criteria: string | null
          extraction_confidence_score: string | null
          gender: string | null
          gender_eligibility: string | null
          id: string
          is_active: string | null
          last_verified_at: string | null
          number_awarded: string | null
          overview: string | null
          postcode: string | null
          program_name: string | null
          program_type: string | null
          row_number: number | null
          scholarship_confidence: string | null
          scholarship_url: string | null
          school_name: string
          school_sector: string | null
          school_type: string | null
          sector: string | null
          special_conditions: string | null
          state: string | null
          sub_type: string | null
          suburb: string | null
          test_month: string | null
          test_provider: string | null
          url_status: string | null
          value_aud: string | null
          value_num: string | null
          value_type: string | null
          website_url: string | null
          year_levels: string | null
        }
        Insert: {
          acara_id?: string | null
          application_close_date?: string | null
          application_fee?: string | null
          application_open_date?: string | null
          category?: string | null
          closing_label?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          days_left?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          extraction_confidence_score?: string | null
          gender?: string | null
          gender_eligibility?: string | null
          id?: string
          is_active?: string | null
          last_verified_at?: string | null
          number_awarded?: string | null
          overview?: string | null
          postcode?: string | null
          program_name?: string | null
          program_type?: string | null
          row_number?: number | null
          scholarship_confidence?: string | null
          scholarship_url?: string | null
          school_name: string
          school_sector?: string | null
          school_type?: string | null
          sector?: string | null
          special_conditions?: string | null
          state?: string | null
          sub_type?: string | null
          suburb?: string | null
          test_month?: string | null
          test_provider?: string | null
          url_status?: string | null
          value_aud?: string | null
          value_num?: string | null
          value_type?: string | null
          website_url?: string | null
          year_levels?: string | null
        }
        Update: {
          acara_id?: string | null
          application_close_date?: string | null
          application_fee?: string | null
          application_open_date?: string | null
          category?: string | null
          closing_label?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          days_left?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          extraction_confidence_score?: string | null
          gender?: string | null
          gender_eligibility?: string | null
          id?: string
          is_active?: string | null
          last_verified_at?: string | null
          number_awarded?: string | null
          overview?: string | null
          postcode?: string | null
          program_name?: string | null
          program_type?: string | null
          row_number?: number | null
          scholarship_confidence?: string | null
          scholarship_url?: string | null
          school_name?: string
          school_sector?: string | null
          school_type?: string | null
          sector?: string | null
          special_conditions?: string | null
          state?: string | null
          sub_type?: string | null
          suburb?: string | null
          test_month?: string | null
          test_provider?: string | null
          url_status?: string | null
          value_aud?: string | null
          value_num?: string | null
          value_type?: string | null
          website_url?: string | null
          year_levels?: string | null
        }
        Relationships: []
      }
      shortlisted_schools: {
        Row: {
          created_at: string
          id: string
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          category: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
