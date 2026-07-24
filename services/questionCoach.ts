export interface CoachResult {

  good: boolean;

  feedback: string[];

}

export function coachQuestion(

  question: string,

  answer: string

): CoachResult {

  const q = question.toLowerCase();

  const a = answer.toLowerCase();

  const feedback: string[] = [];

  //----------------------------------
  // Tell me about yourself
  //----------------------------------

  if (q.includes("tell me about yourself")) {

    if (!a.includes("name")) {

      feedback.push(

        "Introduce your name."

      );

    }

    if (

      !a.includes("student") &&

      !a.includes("graduate") &&

      !a.includes("university") &&

      !a.includes("college")

    ) {

      feedback.push(

        "Mention your education."

      );

    }

    if (

      !a.includes("strength") &&

      !a.includes("hardworking") &&

      !a.includes("responsible")

    ) {

      feedback.push(

        "Mention one or two strengths."

      );

    }

    if (

      !a.includes("career") &&

      !a.includes("future") &&

      !a.includes("goal")

    ) {

      feedback.push(

        "Mention your career goal."

      );

    }

  }

  //----------------------------------
  // Strength
  //----------------------------------

  if (

    q.includes("strength")

  ) {

    if (

      !a.includes("because") &&

      !a.includes("example")

    ) {

      feedback.push(

        "Give one example to support your strength."

      );

    }

  }

  //----------------------------------
  // Company
  //----------------------------------

  if (

    q.includes("company")

  ) {

    if (

      !a.includes("company")

    ) {

      feedback.push(

        "Explain why this company interests you."

      );

    }

    if (

      !a.includes("skill")

    ) {

      feedback.push(

        "Describe how your skills fit the company."

      );

    }

  }

  return {

    good:

      feedback.length === 0,

    feedback,

  };

}