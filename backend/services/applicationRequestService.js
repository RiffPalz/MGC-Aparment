import ApplicationRequest from "../models/applicationRequest.js";
import User from "../models/user.js";
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


/* CHECK APPLICATION STATUS BY EMAIL */
export const checkApplicationStatus = async (email) => {
    // Check if they have a user account first
    const user = await User.findOne({ where: { emailAddress: email, role: "tenant" } });
    if (user) {
        return {
            found: true,
            type: "account",
            fullName: user.fullName,
            status: user.status,
            submittedAt: user.created_at,
        };
    }

    // Check application request
    const application = await ApplicationRequest.findOne({
        where: { emailAddress: email },
        order: [["created_at", "DESC"]],
    });

    if (!application) throw new Error("No application found with this email address.");

    return {
        found: true,
        type: "application",
        fullName: application.fullName,
        status: "Under Review",
        submittedAt: application.created_at,
    };
};
