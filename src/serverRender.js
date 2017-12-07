import React from "react";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom";
import AppRouter from "./AppRouter";

export function render(req, context) {
    return renderToString(
        <StaticRouter
            location={req.url}
            context={context}
        >
            <AppRouter/>
        </StaticRouter>
    )
}

export function renderHead(context) {
    return context.head.map(h => (
        renderToStaticMarkup(h)
    )).join('')
}
