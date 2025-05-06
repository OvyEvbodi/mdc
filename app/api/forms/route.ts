import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from 'uuid';
import { auth } from "@/lib/auth"
import { PrismaClient } from "@prisma/client";


// Get all forms owned by a signed in user
export const GET = async () => {

  // Validate auth 
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      error: {
        mesage: "You are not authorized to view this page"
      }
    }, {status: 401})
  }
  const userEmail = session.user?.email || "mdc-invalid";

  // Retrieve user's forms from database
  try {

    const db = new PrismaClient();
    const user = await db.users.findFirst({
      where: {
        email: userEmail
      }
    })
    if (!user) {
      return NextResponse.json({
        error: {
          mesage: "Please sign up"
        }
      }, {status: 401})
    }
    const formsList = await db.forms.findMany({
      where: {
        user_id: user.id
      }
    })
    const forms = await Promise.all(formsList.map(async(form) => {
      const questions = await db.questions.findMany({
        where: {
          form_id: form.id
        }
      })

      return {...form, questions}

    }))

    return NextResponse.json({
      success: {
        mesage: "successful"
      },
      data: {forms, user}
    }, {status: 200})
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to get forms. Please check back later."
      }
    }, {status: 500})
  }
};
