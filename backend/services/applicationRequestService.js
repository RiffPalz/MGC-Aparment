import ApplicationRequest from "../models/applicationRequest.js";
import { sendMail } from "../utils/mailer.js";
import { applicationReceivedTemplate } from "../utils/emailTemplate.js";


/* CREATE APPLICATION REQUEST */
export const createApplicationRequest = async ({
    fullName,
    emailAddress,
    contactNumber,
    validID,
    message
}) => {

    if (!fullName || !emailAddress || !contactNumber || !validID) {
        throw new Error("All required fields must be provided");
    }

    const application = await ApplicationRequest.create({
        fullName,
        emailAddress,
        contactNumber,
        validID,
        message
    });

    // Send confirmation email
    await sendMail({
        to: emailAddress,
        subject: "Application Received - MGC Building",
        html: applicationReceivedTemplate(fullName)
    });

    return application;
};