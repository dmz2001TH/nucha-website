import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { generateReportHTML } from './template'

export async function POST(request: NextRequest) {
  try {
    const { pages, title = 'Website Preview Report' } = await request.json()

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: 'No pages provided' }, { status: 400 })
    }

    const html = generateReportHTML(pages, title)

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'C:\\Users\\phasa\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'
    })

    const page = await browser.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    })

    await browser.close()

    const filename = `nucha-website-preview-${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
