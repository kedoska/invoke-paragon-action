import * as core from '@actions/core'
import * as github from '@actions/github'
import fetch from 'node-fetch'
import yaml from 'js-yaml'

async function run(): Promise<void> {
  try {
    // workflowId represents the id of the Paragon endpoint.
    const workflowId: string = process.env['PARAGON_WORKFLOW_ID'] || ''
    if (!workflowId) {
      core.debug(
        `Define the workflow id value in the action secrets to use this action.`
      )
      return
    }

    // In the future Paragon will probably support dedicated DNS.
    // Here is where we could read the configuration and pick the domain name from a secret.
    const domain = process.env['PARAGON_DOMAIN'] || 'hermes.useparagon.com'

    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    if (!owner || !repo) {
      return
    }

    const {
      // in Paragon the `eventName` can be used as a primary filter to select the parser.
      eventName,
      payload
    } = github.context

    const url = `https://${domain}/triggers/${workflowId}?eventName=${eventName}`

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        ...getInputsAsHeaders()
      }
    })

    if (!response.ok) {
      core.setFailed(
        `something went wrong: workflow returned ${response.status} (${response.statusText})`
      )
      return
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

interface Inputs {
  [key: string]: string
}

// getInputsAsHeaders extracts from the env the inputs given by the user.
// Copy/Paste/Change from https://github.com/octokit/request-action/blob/a43ad662a5c7b9f83ff18ff5d40564f214c23925/index.js#L41
function getInputsAsHeaders(): Inputs {
  return Object.entries(process.env).reduce(
    (result: Inputs, [key, value = '']) => {
      if (!key.startsWith('INPUT_')) {
        return result
      }

      const inputName = key.substr('INPUT_'.length).toLowerCase()
      result[inputName] = yaml.safeLoad(value)

      return result
    },
    {}
  )
}

run()
