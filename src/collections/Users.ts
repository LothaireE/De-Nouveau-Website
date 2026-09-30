import { isAdminField } from "@/access";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
    slug: "users",
    labels: {
        singular: "Utilisateur",
        plural: "Utilisateurs",
    },
    admin: {
        group: "Réglages du site",
        useAsTitle: "email",
    },
    auth: true,
    fields: [
        {
            name: "firstName",
            label: "Prénom",
            type: "text",
            admin: {
                width: 50,
            },
        },

        {
            name: "lastName",
            label: "Nom",
            type: "text",
        },

        {
            name: "role",
            label: "Rôle",
            type: "select",
            defaultValue: "editor",
            options: [
                {
                    label: "Administrateur",
                    value: "admin",
                },
                {
                    label: "Éditeur",
                    value: "editor",
                },
            ],
            admin: {
                readOnly: true,
            },
            access: {
                create: isAdminField,
                update: isAdminField,
            },
        },

        {
            name: "bio",
            label: "Bio",
            type: "textarea",
        },

        {
            name: "isActive",
            label: "Compte actif",
            type: "checkbox",
            defaultValue: true,
        },

        {
            name: "lastLogin",
            label: "Dernière connexion",
            type: "date",
            admin: {
                readOnly: true,
            },
        },
    ],
};
