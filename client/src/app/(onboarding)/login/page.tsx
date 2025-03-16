"use client";

import { Button, Typography, Link, Divider } from "@mui/material";
import "./login.css";
import { InputField } from "@/ui/InputField";
import { LoginState, loginAccount } from "../../../lib/actions/login";
import { useFormState } from "react-dom";
import { handleGoogleLoginClientSide } from "../../../lib/supabase/auth/handleGoogleLoginClientSide";

export default function Page() {
  const initialState: LoginState = { message: null, errors: {} };
  const [state, formAction] = useFormState(loginAccount, initialState);

  return (
    <div className="main-container">
      {/* Welcome Back section */}
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", marginTop: "110px" }}
      >
        Welcome Back
      </Typography>

      {/* Sign in with Google Button */}
      <Button
        className="borderline"
        startIcon={
          <img src="https://www.google.com/favicon.ico" alt="Google" />
        }
        sx={{
          border: "4px solid #E0E4F2",
          backgroundColor: "white",
          borderRadius: "8px",
          width: "760px",
        }}
        onClick={handleGoogleLoginClientSide}
      >
        Login with Google
      </Button>

      {/* Divider with "Or" */}
      <div className="divider">
        <Divider
          sx={{
            width: "100px",
            height: "1px",
            backgroundColor: "#ccc",
            marginRight: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            textAlign: "center",
          }}
        >
          Or
        </Typography>
        <Divider
          sx={{
            width: "100px",
            height: "1px",
            backgroundColor: "#ccc",
            marginLeft: 2,
          }}
        />
      </div>

      {/* Signup form */}
      <form className="signup-box" action={formAction}>
        {/* Email field */}
        <InputField
          fullWidth
          placeholder="Enter your email"
          required
          label="Email"
          name="email"
          style={{ marginBottom: "15px" }}
          helperText={state.errors?.email}
        />

        {/* Password field */}
        <InputField
          type="password"
          placeholder="Enter your password"
          required
          label="Password"
          fullWidth
          name="password"
          style={{ marginBottom: "15px" }}
          helperText={state.errors?.password}
        />

        {/* Submit button */}
        <div className="buttons-links">
          <div className="spacer"></div>
          <div className="submit-button">
            <Button
              className="borderline"
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                width: "200px",
                boxShadow: "none",
                backgroundColor: "#496FFF",
                ":hover": {
                  backgroundColor: "#3B5AC6",
                  boxShadow: "none",
                },
              }}
            >
              Confirm
            </Button>
          </div>
          <div className="login-link">
            <Link
              href="/signup"
              color="inherit"
              sx={{
                mt: 2,
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                textAlign: "right",
              }}
            >
              <Typography variant="body2">Signing Up?</Typography>
            </Link>
            <Link
              href="/forgot_password"
              color="inherit"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                textAlign: "right",
              }}
            >
              <Typography variant="body2">Forgot Password?</Typography>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
