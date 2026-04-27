import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { generateReportHTML, PageData } from './template'

export async function POST(request: NextRequest) {
  try {
    const { pages, title = 'Website Preview Report' } = await request.json()

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: 'No pages provided' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log(`[PDF Export] Starting server-side capture for ${pages.length} pages...`)

    const browser = await puppeteer.launch({
      headless: 'new' as any,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })

    // Capture screenshots for each page
    const pagesWithScreenshots: PageData[] = await Promise.all(
      pages.map(async (page: PageData) => {
        if (page.requiresAuth) {
          return page
        }

        try {
          const p = await browser.newPage()
          await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

          const url = `${baseUrl}${page.path}`
          console.log(`[PDF Export] Capturing: ${url}`)

          await p.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
          })

          // Wait for animations/fonts to settle
          await new Promise(r => setTimeout(r, 1500))

          const screenshot = await p.screenshot({
            fullPage: false,
            type: 'jpeg',
            quality: 75,
            clip: { x: 0, y: 0, width: 1440, height: 900 }
          })

          await p.close()

          return {
            ...page,
            screenshot: `data:image/jpeg;base64,${screenshot.toString('base64')}`
          }
        } catch (err) {
          console.error(`[PDF Export] Failed to capture ${page.path}:`, err)
          return page
        }
      })
    )

    await browser.close()

    console.log('[PDF Export] Generating HTML template...')
    const html = generateReportHTML(pagesWithScreenshots, title)

    console.log('[PDF Export] Generating PDF...')
    const browser2 = await puppeteer.launch({
      headless: 'new' as any,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })

    const pdfPage = await browser2.newPage()
    await pdfPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await pdfPage.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 })

    const pdfBuffer = await pdfPage.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    })

    await browser2.close()

    console.log(`[PDF Export] Done: ${pdfBuffer.length} bytes`)

    const filename = `nucha-website-preview-${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('[PDF Export] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
