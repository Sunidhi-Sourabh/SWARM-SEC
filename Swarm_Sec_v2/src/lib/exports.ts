import type { AuditResult } from './audit-engine';
export function downloadText(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportTicket(audit: AuditResult) {
  downloadText('swarmsec-jira-ticket.csv', 'Summary,Issue Type,Description\n' + audit.findings.map(f => [f.title, 'Task', `${f.code} · Line ${f.line} · ${f.compliance}\nReview remediation:\n${audit.remediated}`].map(v => '"' + v.replaceAll('"', '""') + '"').join(',')).join('\n'), 'text/csv');
}
export async function exportPdf(audit: AuditResult) {
  const { jsPDF } = await import('jspdf'); const pdf = new jsPDF();
  let y = 20; pdf.setFontSize(16); pdf.text('SWARM-SEC | Executive Security Audit', 15, y); y += 12; pdf.setFontSize(10);
  for (const text of [`Environment: ${audit.environment}`, `Generated: ${audit.generatedAt}`, `Detected findings: ${audit.findings.length} | Local rule analysis`, 'This is not a compliance certification or an executed exploit test.', ...audit.findings.map(f => `${f.code} | L${f.line} | ${f.title} | ${f.compliance}`), 'REVIEW-READY REMEDIATION', audit.remediated]) {
    for (const line of pdf.splitTextToSize(text.replace(/[^\x20-\x7E\n]/g, ' '), 180) as string[]) { if (y > 280) { pdf.addPage(); y = 20; } pdf.text(line, 15, y); y += 5; } y += 4;
  }
  pdf.save('swarmsec-executive-audit.pdf');
}
