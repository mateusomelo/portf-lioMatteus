/**
 * Decide se um site pode ser incorporado em um <iframe> a partir da nossa origem,
 * analisando os headers X-Frame-Options e Content-Security-Policy (frame-ancestors).
 */
function isEmbeddable(headers) {
  if (!headers) return false;

  const xfo = (headers.get('x-frame-options') || '').toUpperCase();
  if (xfo.includes('DENY') || xfo.includes('SAMEORIGIN')) {
    return false;
  }

  const csp = headers.get('content-security-policy') || '';
  const match = csp.match(/frame-ancestors\s+([^;]+)/i);

  if (match) {
    const value = match[1].trim().toLowerCase();
    if (value.includes("'none'")) return false;
    if (!value.includes('*')) return false; // lista restrita que não nos inclui
  }

  return true;
}

module.exports = { isEmbeddable };
