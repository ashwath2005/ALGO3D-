/**
 * Deep Linking & Shareable State Utility for ALGO3D
 */

export function buildShareUrl({ algorithmId, stepIndex, data, speed }) {
  const url = new URL(window.location.origin + '/visualizer');
  
  if (algorithmId) {
    url.searchParams.set('algo', algorithmId);
  }
  
  if (stepIndex !== undefined && stepIndex >= 0) {
    url.searchParams.set('step', String(stepIndex));
  }
  
  if (data && Array.isArray(data) && data.length > 0 && typeof data[0] === 'number') {
    url.searchParams.set('data', data.join(','));
  }
  
  if (speed && speed !== 1) {
    url.searchParams.set('speed', String(speed));
  }

  return url.toString();
}

export function parseShareUrl(search) {
  const params = new URLSearchParams(search);
  const algo = params.get('algo');
  const step = params.get('step');
  const dataStr = params.get('data');
  const speed = params.get('speed');

  let parsedData = null;
  if (dataStr) {
    const nums = dataStr.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      parsedData = nums;
    }
  }

  return {
    algorithmId: algo || null,
    stepIndex: step !== null ? parseInt(step, 10) : null,
    data: parsedData,
    speed: speed ? parseFloat(speed) : null
  };
}

export async function copyShareUrlToClipboard(options = {}) {
  const shareUrl = buildShareUrl(options);
  try {
    await navigator.clipboard.writeText(shareUrl);
    return { success: true, url: shareUrl };
  } catch (err) {
    // Fallback for clipboard
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return { success: true, url: shareUrl };
  }
}
