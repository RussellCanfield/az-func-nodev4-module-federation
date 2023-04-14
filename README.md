# Azure Functions V4 Node Programming Model with Module Federation

This repo is built upon the [Azure Functions Node V4 Programming Model](https://azure.microsoft.com/en-us/updates/public-preview-azure-functions-v4-programming-model-for-nodejs/) and demonstrates the ability to federate two different ways.

-Federating from a CSR to the Azure Function SSR content.
-Federating from the Azure Function to a CSR app.

The AZ Func -> CSR is not fully configured due to cyclical dependencies with typescript project references. However, you just have to point the remote file of the CSR app, to the /api/chunks route in the Azure function.

To run the SSR example, run:

-   npm run build
-   npm run start-ssr
