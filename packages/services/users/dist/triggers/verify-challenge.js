"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    const expectedAnswer = event.request.privateChallengeParameters?.["secretLoginCode"];
    if (event.request.challengeAnswer === expectedAnswer) {
        event.response.answerCorrect = true;
    }
    else {
        event.response.answerCorrect = false;
    }
    return event;
};
exports.handler = handler;
//# sourceMappingURL=verify-challenge.js.map