import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
    },
    auth: true,
    fields: [
        {
            name: "firstName",
            label: "First name",
            type: "text",
            admin: {
                width: 50,
            },
        },

        {
            name: "lastName",
            label: "Last name",
            type: "text",
        },

        {
            name: "role",
            label: "Role",
            type: "select",
            defaultValue: "editor",
            options: [
                {
                    label: "Admin",
                    value: "admin",
                },
                {
                    label: "Editor",
                    value: "editor",
                },
            ],
            admin: {
                readOnly: true,
            },
            access: {
                update: ({ req }) => {
                    return req.user?.role === "admin";
                },
            },
        },

        {
            name: "bio",
            label: "Bio",
            type: "textarea",
        },

        {
            name: "isActive",
            label: "Active account",
            type: "checkbox",
            defaultValue: true,
        },

        {
            name: "lastLogin",
            label: "Last login",
            type: "date",
            admin: {
                readOnly: true,
            },
        },
    ],
};
