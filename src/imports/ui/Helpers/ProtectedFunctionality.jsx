import React from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { Roles } from "meteor/alanning:roles";
import { useTracker } from "meteor/react-meteor-data";

// @material-ui
import { Skeleton } from "@material-ui/lab";

export default function ProtectedFunctionality({
  component: Component,
  loginRequired,
  requiredRoles,
  iconButton,
  skeleton,
}) {
  const [user, roles, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("roles");
    const roles = Roles.getRolesForUser(Meteor.userId());
    const user = Meteor.user()?.username;
    return [user, roles, !sub.ready()];
  });

  const roleCheck = () => {
    // ensure that every role that is required to access the component is present in the user's roles
    return requiredRoles
      ? requiredRoles.every((role) => roles.includes(role))
      : true;
  };

  const loginCheck = () => {
    // if login is required, then return the user and isLoading booleans to check for user prior to loading the component
    return loginRequired ? user : true;
  };

  return !isLoading ? (
    roleCheck() && loginCheck() ? (
      <Component />
    ) : null
  ) : skeleton || skeleton === undefined ? (
    <Skeleton
      variant={iconButton ? "circle" : "rect"}
      style={iconButton ? {} : { borderRadius: 5 }}
    >
      <Component />
    </Skeleton>
  ) : null;
}