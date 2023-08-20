const _REQUEST_PREFIX = "/requests";

async function _sendRequest(method, path, json) {
    const reqParams = { method };

    if (json != null) {
        reqParams.headers = {
            "Content-Type": "application/json"
        };
        reqParams.body = JSON.stringify(json);
    }

    console.info("Making " + method + " request to " + path);
    const res = await fetch(_REQUEST_PREFIX + path, reqParams);

    const r = {
        ok: res.ok,
        status: res.status
    };

    if (res.headers.get("content-type")?.includes("application/json")) {
        const j = await res.json();
        Object.assign(r, j);

        if (!res.ok) {
            console.warn(j.error);
        }
    }

    return r;
}

async function deleteRequest(path, json) {
    return await _sendRequest("DELETE", path, json);
}

async function getRequest(path) {
    return await _sendRequest("GET", path);
}

async function postRequest(path, json) {
    return await _sendRequest("POST", path, json);
}

async function putRequest(path, json) {
    return await _sendRequest("PUT", path, json);
}