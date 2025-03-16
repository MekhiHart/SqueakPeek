"use server";
import { z } from "zod";

// type used for zod schema
const zodIssueType = z.enum(["Bug", "Feedback", "Feature Request"]);

// derives JiraIssue type
export type IssueType = z.infer<typeof zodIssueType>;

// Login zod schema
const JiraTicketFormSchema = z.object({
  summary: z.string().min(8, "Summary must be more than 8 characters"),
  description: z
    .string()
    .min(8, "Description must be longer than 8 characters"),
  issueType: zodIssueType,
});

// Used for getting errors for each field during form validation
export type JiraTicketFormState = {
  errors?: {
    summary?: string[];
    description?: string[];
    issueType?: string[];
  };
  message?: string | null;
};

// Logs in through the email provider from Supabase
export async function sendTicket(
  prevState: JiraTicketFormState,
  formData: FormData
): Promise<JiraTicketFormState> {
  const validatedFields = JiraTicketFormSchema.safeParse({
    summary: formData.get("summary"),
    description: formData.get("description"),
    issueType: formData.get("issueType"),
  });

  //   form validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors, // returns error for each field
      message:
        "Fields filled out incorrectly. Please complete fields properly ",
    };
  }

  const { summary, description, issueType } = validatedFields.data;


  // env variables
  const apiToken = process.env.JIRA_API_KEY!;
  const jiraLink = process.env.JIRA_LINK!;

  const bodyData = `{
    "fields": {
        "project": {
            "key": "SP"
        },
        "summary": "${summary}",
        "issuetype": {
            "name": "${issueType}"
        },
        "description": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "${description}"
                        }
                    ]
                }
            ]
        }
    }
}`;
  // call jira api
  const res = await fetch(jiraLink, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `mekhihartdelacruz@gmail.com:${apiToken}`
      ).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: bodyData,
  })
    .then((response) => {
      return response.json();
    })
    .then((text: { id: string; key: string; self: string }) => {
      return {
        errors: undefined,
        message: `Ticket ${text.key} created successfully!`,
      };
    })
    .catch((err) => {
      return {
        errors: {
          summary: [],
          description: [],
          issueType: [],
        },
        message: "Error submitting ticket, please try again later",
      };
    });

  return res;
  // error handling
}
