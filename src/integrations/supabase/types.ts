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
      beneficiaries: {
        Row: {
          account_number: string
          bank_name: string | null
          country: string | null
          created_at: string
          iban: string | null
          id: string
          kind: string
          name: string
          swift_code: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bank_name?: string | null
          country?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          kind?: string
          name: string
          swift_code?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bank_name?: string | null
          country?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          kind?: string
          name?: string
          swift_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          brand: string
          card_holder: string
          card_number: string
          card_type: string
          created_at: string
          cvv: string
          design: string
          expiry_month: number
          expiry_year: number
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string
          card_holder: string
          card_number: string
          card_type?: string
          created_at?: string
          cvv: string
          design?: string
          expiry_month: number
          expiry_year: number
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          card_holder?: string
          card_number?: string
          card_type?: string
          created_at?: string
          cvv?: string
          design?: string
          expiry_month?: number
          expiry_year?: number
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string
          account_status: string
          account_type: string
          balance: number
          city: string | null
          country: string | null
          created_at: string
          credit_score: number
          currency: string
          customer_id: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          gender: string | null
          house_address: string | null
          iban: string | null
          id: string
          phone: string | null
          photo_url: string | null
          routing_number: string
          state: string | null
          swift_code: string
          updated_at: string
          username: string | null
          zip_code: string | null
        }
        Insert: {
          account_number?: string
          account_status?: string
          account_type?: string
          balance?: number
          city?: string | null
          country?: string | null
          created_at?: string
          credit_score?: number
          currency?: string
          customer_id?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          house_address?: string | null
          iban?: string | null
          id: string
          phone?: string | null
          photo_url?: string | null
          routing_number?: string
          state?: string | null
          swift_code?: string
          updated_at?: string
          username?: string | null
          zip_code?: string | null
        }
        Update: {
          account_number?: string
          account_status?: string
          account_type?: string
          balance?: number
          city?: string | null
          country?: string | null
          created_at?: string
          credit_score?: number
          currency?: string
          customer_id?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          house_address?: string | null
          iban?: string | null
          id?: string
          phone?: string | null
          photo_url?: string | null
          routing_number?: string
          state?: string | null
          swift_code?: string
          updated_at?: string
          username?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      support_chat_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender: string
          telegram_message_id: number | null
          telegram_update_id: number | null
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender: string
          telegram_message_id?: number | null
          telegram_update_id?: number | null
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender?: string
          telegram_message_id?: number | null
          telegram_update_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "support_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      support_conversations: {
        Row: {
          access_hash: string
          created_at: string
          id: string
        }
        Insert: {
          access_hash: string
          created_at?: string
          id?: string
        }
        Update: {
          access_hash?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          applied: boolean
          balance_after: number | null
          category: string
          counterparty_account: string | null
          counterparty_bank: string | null
          counterparty_country: string | null
          counterparty_name: string | null
          counterparty_user_id: string | null
          created_at: string
          currency: string
          description: string | null
          direction: string
          fee: number
          group_ref: string | null
          iban: string | null
          id: string
          metadata: Json
          narration: string | null
          purpose: string | null
          reference: string
          status: string
          swift_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          applied?: boolean
          balance_after?: number | null
          category?: string
          counterparty_account?: string | null
          counterparty_bank?: string | null
          counterparty_country?: string | null
          counterparty_name?: string | null
          counterparty_user_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          direction: string
          fee?: number
          group_ref?: string | null
          iban?: string | null
          id?: string
          metadata?: Json
          narration?: string | null
          purpose?: string | null
          reference?: string
          status?: string
          swift_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          applied?: boolean
          balance_after?: number | null
          category?: string
          counterparty_account?: string | null
          counterparty_bank?: string | null
          counterparty_country?: string | null
          counterparty_name?: string | null
          counterparty_user_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          direction?: string
          fee?: number
          group_ref?: string | null
          iban?: string | null
          id?: string
          metadata?: Json
          narration?: string | null
          purpose?: string | null
          reference?: string
          status?: string
          swift_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_adjust_balance: {
        Args: {
          _amount: number
          _description?: string
          _direction: string
          _user_id: string
        }
        Returns: Json
      }
      admin_delete_transaction: { Args: { _tx_id: string }; Returns: undefined }
      admin_review_transaction: {
        Args: { _approve: boolean; _tx_id: string }
        Returns: undefined
      }
      admin_update_transaction: {
        Args: { _patch: Json; _tx_id: string }
        Returns: Json
      }
      bank_transfer: {
        Args: {
          _account_name: string
          _account_number: string
          _amount: number
          _bank_name: string
          _country?: string
          _currency?: string
          _fee: number
          _iban?: string
          _kind?: string
          _narration?: string
          _otp?: string
          _purpose?: string
          _swift?: string
        }
        Returns: Json
      }
      consume_transfer_otp: {
        Args: { _amount?: number; _code: string }
        Returns: undefined
      }
      find_recipient: {
        Args: { _query: string }
        Returns: {
          account_number: string
          full_name: string
          id: string
          username: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      send_money: {
        Args: {
          _amount: number
          _description?: string
          _otp?: string
          _recipient_account: string
          _reference?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
