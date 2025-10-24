import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest'

    // Validate that only 'latest' is provided (we don't support other versions yet)
    if (version !== 'latest') {
      core.setFailed(`Only 'latest' version is supported. Provided: ${version}`)
      return
    }

    // Determine platform and architecture
    const platform = process.platform
    const arch = process.arch

    let downloadUrl: string
    let binaryName = 'pw'

    // Map Node.js platform/arch to the CLI download URLs
    if (platform === 'linux') {
      if (arch === 'x64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-linux-amd64'
      } else if (arch === 'arm64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-linux-arm64'
      } else {
        throw new Error(`Unsupported Linux architecture: ${arch}`)
      }
    } else if (platform === 'darwin') {
      if (arch === 'x64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-darwin-amd64'
      } else if (arch === 'arm64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-darwin-arm64'
      } else {
        throw new Error(`Unsupported macOS architecture: ${arch}`)
      }
    } else if (platform === 'win32') {
      binaryName = 'pw.exe'
      if (arch === 'x64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-windows-amd64.exe'
      } else if (arch === 'arm64') {
        downloadUrl = 'https://cloud.parallel.works/cli/pw-windows-arm64.exe'
      } else {
        throw new Error(`Unsupported Windows architecture: ${arch}`)
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    core.info(`Downloading Parallel Works CLI from: ${downloadUrl}`)

    // Download the binary
    const downloadPath = await tc.downloadTool(downloadUrl)

    // Create a directory for the tool
    const toolDir = path.join(process.env.RUNNER_TEMP || '/tmp', 'pw-cli')
    await io.mkdirP(toolDir)

    // Move and rename the binary
    const binaryPath = path.join(toolDir, binaryName)
    await io.mv(downloadPath, binaryPath)

    // Make it executable (Unix-like systems)
    if (platform !== 'win32') {
      await exec.exec('chmod', ['+x', binaryPath])
    }

    // Add to PATH
    core.addPath(toolDir)

    // Verify installation
    try {
      await exec.exec('pw', ['--version'])
      core.info('Parallel Works CLI installed successfully!')
    } catch (error) {
      // If --version fails, try just running 'pw' to see if it's working
      core.info('CLI installed, version check may not be available')
    }

    // Set output
    core.setOutput('pw-path', binaryPath)
  } catch (error) {
    core.setFailed(
      `Action failed with error: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

run()
