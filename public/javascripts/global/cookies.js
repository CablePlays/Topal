const USER_COOKIE = "user_id";
const PASSWORD_COOKIE = "session_token";

function _getCookie(name) {
    let cookies = decodeURIComponent(document.cookie || "").split(";");
    let cname = name + "=";

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(cname)) {
            return cookie.substring(cname.length, cookie.length);
        }
    }

    return null;
}

function _removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function getUserId() {
    const id = _getCookie(USER_COOKIE);
    return (id == null) ? null : parseInt(id);
}

function getPassword() {
    return _getCookie(PASSWORD_COOKIE);
}

/*
    Does not check if login is valid.
*/
function isLoggedIn() {
    return (getUserId() != null) && (getPassword() != null);
}

function logOut() {
    _removeCookie(USER_COOKIE);
    _removeCookie(PASSWORD_COOKIE);
}