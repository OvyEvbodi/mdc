import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { auth } from "@/lib/auth"
import { PrismaClient} from "@prisma/client";
// import { questionSchema } from "@/zod_schema";


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
    const action = url.searchParams.get('action') || "";
  
    if (!formId && !id) {
     return NextResponse.json({ 
       error: {
         message: "Missing formId"
       }
     }, { status: 400 });
    }
    

    const formEntry = await request.formData();
    console.log("ogayolooo", id, formEntry)
    

    const db = new PrismaClient();
    if (action === "update-question") {
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
      const dbResponse = await db.questions.update({
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
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to edit question. Please try again."
          }
        }, {status: 500})
      }
      console.log("db patch------>", dbResponse)
    } else if (action === "update-form") {
      const strPublished = formEntry.get("published") as string || "";
      const filledForm = {
        name: formEntry.get("name") as string || "",
        description: formEntry.get("description") as string || "",
        url: formEntry.get("url") as string || "",
        published: strPublished === "true",
        id: formId
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
      console.log(filledForm.published)
      const dbResponse = await db.forms.update({
        where: {
          id: filledForm.id
        },
        data: {
          name: filledForm.name,
          description: filledForm.description,
          published: filledForm.published,
          // settings: for future updates
        }
      })
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to edit form. Please try again."
          }
        }, {status: 500})
      }
      console.log("db patch------>", dbResponse)

    } else if (action === "update-options") {
      // const filledForm = {
      //   name: formEntry.get("name") as string || "",
      //   description: formEntry.get("description") as string || "",
      //   id: formId
      //   // updated at??
      // };
      
      // const dbResponse = await db.responses.update({
      //   where: {
      //     id: filledForm.id
      //   },
      //   data: {
      //     name: filledForm.name,
      //     description: filledForm.description,
      //     // settings: for future updates
      //   }
      // })
      // if (!dbResponse) {
      //   return NextResponse.json({
      //     error: {
      //       message: "Unable to edit options. Please try again."
      //     }
      //   }, {status: 500})
      // }
      // console.log("db patch------>", dbResponse)
    }
    

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
export const PUT = async (request: NextRequest) => {

  const url = new URL(request.url);
  const formId = url.searchParams.get('form-id') || "";
  const action = url.searchParams.get('action') || "";
  
  if (action !== "add-form" && !formId) {
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

    if (action === "add-form") {

      const id = uuidv4();
      const responseValues = await request.json();
      console.log(responseValues, id)
      console.log("adding and returning")
      const dbResponse = await db.forms.create({
        data: {
          id,
          user_id: user.id,
          name: responseValues.name,
          description: responseValues.description,
          published: responseValues.published === "true" ,
          url: `forms/${id}`
        }
      })
      
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to add form. Please try again."
          }
        }, {status: 500})
      }
      return NextResponse.json({
        success: {
          mesage: "successfully added!"
        },
        data: {user}
      }, {status: 200})
    }

    const formEntry = await request.formData();

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
          mesage: "You are not allowed to save this form"
        }
      }, {status: 403})
    }
    if (action === "save-question") {
      const filledForm = {
        type: formEntry.get("type") as string || "",
        title: formEntry.get("title") as string || "",
        label: formEntry.get("label") as string || "",
        placeholder: formEntry.get("placeholder") as string || "",
        required: formEntry.get("required") as string || "false",
        id: uuidv4(),
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
      const dbResponse = await db.questions.create({
        data: {
          ...filledForm
        }
      })
      if (!dbResponse) {
        return NextResponse.json({
          error: {
            message: "Unable to add question. Please try again."
          }
        }, {status: 500})
      }

      console.log(dbResponse)
    }
    
    return NextResponse.json({
      success: {
        mesage: "successfully added!"
      },
      data: {user}
    }, {status: 200})
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to add form or question. Please check back later."
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
