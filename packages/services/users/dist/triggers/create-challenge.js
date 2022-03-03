"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_secure_random_digit_1 = require("crypto-secure-random-digit");
const process_1 = require("process");
const handler = async (event) => {
    let secretLoginCode;
    // Existing session:
    if (event.request.session && event.request.session.length) {
        // Reuse the code from the current session. This allows the user
        // to make a mistake when keying in the code and to then retry.
        const previousChallenge = event.request.session.slice(-1)[0];
        secretLoginCode = previousChallenge?.challengeMetadata?.match(/CODE-(\d*)/)?.[1];
    }
    // New session:
    else if (event.request.userAttributes["email"]) {
        // Generate a new secret login code and send it to the user.
        secretLoginCode = (0, crypto_secure_random_digit_1.randomDigits)(6).join("");
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
    event.response.publicChallengeParameters = {
        email: event.request.userAttributes["email"] ?? "undefined",
    };
    return event;
};
exports.handler = handler;
async function sendEmail(emailAddress, secretLoginCode) {
    const varname = "$secretCode";
    if (process_1.env["emailSource"] && process_1.env["messageSubject"] && process_1.env["messageText"] && process_1.env["messageHtml"])
        await new aws_sdk_1.SES()
            .sendEmail({
            Source: process_1.env["emailSource"],
            Destination: { ToAddresses: [emailAddress] },
            Message: {
                Subject: {
                    Data: process_1.env["messageSubject"].replaceAll(varname, secretLoginCode),
                },
                Body: {
                    Text: {
                        Data: process_1.env["messageText"].replaceAll(varname, secretLoginCode),
                    },
                    Html: {
                        Data: process_1.env["messageHtml"].replaceAll(varname, secretLoginCode),
                    },
                },
            },
        })
            .promise();
}
//# sourceMappingURL=create-challenge.js.map