import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from '@prisma/client';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get all users
export const getUsers = async () => {
  const db = new PrismaClient();
  const users = await db.users.findMany();
  console.log(users)
  return users

}

//Get all forms for a particular user
