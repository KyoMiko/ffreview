/**
 * 将流对象编码为 Base64 字符串（不含 id 字段）
 */
export function encodeStream(streamObj) {
  const data = {
    streamName: streamObj.streamName,
    baseUrl: streamObj.baseUrl,
    privateKey: streamObj.privateKey,
    latency: streamObj.latency
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

/**
 * 从当前 URL 参数 `stream` 中解码流对象，失败返回 null
 */
export function decodeStreamFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('stream');
  if (!encoded) return null;
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error('[shareUtils] Failed to decode stream from URL:', e);
    return null;
  }
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-HTTPS environments
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * 生成单个流的分享 URL
 */
export function generateShareUrl(streamObj) {
  const encoded = encodeStream(streamObj);
  return `${window.location.origin}${window.location.pathname}?stream=${encoded}`;
}
