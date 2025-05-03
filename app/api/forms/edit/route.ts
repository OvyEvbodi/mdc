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

// update a question
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

// Add a new question or form
// delete a question
export const PUT = async (request: NextRequest) => {

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || "";
   const formId = url.searchParams.get('form-id') || "";
  const action = url.searchParams.get('action') || "";
  
  if (!id) {
    return NextResponse.json({ 
      error: {
        message: "Missing formId"
      }
    }, { status: 400 });
  }

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

  const formEntry = await request.formData();
    console.log("ogayolooo", id, formEntry)
    const filledForm = {
      type: formEntry.get("type") as string || "",
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
        id: formId
      }
    })

    if (!formResult) {
      return NextResponse.json({
        error: {
          mesage: "Form not found"
        }
      }, {status: 404})
    }

    if (user.id !== formResult.user_id) {
      return NextResponse.json({
        error: {
          mesage: "You are not allowed to edit this form"
        }
      }, {status: 403})
    }
    if (action === "save-question") {
      const dbResponse = await db.questions.create({
        data: {
          ...filledForm
        }
      })
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to delete question. Please try again."
          }
        }, {status: 500})
      }

      console.log(dbResponse)
    } else if (action === "save-form") {
      // save new form
      // check for failure and return error
    }
    
    return NextResponse.json({
      success: {
        mesage: "successfully deleted!"
      },
      data: {user}
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


// delete a form or question
export const DELETE = async (request: NextRequest) => {

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || "";
   const formId = url.searchParams.get('form-id') || "";
  const action = url.searchParams.get('action') || "";
  
  if (!id) {
    return NextResponse.json({ 
      error: {
        message: "Missing formId"
      }
    }, { status: 400 });
  }

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

    const formResult = await db.forms.findFirst({
      where: {
        user_id: user.id,
        id: formId
      }
    })

    if (!formResult) {
      return NextResponse.json({
        error: {
          mesage: "Form not found"
        }
      }, {status: 404})
    }

    if (user.id !== formResult.user_id) {
      return NextResponse.json({
        error: {
          mesage: "You are not allowed to edit this form"
        }
      }, {status: 403})
    }
    if (action === "delete-question") {
      const dbResponse = await db.questions.delete({
        where: {
          form_id: formResult.id,
          id: id
        }
      })
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to delete question. Please try again."
          }
        }, {status: 500})
      }

      console.log(dbResponse)
    } else if (action === "delete-form") {
      // delete form
      // check for failure and return error
    }
    
    return NextResponse.json({
      success: {
        mesage: "successfully deleted!"
      },
      data: {user}
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
