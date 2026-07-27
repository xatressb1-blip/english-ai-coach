/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * AI Evaluation API
 *
 * File:
 * app/api/evaluate/route.ts
 *
 * Version:
 * 4.0 Stable
 *
 * Status:
 * Development
 *
 * Description
 * ------------------------------------------------------------
 * API Gateway for AI Evaluation.
 *
 * Responsibilities
 * ------------------------------------------------------------
 * • Validate request
 * • Call Gemini Client
 * • Return JSON response
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This file NEVER communicates directly with Google Gemini.
 *
 * ============================================================
 */

import {

  generateEvaluation,

} from "@/services/geminiClient";

export async function POST(

  request: Request

) {

  try {

    //----------------------------------------------------------
    // Request
    //----------------------------------------------------------

    const {

      prompt,

    } = await request.json();

    if (

      !prompt ||

      !prompt.trim()

    ) {

      return Response.json(

        {

          success: false,

          message:

            "Transcript is empty.",

        },

        {

          status: 400,

        }

      );

    }

    //----------------------------------------------------------
    // Gemini
    //----------------------------------------------------------

    const result =

      await generateEvaluation(

        prompt

      );

    //----------------------------------------------------------
    // Success
    //----------------------------------------------------------

    return Response.json({

      success: true,

      result,

    });

  }

  catch (error: any) {

    console.error(

      "[Evaluate API]",

      error

    );

    return Response.json(

      {

        success: false,

        message:

          error?.message ??

          "Unknown Server Error",

      },

      {

        status: 500,

      }

    );

  }

}