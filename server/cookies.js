const USER_COOKIE = "user_id"
const PASSWORD_COOKIE = "session_token"

function getCookie(name, cookies) {
    cookies = decodeURIComponent(cookies || "").split(";")
    let cname = name + "="

    for (let cookie of cookies) {
        cookie = cookie.trim()

        if (cookie.startsWith(cname)) {
            return cookie.substring(cname.length, cookie.length)
        }
    }

    return null
}

function getUserId(req) {
    const userId = getCookie(USER_COOKIE, req.headers.cookie)
    return (userId == null) ? null : parseInt(userId)
}

function getPassword(req) {
    return getCookie(PASSWORD_COOKIE, req.headers.cookie)
}

function isLoggedIn(req) {
    return (getUserId(req) != null) && (getPassword(req) != null)
}

function logOut(res) {
    res.clearCookie(USER_COOKIE)
    res.clearCookie(PASSWORD_COOKIE)
}

module.exports = {
    USER_COOKIE,
    PASSWORD_COOKIE,

    logOut,
    getUserId,
    getPassword,
    isLoggedIn
}