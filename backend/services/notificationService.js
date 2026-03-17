import Notification from "../models/notifications.js";
import { Op } from "sequelize";

// Create and save a new notification
export const createNotification = async ({
    userId = null,
    role,
    type,
    title,
    message,
    referenceId = null,
    referenceType = null
}) => {
    // Ensure all required information is provided
    if (!role || !type || !title || !message) {
        throw new Error("Missing required notification fields");
    }

    const notification = await Notification.create({
        user_id: userId,
        role,
        type,
        title,
        message,
        reference_id: referenceId,
        reference_type: referenceType
    });

    return notification;
};

// Fetch personal alerts and global announcements for a user
export const getUserNotifications = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to fetch notifications");
    }

    const notifications = await Notification.findAll({
        where: {
            [Op.or]: [
                { user_id: userId },            // Direct alerts (Bills, Contracts)
                { role: "tenant", user_id: null } // Public announcements
            ]
        },
        order: [["created_at", "DESC"]]
    });

    return notifications;
};

// Fetch all notifications assigned to a specific role (Admin, Caretaker, etc.)
export const getRoleNotifications = async (role) => {
    if (!role) {
        throw new Error("Role is required to fetch notifications");
    }

    const notifications = await Notification.findAll({
        where: { role },
        order: [["created_at", "DESC"]]
    });

    return notifications;
};

// Mark a specific notification as seen
export const markNotificationAsRead = async (notificationId) => {
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
        throw new Error("Notification not found");
    }

    notification.is_read = true;
    await notification.save();

    return notification;
};

// Mark all relevant notifications for a user as seen at once
export const markAllNotificationsAsRead = async (userId, userRole) => {
    let whereClause = {};

    // Determine which notifications to target based on user type
    if (userRole === "tenant") {
        whereClause = {
            [Op.or]: [
                { user_id: userId },
                { role: "tenant", user_id: null }
            ]
        };
    } else {
        whereClause = {
            [Op.or]: [
                { role: userRole },
                { user_id: userId }
            ]
        };
    }

    await Notification.update(
        { is_read: true },
        { where: whereClause }
    );

    return { message: "All notifications marked as read" };
};