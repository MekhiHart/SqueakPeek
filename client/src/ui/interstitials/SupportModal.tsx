import Image from "next/image";
import {
  Typography,
  Select,
  MenuItem,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { InputField } from "../InputField";
import {
  JiraTicketFormState,
  sendTicket,
  IssueType,
} from "@/lib/actions/send_jira_ticket";
import { useFormState } from "react-dom";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useState } from "react";
import { useAlert } from "@/lib/store/alert";
import { useInterstitial } from "@/lib/store/interstitial";

// TODO Finish UI
export function SupportModal() {
  const initialState: JiraTicketFormState = { message: null, errors: {} };
  const [issueType, setIssueType] = useState<IssueType>("Bug");
  const [state, formAction] = useFormState(sendTicket, initialState);
  const { setAlert } = useAlert();
  const { closeInterstitial } = useInterstitial();

  // handles actions after an attempt to send a ticket
  useEffect(() => {
    if (state && state.errors && state.message) {
      setAlert({
        message: state.message,
        type: "warning",
        position: {
          horizontal: "center",
          vertical: "top",
        },
      });
    } else if (state && state.message) {
      setAlert({
        message: state.message,
        type: "success",
        position: {
          horizontal: "center",
          vertical: "top",
        },
      });
      closeInterstitial();
    }
  }, [state]);

  return (
    <form action={formAction}>
      <DialogTitle>
        <Image
          src="/general/website_logo.svg"
          height={100}
          width={100}
          alt="Squeakpeek Logo"
          style={{}}
        />
        <Typography variant="h4">Support</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            paddingBottom: "16px",
          }}
        >
          Send support tickets to the SqueakPeek developers about bugs, feature
          requests, or encouraging feedback!
        </DialogContentText>
        <InputField
          label="Summary"
          required
          name="summary"
          placeholder="Summary"
          helperText={state.errors?.summary}
          fullWidth
          sx={{
            paddingBottom: "16px",
          }}
        />
        <InputField
          label="Description"
          required
          name="description"
          placeholder="Description"
          helperText={state.errors?.description}
          multiline
          rows={5}
          maxRows={5}
          fullWidth
          sx={{
            paddingBottom: "16px",
          }}
        />
        <Select
          name="issueType"
          value={issueType}
          label="issueType"
          title="Options"
          required
          fullWidth
        >
          <MenuItem onClick={() => setIssueType("Bug")} value="Bug">
            Bug
          </MenuItem>
          <MenuItem onClick={() => setIssueType("Feedback")} value="Feedback">
            Feedback
          </MenuItem>
          <MenuItem
            onClick={() => setIssueType("Feature Request")}
            value="Feature Request"
          >
            Feature Request
          </MenuItem>
        </Select>

        <FormHelperText>{state.errors?.issueType}</FormHelperText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={closeInterstitial}
          className="borderline"
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
          Cancel
        </Button>
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
      </DialogActions>
    </form>
  );
}
