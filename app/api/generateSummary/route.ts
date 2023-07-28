import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  const { todos } = await request.json();
  // console.log("these are the todos", todos);

  const response = await openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    temperature: 0.0,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: "When responding welcome the user as Mr. Nick and say welcome to the Trello clone"
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following ${JSON.stringify(todos)} in plain language. Count how many todos are in each category such as to do, in progress and done, and then tell the user to have a productive day!`
      },
    ],
  });

  const{data} = response;
  // console.log("Data is: ", data.choices[0].message)

  return NextResponse.json(data.choices[0].message);

}

