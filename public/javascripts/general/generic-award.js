window.addEventListener("load", async () => {
    const logs = createLogDisplay({ logType: "rockClimbing", viewOnly: false });
    byId("test-container").replaceWith(logs);
});