import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient} from "@prisma/client";


// Add a response entry
export const PUT = async (request: NextRequest) => {

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || "";
  const responseId = uuidv4();
  const responseValues = await request.json();
  const answerData = {};
  console.log(responseValues, id)

  if (!id) {
    return NextResponse.json({ 
      error: {
        message: "Missing formId"
      }
    }, { status: 400 });
  }

  try {

    const db = new PrismaClient();

    //find valid form
    const formResult = await db.forms.findFirst({
      where: {
        id: id
      }
    })

    if (!formResult) {
      return NextResponse.json({
        error: {
          mesage: "Form not found. Please check that the link is correct."
        }
      }, {status: 404})
    }
    if (!formResult.published) {
      return NextResponse.json({
        error: {
          mesage: "This form is currently not taking responses."
        }
      }, {status: 404})
    }

  //   const dbResponse = await db.$transaction( async (db) => {
  //     const res = db.responses.create({
  //       data: {
  //         id: responseId,
  //         form_id: id,
  //       }
  //     });

  //     // add answer rows
  //     const ans = Object.entries(responseValues).map(async ([key, value]) => {
  //       const questionsResult = await db.questions.findFirst({
  //         where: {
  //           form_id: id,
  //           title: key
  //         },
  //         select: {
  //           id: true
  //         }
  //       })
  //       if (questionsResult) {
  //         // add answer rows
  //         const answerRes = db.answers.create({
  //           data: {
  //             id: uuidv4(),
  //             response_id: responseId,
  //             question_id: questionsResult.id,
  //             value: value as string
  //           }
  //         })
  //         console.log(answerRes)
  //         return answerRes
  //       }
         
  
  //       console.log(questionsResult, key, value)
  //     })
  //     return {res, ans}
  // });


  // delete from here down, uncomment block above
    const respnoseRes = await db.responses.create({
      data: {
        id: responseId,
        form_id: id,
      }
    });

    console.log(respnoseRes)

    // add answer rows
    const answerList = Object.entries(responseValues);
    console.log("answer------", answerList)
    const ansDbRes = await Promise.all(answerList.map(async ([key, value]) => {
      const questionsResult = await db.questions.findFirst({
        where: {
          form_id: id,
          title: key
        },
        select: {
          id: true
        }
      })
      if (questionsResult) {
        // add answer rows
        const answerRes = await db.answers.create({
          data: {
            id: uuidv4(),
            response_id: responseId,
            question_id: questionsResult.id,
            value: value as string
          }
        })
        console.log(answerRes)
      }
       
      console.log(questionsResult, key, value)
    }))
    console.log(respnoseRes, ansDbRes)

// delete from here up

    return NextResponse.json({
      success: {
        mesage: "Response successfully submitted"
      },
      data: {}
    }, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to submit response. Please try again."
      }
    }, {status: 500})
  }


  // // Retrieve user's forms from database
  // try {

  
  //   const user = await db.users.findFirst({
  //     where: {
  //       email: userEmail
  //     }
  //   })
  //   if (!user) {
  //     return NextResponse.json({
  //       error: {
  //         mesage: "Please sign up"
  //       }
  //     }, {status: 401})
  //   }
    

  //   }
  //   const questions = await db.questions.findMany({
  //       where: {
  //         form_id: formResult.id
  //       }
  //     })

  //   const form = {
  //     ...formResult,
  //     questions
  //   }

  //   return NextResponse.json({
  //     success: {
  //       mesage: "successful"
  //     },
  //     data: {form, user}
  //   }, {status: 200})
  // }
  // catch (error) {
   
  // }

  
};
