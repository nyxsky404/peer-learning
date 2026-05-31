import { z } from "zod";

// --- AI Routes Schemas ---
export const askAISchema = z.object({
  question: z
    .string({
      required_error: "Invalid question provided",
      invalid_type_error: "Invalid question provided",
    })
    .min(1, "Question cannot be empty")
    .max(2000, "Question exceeds maximum length of 2000 characters"),
});

export const generateSummarySchema = z.object({
  messages: z
    .array(
      z.object({
        username: z.string().optional(),
        message: z.string(),
      })
    )
    .min(1, "Messages are required and must be a non-empty array"),
});

// --- Auth Routes Schemas ---
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please provide a valid email address"),
});

export const resetPasswordSchema = {
  params: z.object({
    token: z.string({ required_error: "Token is required" }),
  }),
  body: z.object({
    password: z.string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters long")
      .or(z.undefined()),
    newPassword: z.string().min(6, "Password must be at least 6 characters long").or(z.undefined()),
  }).refine((data) => data.password || data.newPassword, {
    message: "Token and new password are required",
    path: ["password"],
  }),
};

// --- Chat Routes Schemas ---
export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"], {
          errorMap: () => ({ message: "Each message must have a role (user|assistant|system)" }),
        }),
        content: z.string({
          required_error: "String content field is required",
          invalid_type_error: "String content field is required",
        }),
      })
    )
    .min(1, "A non-empty messages array is required.")
    .max(50, "Maximum of 50 messages allowed per request.")
    .refine(
      (msgs) => {
        const totalLength = msgs.reduce((acc, m) => acc + (m.content ? m.content.length : 0), 0);
        return totalLength <= 20000;
      },
      { message: "Total message content exceeds maximum allowed length." }
    ),
  model: z.string().optional().default("openai/gpt-3.5-turbo"),
  max_tokens: z.number().optional(),
  temperature: z.number().min(0).max(2).optional().default(0.7),
});
