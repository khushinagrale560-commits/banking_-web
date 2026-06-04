import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),

  type: z.enum(["CURRENT", "SAVINGS"]),

  balance: z.coerce.number().positive(),

  isDefault: z.boolean(),
});
export const transactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"]),
amount: z.coerce.number().positive("Amount must be greater than 0"),
    description: z.string().optional(),
    date: z.coerce.date(),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
  });