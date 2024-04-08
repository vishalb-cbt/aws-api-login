import { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_SignUp") {
    const username = event.userName;
    const message = `please click the link to verify <a href="http://localhost:5173/login?username=${username}&code=${event.request.codeParameter}">link</a>`;
    event.response.smsMessage = message;
    event.response.emailMessage = message;
    event.response.emailSubject = "Welcome to the service.";
  }
  return event;
};
