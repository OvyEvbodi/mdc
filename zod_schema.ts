import { z } from "zod";


export const questionSchema = z.object({
  title: z.string({required_error: "title is required"}).trim().length(4, {message: "title too short" }),
  label: z.string({required_error: "label is required"}).trim().length(4, {message: "label too short" }),
  placeholder: z.string({required_error: "placeholder is required"}).trim().length(4, {message: "too short" }),
});