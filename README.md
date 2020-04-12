:warning: This Github action is an unofficial and W.I.P. Paragon workflow invocator.

This action will post into your Workflow endpoint the Github payload as is.<br />
You can send custom headers, adding those to the HTTP Request by specifying inputs.

## Configure your Paragon Workflow
The only requirement is to publish a workflow, exposing it via API Endpoint, waiting for "POST." <br />
This action expects the workflow to return a 200 OK response.


## Configure your Github Action
The Workflow ID is retrived by the action from your Github secrets, using the environment vars. <br />
**Do not expose your Workflow ID at any moment**.

1. Go to your repository's settings and click `Secrets` in the sidebar.
2. Add a new secret and set the name to `PARAGON_WORKFLOW_ID`.
3. Paste the copied **Endpoint ID from Paragon** into the `Value`.
4. Click `Add secret`.

```
steps:
  - uses: kedoska/invoke-paragon-action@v1.x
    env:
      PARAGON_WORKFLOW_ID: ${{ secrets.PARAGON_WORKFLOW_ID }}
```

### Inputs as Headers
To use request header parameters, sending values to Paragon as HTTP Headers, pass in an input matching the parameter name.

```
steps:
  - uses: kedoska/invoke-paragon-action@v1.x
    with:
        repository: ${{ github.repository }}
        status: "completed"
    env:
      PARAGON_WORKFLOW_ID: ${{ secrets.PARAGON_WORKFLOW_ID }}
```