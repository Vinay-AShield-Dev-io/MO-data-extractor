
import { EmailClient } from "@azure/communication-email";
import { ENV_VALS } from "../config/config";
import { getISTTime } from "./getISTTime";
const EMAIL_REPORT_TO = ENV_VALS.toEmailAdress
export type Attachment = {
    name: string;
    contentType: string;
    contentInBase64: string;
}[]


const connectionString = "endpoint=https://ashield-email-service.communication.azure.com/;accesskey=fuDEqq4vqhjq0Ov8QV5NuLiNVPPB4xft/OQnVfY97fqhfjUPBMVn6k8kCJUSipxZQ4uQX5HJKEWgaAt1hZrQfA==";

//----------------------------------------- send email ----------------------------------------------------
//  MOFailedNSucceeded: string, MOFailedNNotSucceeded: string
export async function sendMail(content: string, main_sub?: string, attachments?: Attachment): Promise<string | undefined> {
    const subject = main_sub ? main_sub : ENV_VALS.clusterName + " Report for " + getISTTime()[0];

    try {
        const client = new EmailClient(String(connectionString));
        //send mail
        const emailMessage = {
            senderAddress: "donotreply@bb59c0cb-0df5-47e4-b90f-00b671521401.azurecomm.net",
            content: {
                subject: subject,
                html: content,
                // plainText: 
            },
            recipients: {
                to: EMAIL_REPORT_TO
            },
            attachments
        };
        await client.beginSend(emailMessage);
        return "message sent successfully";
    } catch (e) {
        return "message sending failed:" + e;
    }
}

// ---------------------------------------------------------------------------
