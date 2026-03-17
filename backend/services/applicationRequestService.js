import ApplicationRequest from "../models/applicationRequest.js";
import { sendMail } from "../utils/mailer.js";
import { applicationReceivedTemplate } from "../utils/emailTemplate.js";
import { createNotification } from "../services/notificationService.js";


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

    /* SEND CONFIRMATION EMAIL */
    await sendMail({
        to: emailAddress,
        subject: "Application Received - MGC Building",
        html: applicationReceivedTemplate(fullName)
    });

    /* NOTIFY ADMIN */
    await createNotification({
        role: "admin",
        type: "application_request",
        title: "New Application Request",
        message: `${fullName} (${emailAddress}) submitted an application request.`,
        referenceId: application.ID,
        referenceType: "application"
    });

    return application;
};