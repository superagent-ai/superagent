// Background service worker for Superagent Chrome extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Superagent Chrome extension installed');
});

// Handle toolbar icon click - open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Set up side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Handle messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          success: true,
          data: {
            url: tabs[0].url,
            title: tabs[0].title
          }
        });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'getPageHTML') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              // Get the full HTML content
              const html = document.documentElement.outerHTML;

              // Get the visible text content (useful for cleaner context)
              const bodyText = document.body.innerText;

              // Get page metadata
              const title = document.title;
              const description = document.querySelector('meta[name="description"]')?.content || '';
              const url = window.location.href;

              return {
                html,
                bodyText,
                title,
                description,
                url
              };
            }
          });

          if (results && results[0]) {
            sendResponse({
              success: true,
              data: results[0].result
            });
          } else {
            sendResponse({ success: false, error: 'No results from script execution' });
          }
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'scrollPage') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          // Ensure amount is null instead of undefined for serialization
          const amount = request.amount !== undefined ? request.amount : null;

          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (direction, amount) => {
              const viewportHeight = window.innerHeight;
              const scrollAmount = amount || viewportHeight;

              switch (direction) {
                case 'up':
                  window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
                  break;
                case 'down':
                  window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                  break;
                case 'top':
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  break;
                case 'bottom':
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                  break;
              }

              return {
                scrollY: window.scrollY,
                scrollHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight
              };
            },
            args: [request.direction, amount]
          });

          if (results && results[0]) {
            sendResponse({
              success: true,
              data: results[0].result
            });
          } else {
            sendResponse({ success: false, error: 'No results from script execution' });
          }
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }

  if (request.action === 'getTextContent') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              return document.body.innerText;
            }
          });

          if (results && results[0]) {
            sendResponse({
              success: true,
              data: { text: results[0].result }
            });
          } else {
            sendResponse({ success: false, error: 'No results from script execution' });
          }
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }

  if (request.action === 'takeScreenshot') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const url = tabs[0].url;

          // Check if URL is restricted
          const restrictedPrefixes = ['chrome://', 'chrome-extension://', 'edge://', 'about:', 'file://'];
          const isRestricted = restrictedPrefixes.some(prefix => url.startsWith(prefix));
          const isChromeWebStore = url.includes('chrome.google.com/webstore');

          if (isRestricted || isChromeWebStore) {
            sendResponse({
              success: false,
              error: `Cannot take screenshots on this page. This extension cannot access ${isRestricted ? 'system pages' : 'the Chrome Web Store'}. Please navigate to a regular website.`
            });
            return;
          }

          // Get viewport dimensions and devicePixelRatio
          const viewportInfo = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              return {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio
              };
            }
          });

          // Capture the visible tab directly as JPEG
          const dataUrl = await chrome.tabs.captureVisibleTab(null, {
            format: 'jpeg',
            quality: 85
          });

          console.log('Screenshot captured, viewport:', viewportInfo[0].result);

          sendResponse({
            success: true,
            data: {
              screenshot: dataUrl,
              viewport: viewportInfo[0].result
            }
          });
        } catch (error) {
          console.error('Screenshot error:', error);

          // Provide a more helpful error message
          let errorMessage = error.message;
          if (errorMessage.includes('Extension manifest must request permission')) {
            errorMessage = 'Cannot access this page. Please navigate to a regular website (not a chrome:// page or Chrome Web Store).';
          }

          sendResponse({ success: false, error: errorMessage });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }

  if (request.action === 'clickElement') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const bbox = request.boundingBox;
          console.log('Attempting to click with bounding box:', bbox);
          console.log('Center point:', request.x, request.y);

          // Click at specific coordinates (center of bounding box)
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (x, y, bbox) => {
              console.log('Executing click at:', x, y);
              console.log('Bounding box:', bbox);

              // Draw the bounding box on the screen for debugging
              const boxOverlay = document.createElement('div');
              boxOverlay.style.position = 'fixed';
              boxOverlay.style.left = bbox.x1 + 'px';
              boxOverlay.style.top = bbox.y1 + 'px';
              boxOverlay.style.width = (bbox.x2 - bbox.x1) + 'px';
              boxOverlay.style.height = (bbox.y2 - bbox.y1) + 'px';
              boxOverlay.style.border = '3px solid red';
              boxOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
              boxOverlay.style.zIndex = '999999';
              boxOverlay.style.pointerEvents = 'none';
              document.body.appendChild(boxOverlay);

              // Draw a center point marker
              const centerMarker = document.createElement('div');
              centerMarker.style.position = 'fixed';
              centerMarker.style.left = (x - 5) + 'px';
              centerMarker.style.top = (y - 5) + 'px';
              centerMarker.style.width = '10px';
              centerMarker.style.height = '10px';
              centerMarker.style.borderRadius = '50%';
              centerMarker.style.backgroundColor = 'blue';
              centerMarker.style.zIndex = '999999';
              centerMarker.style.pointerEvents = 'none';
              document.body.appendChild(centerMarker);

              // Remove overlays after 2 seconds
              setTimeout(() => {
                boxOverlay.remove();
                centerMarker.remove();
              }, 2000);

              // Get ALL elements at the coordinates (not just the topmost one)
              const elements = document.elementsFromPoint(x, y);
              console.log('Found elements at point:', elements.length);

              if (!elements || elements.length === 0) {
                return {
                  clicked: false,
                  message: 'No element found at coordinates',
                  coordinates: { x, y }
                };
              }

              // Find the best clickable element from the stack
              const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
              let clickableElement = null;

              // First, try to find a proper clickable element
              for (const el of elements) {
                if (clickableTags.includes(el.tagName) ||
                    el.onclick ||
                    el.getAttribute('role') === 'button' ||
                    el.getAttribute('role') === 'link' ||
                    el.getAttribute('role') === 'menuitem' ||
                    el.getAttribute('tabindex') === '0' ||
                    el.hasAttribute('data-testid') ||
                    el.classList.contains('clickable') ||
                    el.style.cursor === 'pointer'
                ) {
                  clickableElement = el;
                  console.log('Found clickable element:', clickableElement.tagName, clickableElement);
                  break;
                }
              }

              // If no clickable element found, use the first non-body element
              if (!clickableElement) {
                clickableElement = elements.find(el => el.tagName !== 'BODY' && el.tagName !== 'HTML') || elements[0];
                console.log('Using fallback element:', clickableElement);
              }

              // Highlight the clickable element briefly with green outline
              const originalOutline = clickableElement.style.outline;
              clickableElement.style.outline = '3px solid green';
              setTimeout(() => {
                clickableElement.style.outline = originalOutline;
              }, 2000);

              // Try multiple click methods for better compatibility
              // Method 1: Direct click
              clickableElement.click();

              // Method 2: Mouse events sequence
              const mouseDownEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
              });
              const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
              });
              const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
              });

              clickableElement.dispatchEvent(mouseDownEvent);
              clickableElement.dispatchEvent(mouseUpEvent);
              clickableElement.dispatchEvent(clickEvent);

              // Method 3: Focus if it's an input or link
              if (clickableTags.includes(clickableElement.tagName)) {
                clickableElement.focus();
              }

              return {
                clicked: true,
                element: clickableElement.tagName,
                text: clickableElement.textContent?.substring(0, 100) || clickableElement.getAttribute('aria-label') || 'No text',
                coordinates: { x, y },
                boundingBox: bbox,
                href: clickableElement.href || null
              };
            },
            args: [request.x, request.y, request.boundingBox]
          });

          if (results && results[0]) {
            sendResponse({
              success: true,
              data: results[0].result
            });
          } else {
            sendResponse({ success: false, error: 'No results from script execution' });
          }
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }
});
