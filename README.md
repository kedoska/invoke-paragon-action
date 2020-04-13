This Github action is an unofficial [Paragon Workflow](https://www.useparagon.com/) invocator.<br />
Before you start using this action, consider that Paragon is currently in Beta, and breaking changes may occur at any time.

1. This action will post into your Workflow endpoint the Github payload as is. For more details, please review the [documentation](https://developer.github.com/v3/activity/events/types/).
2. You can send custom headers, adding those to the HTTP Request by specifying `inputs`.
3. By default, `eventName` parameter is added to the `querystring`.

## Configure Paragon Workflow
The only requirement is to publish a workflow, exposing it via API Endpoint, waiting for "POST." <br />
This action expects the workflow to return a 200 OK response.

## Configure Github repository's settings
The Workflow ID is retrived by the action from your Github secrets, using the environment vars. <br />
**Do not expose your Workflow ID at any moment**.

1. Go to your repository's settings and click `Secrets` in the sidebar.
2. Add a new secret and set the name to `PARAGON_WORKFLOW_ID`, they looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
3. Paste the copied **Endpoint ID from Paragon** into the `Value`.
4. Click `Add secret`.

## Configure Github repository's action

### Basic Example

The following example sends the payload to the configured Paragon on every push event.

```
on: [push]

jobs:
  hello_paragon:
    runs-on: ubuntu-latest
    steps:
    - name: Invoke Paragon Endpoint
      uses: kedoska/invoke-paragon-action@v1
      env:
        PARAGON_WORKFLOW_ID: ${{ secrets.PARAGON_WORKFLOW_ID }}
```

### Add Headers Example

The following example sends the payload of the configured Paragon on every release event, adding three extra parameters in the headers of your workflow.<br />
`Param1`, `Param2`, and `Param3` are sent to your endpoint, as standard HTTP `headers`.<br />
You can use these params to secure your endpoint as it is exposed to the Internet.

```
on: [push]

jobs:
  hello_paragon:
    runs-on: ubuntu-latest
    steps:
    - name: Invoke Paragon Endpoint
      uses: kedoska/invoke-paragon-action@v1
      with:
          param1: "first param"
          param2: "second static param"
          param3: ${{ github.repository }}
      env:
        PARAGON_WORKFLOW_ID: ${{ secrets.PARAGON_WORKFLOW_ID }}
```
