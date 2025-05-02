import { NextRequest, NextResponse } from "next/server";
// import { v4 as uuidv4 } from 'uuid';
import { auth } from "@/lib/auth"
import { PrismaClient} from "@prisma/client";
import { questionSchema } from "@/zod_schema";


// Get a form owned by a signed in user
export const GET = async (request: NextRequest) => {

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || "";
  
  if (!id) {
    return NextResponse.json({ 
      error: {
        message: "Missing formId"
      }
    }, { status: 400 });
  }

  // Validate auth 
  const session = await auth();

  console.log(session)
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
    const formResult = await db.forms.findFirst({
      where: {
        user_id: user.id,
        id: id
      }
    })

    if (!formResult) {
      return NextResponse.json({
        error: {
          mesage: "Form not found"
        }
      }, {status: 404})

    }
    const questions = await db.questions.findMany({
        where: {
          form_id: formResult.id
        }
      })

    const form = {
      ...formResult,
      questions
    }

    console.log(form)

    return NextResponse.json({
      success: {
        mesage: "successful"
      },
      data: {form, user}
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

export const PATCH = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || "";
    const formId = url.searchParams.get('form-id') || "";
  
    if (!id) {
     return NextResponse.json({ 
       error: {
         message: "Missing formId"
       }
     }, { status: 400 });
    }
    

    const formEntry = await request.formData();
    console.log("ogayolooo", id, formEntry)
    const filledForm = {
      title: formEntry.get("title") as string || "",
      label: formEntry.get("label") as string || "",
      placeholder: formEntry.get("placeholder") as string || "",
      required: formEntry.get("required") as string || "false",
      id,
      form_id: formId
      // updated at??
    };
    // const validatedForm = questionSchema.safeParse(filledForm);
    

    // if (!validatedForm.success) {
    //   const formErrors = validatedForm.error.flatten().fieldErrors;

    //   console.log(formErrors, filledForm)
      
    //   return NextResponse.json({
    //     zodErrors: formErrors,
    //     data: filledForm
    //   }, { status: 400 })
    // }

    const db = new PrismaClient();

    const dbResult = await db.questions.update({
      where: {
        id: filledForm.id
      },
      data: {
        title: filledForm.title,
        label: filledForm.label,
        placeholder: filledForm.placeholder,
        required: filledForm.required
      }
    })
    console.log("db ------>", dbResult)

    return NextResponse.json({
      success: {
        mesage: "successful"
      },
      data: "data here....................."
    }, {status: 201})

  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to get forms. Please check back later."
      }
    }, {status: 500})
  }
}