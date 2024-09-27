// import { EmailClient } from "@azure/communication-email";
import { getISTTime } from "./getISTTime";

const EMAIL_REPORT_TO = "";

export type Attachment = {
  name: string;
  contentType: string;
  contentInBase64: string;
}[];

//----------------------------------------- send email ----------------------------------------------------
//  MOFailedNSucceeded: string, MOFailedNNotSucceeded: string
export async function sendMail(
  content: string,
  main_sub?: string,
  attachments?: Attachment
): Promise<any> {
  const subject = main_sub ? main_sub : " Report for " + getISTTime()[0];

  try {
    // const client = new EmailClient(String(AZURE_CONNECTION_STRING));
    //send mail
    const emailMessage = {
      //   senderAddress: SENDER_ADDRESS,
      content: {
        subject: subject,
        html: content,
        // plainText:
      },
      recipients: {
        to: EMAIL_REPORT_TO,
      },
      attachments,
    };
    // await client.beginSend(emailMessage);
    console.log(emailMessage);
    return "message sent successfully";
  } catch (e) {
    if (typeof e === "string" || e === undefined) {
      throw new Error(e);
    } else {
      console.error("Unexpected error:", e);
      throw new Error("Message sending failed");
    }
  }
}

// ---------------------------------------------------------------------------
