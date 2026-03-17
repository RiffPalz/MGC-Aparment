import Announcement from "../../models/announcement.js";
import { createNotification } from "../../services/notificationService.js";

/* CREATE ANNOUNCEMENT */
export const createAnnouncement = async ({
    announcementTitle,
    announcementMessage,
    category,
    adminId
}) => {

    if (!announcementTitle || !announcementMessage) {
        throw new Error("Title and message are required");
    }

    const announcement = await Announcement.create({
        announcementTitle,
        announcementMessage,
        category,
        createdBy: adminId
    });

    /* NOTIFY TENANTS */
    await createNotification({
        role: "tenant",
        type: "announcement_created",
        title: announcementTitle,
        message: announcementMessage,
        referenceId: announcement.ID,
        referenceType: "announcement"
    });

    /* NOTIFY CARETAKERS */
    await createNotification({
        role: "caretaker",
        type: "announcement_created",
        title: announcementTitle,
        message: announcementMessage,
        referenceId: announcement.ID,
        referenceType: "announcement"
    });

    return announcement;
};


/* GET ALL ANNOUNCEMENTS */
export const getAllAnnouncements = async () => {

    const announcements = await Announcement.findAll({
        order: [["created_at", "DESC"]]
    });

    return announcements;
};



/* UPDATE ANNOUNCEMENT */
export const updateAnnouncement = async (announcementId, updates) => {
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new Error("Announcement not found");
    }
    await announcement.update(updates);
    return announcement;
};


/* DELETE ANNOUNCEMENT */
export const deleteAnnouncement = async (announcementId) => {

    const announcement = await Announcement.findByPk(announcementId);

    if (!announcement) {
        throw new Error("Announcement not found");
    }

    await announcement.destroy();

    return {
        message: "Announcement deleted successfully"
    };
};