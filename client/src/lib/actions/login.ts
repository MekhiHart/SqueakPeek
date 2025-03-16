"use server";
import { z } from "zod";
import { createSupabaseServer } from "../supabase/server";
import { redirect } from "next/navigation";

// Login zod schema
const LoginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

// Used for getting errors for each field during form validation
export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

// Logs in through the email provider from Supabase
export async function loginAccount(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // safeParse to async. get validated fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // form validation fails
  if (!validatedFields.success) {
    // add error meesages
    return {
      errors: validatedFields.error.flatten().fieldErrors, // returns error for each field
      message: "Incorrect Fields. Login Failed",
    };
  }

  // consts for email and password
  const { email, password } = validatedFields.data;

  // call supabase to create account
  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  // error handling
  if (error) {
    return { message: "Login Failed" };
  }

  // redirect to explore if successful login
  redirect("/explore");
}
