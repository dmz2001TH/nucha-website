import { redirect } from 'next/navigation'

// Redirect old /admin/page-preview to /admin/pages
export default function PagePreviewRedirect() {
  redirect('/admin/pages')
}
