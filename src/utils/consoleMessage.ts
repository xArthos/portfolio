export const consoleMessage = (
    operation: string,
    operationName: string,
    message: string
) => {
    return console.log(`\u001b[36m[${operation}]\u001b[0m \u001b[33m${operationName}:\u001b[0m ${message}`);
};

export const consoleMessageResult = (
    success: boolean,
    operationName: string,
    message: string
) => {
    return console.log(`\u001b[${success ? 32 : 31}m${success ? '✓ Success' : '✖ Failed'}\u001b[0m \u001b[33m${operationName}:\u001b[0m \u001b[0m${message}\u001b[0m`);
};