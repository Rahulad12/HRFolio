import { authRoutes } from "@/modules/auth";
import { RouteObject } from "react-router";
import { PublicRoutesLoader } from "../loaders/public-routes-loader";
import { landingRoutes } from "@/modules/landing";

export const publicRoutes: RouteObject[] = [
    {
        path: '/',
        loader: PublicRoutesLoader,
        children: [
            ...authRoutes,
            ...landingRoutes
        ]
    }
];
