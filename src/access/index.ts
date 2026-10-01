import type { Access, FieldAccess } from "payload";
export const isAuthenticated: Access = ({ req }) => Boolean(req.user);
export const isAdminField: FieldAccess = ({ req }) =>
    req.user?.role === "admin";
export const authenticatedOrPublished: Access = ({ req }) =>
    req.user ? true : { _status: { equals: "published" } };
export const canUpdateProject: Access = ({ req }) => {
    if (!req.user) return false;
    return req.user.role === "admin"
        ? true
        : { _status: { equals: "published" } };
};
