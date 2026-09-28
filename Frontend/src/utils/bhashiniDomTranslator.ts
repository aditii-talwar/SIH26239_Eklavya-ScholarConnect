import { useEffect } from 'react';
import {
  getBhashiniLangCache,
  isAlreadyTranslatedIndic,
  translateBatchViaNmt,
  translateTextLocal,
} from '../api/informant';

// Track original English text for every DOM Text node
const originalNodeText = new WeakMap<Text, string>();
const lastAppliedNodeText = new WeakMap<Text, string>();
const trackedTextNodes = new Set<Text>();

function shouldTranslateTextNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return false;
  const tag = parent.tagName.toUpperCase();
  if (
    tag === 'SCRIPT' ||
    tag === 'STYLE' ||
    tag === 'NOSCRIPT' ||
    tag === 'TEXTAREA' ||
    tag === 'CODE' ||
    tag === 'PRE'
  ) {
    return false;
  }
  if (parent.closest('[data-no-translate="true"]')) {
    return false;
  }
  const val = (node.nodeValue || '').trim();
  if (!val || val.length < 2) return false;
  // Must contain at least one 2+ letter English word
  if (!/[A-Za-z]{2,}/.test(val)) return false;
  // Skip pure codes/URLs/emails/numbers
  if (/^(https?:\/\/|www\.|[A-Z0-9_#/-]+|\S+@\S+\.\S+)$/.test(val)) return false;
  return true;
}

/**
 * Global React Hook that automatically translates all visible text nodes across the entire
 * ScholarConnect application whenever siteLang !== 'en', and cleanly restores original English
 * when siteLang === 'en'.
 */
export function useBhashiniDomTranslator(siteLang: string) {
  useEffect(() => {
    let isCancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const restoreEnglishNodes = () => {
      trackedTextNodes.forEach((node) => {
        if (!node.isConnected) {
          trackedTextNodes.delete(node);
          return;
        }
        const orig = originalNodeText.get(node);
        const lastApplied = lastAppliedNodeText.get(node);
        if (orig !== undefined && lastApplied !== undefined && node.nodeValue === lastApplied) {
          node.nodeValue = orig;
        }
        lastAppliedNodeText.delete(node);
      });

      document
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-orig-placeholder]')
        .forEach((el) => {
          const origPh = el.getAttribute('data-orig-placeholder');
          if (origPh) {
            el.placeholder = origPh;
          }
        });
    };

    if (!siteLang || siteLang === 'en') {
      restoreEnglishNodes();
      return;
    }

    const scanAndTranslateDom = async () => {
      if (isCancelled || !document.body) return;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodesToTranslate: Array<{ node: Text; sourceEng: string }> = [];
      let current = walker.nextNode() as Text | null;

      while (current) {
        const node = current;
        current = walker.nextNode() as Text | null;

        const parent = node.parentElement;
        if (!parent || parent.closest('[data-no-translate="true"]')) continue;
        const tag = parent.tagName.toUpperCase();
        if (
          tag === 'SCRIPT' ||
          tag === 'STYLE' ||
          tag === 'NOSCRIPT' ||
          tag === 'CODE' ||
          tag === 'PRE'
        ) {
          continue;
        }

        const currentVal = node.nodeValue || '';
        const lastApplied = lastAppliedNodeText.get(node);

        if (lastApplied !== undefined && currentVal === lastApplied) {
          // Node currently holds our previously applied translation; use its original English source
          const orig = originalNodeText.get(node);
          if (orig && /[A-Za-z]{2,}/.test(orig)) {
            nodesToTranslate.push({ node, sourceEng: orig });
          }
          continue;
        }

        // Otherwise, either this is a brand-new node or React updated it
        if (!shouldTranslateTextNode(node)) continue;
        if (isAlreadyTranslatedIndic(currentVal)) continue;

        originalNodeText.set(node, currentVal);
        trackedTextNodes.add(node);
        nodesToTranslate.push({ node, sourceEng: currentVal });
      }

      // 1. Synchronously apply any already-cached translations immediately for zero-latency UI
      const cache = getBhashiniLangCache(siteLang);
      const uncachedTexts: string[] = [];

      for (const item of nodesToTranslate) {
        const trimmed = item.sourceEng.trim();
        const cachedVal = cache[trimmed];
        if (cachedVal) {
          const nextVal = item.sourceEng.replace(trimmed, cachedVal);
          if (item.node.nodeValue !== nextVal) {
            lastAppliedNodeText.set(item.node, nextVal);
            item.node.nodeValue = nextVal;
          }
        } else {
          const localVal = translateTextLocal(trimmed, siteLang);
          if (localVal && localVal !== trimmed && isAlreadyTranslatedIndic(localVal)) {
            cache[trimmed] = localVal;
            const nextVal = item.sourceEng.replace(trimmed, localVal);
            if (item.node.nodeValue !== nextVal) {
              lastAppliedNodeText.set(item.node, nextVal);
              item.node.nodeValue = nextVal;
            }
          } else if (!uncachedTexts.includes(trimmed)) {
            uncachedTexts.push(trimmed);
          }
        }
      }

      // Translate input placeholders too
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input[placeholder], textarea[placeholder]'
        )
      );
      for (const el of inputs) {
        if (el.closest('[data-no-translate="true"]')) continue;
        const origPh = el.getAttribute('data-orig-placeholder') || el.placeholder;
        if (!el.getAttribute('data-orig-placeholder') && /[A-Za-z]{2,}/.test(origPh)) {
          el.setAttribute('data-orig-placeholder', origPh);
        }
        const trimmedPh = origPh.trim();
        if (trimmedPh && !uncachedTexts.includes(trimmedPh) && !cache[trimmedPh]) {
          uncachedTexts.push(trimmedPh);
        } else if (cache[trimmedPh]) {
          el.placeholder = cache[trimmedPh];
        }
      }

      if (uncachedTexts.length === 0 || isCancelled) return;

      // 2. Fetch NMT translations for all uncached strings in batched requests
      const translatedMap = await translateBatchViaNmt(uncachedTexts, siteLang);
      if (isCancelled) return;

      for (const item of nodesToTranslate) {
        if (!item.node.isConnected) continue;
        const trimmed = item.sourceEng.trim();
        const tr = translatedMap[trimmed] || cache[trimmed];
        if (tr && tr !== trimmed) {
          const nextVal = item.sourceEng.replace(trimmed, tr);
          if (item.node.nodeValue !== nextVal) {
            lastAppliedNodeText.set(item.node, nextVal);
            item.node.nodeValue = nextVal;
          }
        }
      }

      for (const el of inputs) {
        const origPh = el.getAttribute('data-orig-placeholder');
        if (origPh) {
          const trPh = translatedMap[origPh.trim()] || cache[origPh.trim()];
          if (trPh) el.placeholder = trPh;
        }
      }
    };

    scanAndTranslateDom();

    const observer = new MutationObserver((mutations) => {
      let hasRelevantChange = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasRelevantChange = true;
          break;
        }
        if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
          const tNode = m.target as Text;
          if (tNode.nodeValue !== lastAppliedNodeText.get(tNode)) {
            hasRelevantChange = true;
            break;
          }
        }
      }
      if (hasRelevantChange) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          scanAndTranslateDom();
        }, 80);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      isCancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [siteLang]);
}
