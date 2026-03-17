import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Notification = sequelize.define(
    "Notification",
    {
        ID: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            comment: "Target user if notification is specific to a user",
        },

        role: {
            type: DataTypes.ENUM("admin", "caretaker", "tenant"),
            allowNull: false,
            comment: "Role that should receive the notification",
        },

        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "Notification type (payment_verified, maintenance_update, etc)",
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        reference_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            comment: "ID of the related record (payment, contract, maintenance)",
        },

        reference_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "Type of related record (payment, maintenance, contract)",
        },

        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "notifications",

        timestamps: true,

        createdAt: "created_at",

        updatedAt: false,
    }
);

export default Notification;