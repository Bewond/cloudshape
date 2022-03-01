import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { SES } from "aws-sdk";
import { randomDigits } from "crypto-secure-random-digit";
import { env } from "process";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  let secretLoginCode: string | undefined;

  if (event.request.session && event.request.session.length) {
    // Existing session:
    // Reuse the code from the current session. This allows the user
    // to make a mistake when keying in the code and to then retry.
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode = previousChallenge?.challengeMetadata?.match(/CODE-(\d*)/)?.[1];
  } else {
    // New authentication session:
    // Generate a new secret login code and send it to the user.
    secretLoginCode = randomDigits(6).join("");
    if (event.request.userAttributes["email"])
      await sendEmail(event.request.userAttributes["email"], secretLoginCode);
  }

  if (secretLoginCode) {
    // Add the secret login code to the private challenge parameters so it can be
    // verified by the "Verify Auth Challenge Response" trigger.
    event.response.privateChallengeParameters = { secretLoginCode };

    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger.
    event.response.challengeMetadata = `CODE-${secretLoginCode}`;
  }

  // This is sent back to the client app.
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes["email"] ?? "undefined",
  };

  return event;
};

async function sendEmail(emailAddress: string, secretLoginCode: string) {
  if (env["emailSource"] && env["messageSubject"] && env["messageText"] && env["messageHtml"])
    await new SES()
      .sendEmail({
        Source: env["emailSource"],
        Destination: { ToAddresses: [emailAddress] },
        Message: {
          Subject: {
            Data: env["messageSubject"].replaceAll("$secretCode", secretLoginCode),
          },
          Body: {
            Text: {
              Data: env["messageText"].replaceAll("$secretCode", secretLoginCode),
            },
            Html: {
              Data: env["messageHtml"].replaceAll("$secretCode", secretLoginCode),
            },
          },
        },
      })
      .promise();
}
