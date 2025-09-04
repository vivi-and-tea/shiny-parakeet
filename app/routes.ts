// app/routes.ts
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/users", "routes/users.tsx"), 
  route("/slow", "routes/slow.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/timeout", "routes/timeout.tsx")
] satisfies RouteConfig;