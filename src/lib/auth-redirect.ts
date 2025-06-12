import Cookies from "js-cookie";

export function handleUnauthorizedRedirect(currentPath: string) {
    const isProtectedPath = currentPath.startsWith("/sa") || currentPath.startsWith("/member");

    // delete auth_token
    Cookies.remove("auth_token");

    // if not protected path just delete token
    if (!isProtectedPath) {
        return;
    }

    // if protected, redirect to login with callback url
    const callbackUrl = encodeURIComponent(currentPath + window.location.search);

    // redirect to login based on prefix path
    if (currentPath.startsWith("/sa")) {
        window.location.href = `/sa/signin?callbackUrl=${callbackUrl}`;
    } else {
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
    }
}