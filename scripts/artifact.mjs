import fs from 'fs'
import axios from 'axios'
import path from 'path'
import FormData from 'form-data'
import { execSync } from 'child_process'

const CHAT_ID = '@MihomoPartyCi'
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE
const pkg = fs.readFileSync('package.json', 'utf-8')
const { version } = JSON.parse(pkg)
const hash = execSync('git rev-parse --short HEAD').toString().trim()

const linuxFiles = [
  path.join(GITHUB_WORKSPACE, `mihomo-party-linux-${version}-aarch64.rpm`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-linux-${version}-arm64.deb`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-linux-${version}-x86_64.rpm`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-linux-${version}-amd64.deb`)
]

const macosFiles = [
  path.join(GITHUB_WORKSPACE, `mihomo-party-macos-${version}-arm64.dmg`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-macos-${version}-x64.dmg`)
]

const windowsFiles = [
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-x64-setup.exe`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-x64-portable.7z`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-ia32-setup.exe`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-ia32-portable.7z`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-arm64-setup.exe`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-windows-${version}-arm64-portable.7z`)
]

const windows7Files = [
  path.join(GITHUB_WORKSPACE, `mihomo-party-win7-${version}-x64-setup.exe`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-win7-${version}-x64-portable.7z`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-win7-${version}-ia32-setup.exe`),
  path.join(GITHUB_WORKSPACE, `mihomo-party-win7-${version}-ia32-portable.7z`)
]

const windowsMedia = windowsFiles.map((file, index) => ({
  type: 'document',
  media: `attach://file${index}`
}))
windowsMedia[windowsMedia.length - 1].caption = `#${hash} #Windows10 #Windows11`
const windowsForm = new FormData()
windowsForm.append('chat_id', CHAT_ID)
windowsForm.append('media', JSON.stringify(windowsMedia))
windowsFiles.forEach((file, index) => {
  windowsForm.append(`file${index}`, fs.createReadStream(file))
})

const windows7Media = windows7Files.map((file, index) => ({
  type: 'document',
  media: `attach://file${index}`
}))
windows7Media[windows7Media.length - 1].caption = `#${hash} #Windows7 #Windows8`
const windows7Form = new FormData()
windows7Form.append('chat_id', CHAT_ID)
windows7Form.append('media', JSON.stringify(windows7Media))
windows7Files.forEach((file, index) => {
  windows7Form.append(`file${index}`, fs.createReadStream(file))
})

const linuxMedia = linuxFiles.map((file, index) => ({
  type: 'document',
  media: `attach://file${index}`
}))
linuxMedia[linuxMedia.length - 1].caption = `#${hash} #Linux`
const linuxForm = new FormData()
linuxForm.append('chat_id', CHAT_ID)
linuxForm.append('media', JSON.stringify(linuxMedia))
linuxFiles.forEach((file, index) => {
  linuxForm.append(`file${index}`, fs.createReadStream(file))
})

const macosMedia = macosFiles.map((file, index) => ({
  type: 'document',
  media: `attach://file${index}`
}))
macosMedia[macosMedia.length - 1].caption = `#${hash} #macOS`
const macosForm = new FormData()
macosForm.append('chat_id', CHAT_ID)
macosForm.append('media', JSON.stringify(macosMedia))
macosFiles.forEach((file, index) => {
  macosForm.append(`file${index}`, fs.createReadStream(file))
})

await axios.post(
  `http://127.0.0.1:8088/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMediaGroup`,
  windowsForm,
  {
    headers: windowsForm.getHeaders()
  }
)

await axios.post(
  `http://127.0.0.1:8088/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMediaGroup`,
  windows7Form,
  {
    headers: windows7Form.getHeaders()
  }
)

await axios.post(
  `http://127.0.0.1:8088/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMediaGroup`,
  macosForm,
  {
    headers: macosForm.getHeaders()
  }
)

await axios.post(
  `http://127.0.0.1:8088/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMediaGroup`,
  linuxForm,
  {
    headers: linuxForm.getHeaders()
  }
)
