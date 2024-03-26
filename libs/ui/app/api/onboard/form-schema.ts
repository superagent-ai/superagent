import { z } from "zod"

export const onboardFormSchema = z.object({
  first_name: z.string().nonempty("Invalid first name."),
  last_name: z.string().nonempty("Invalid last name."),
  company: z.string().nonempty("Enter a company name"),
})
