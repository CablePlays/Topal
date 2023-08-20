window.addEventListener("load", async () => {
    const logs = createLogDisplay({ logType: "running", showCreate: true, showOptions: true });
    byId("test-container").replaceWith(logs);
});