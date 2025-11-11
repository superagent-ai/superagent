// Background service worker for Superagent Chrome extension

// Store selectorMap per tab (tabId -> Map<index, elementData>)
const tabSelectorMaps = new Map();

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Superagent Chrome extension installed');
});

// Clear selector map cache when tab is updated (navigation, reload, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' || changeInfo.url) {
    // Clear the selector map for this tab when page starts loading or URL changes
    tabSelectorMaps.delete(tabId);
  }
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

  if (request.action === 'getInteractiveElements') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
              function buildSelectorMap() {
                const selectorMap = new Map();
                let elementIndex = 0;

                function isInteractive(element) {
                  if (!element || element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'NOSCRIPT') {
                    return false;
                  }

                  const rect = element.getBoundingClientRect();
                  const style = window.getComputedStyle(element);
                  const isVisible = rect.width > 0 && rect.height > 0 && 
                                    style.display !== 'none' && 
                                    style.visibility !== 'hidden' && 
                                    style.opacity !== '0';

                  if (!isVisible) {
                    return false;
                  }

                  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
                  if (interactiveTags.indexOf(element.tagName) !== -1) {
                    return true;
                  }

                  if (element.hasAttribute('onclick') ||
                      (element.hasAttribute('role') && ['button', 'link', 'menuitem', 'tab', 'option'].indexOf(element.getAttribute('role')) !== -1) ||
                      (element.hasAttribute('tabindex') && parseInt(element.getAttribute('tabindex')) >= 0) ||
                      element.hasAttribute('data-testid') ||
                      element.classList.contains('clickable') ||
                      style.cursor === 'pointer' ||
                      element.getAttribute('href') ||
                      element.getAttribute('type') === 'submit' ||
                      element.getAttribute('type') === 'button' ||
                      element.onclick) {
                    return true;
                  }

                  return false;
                }

                function getXPath(element) {
                  if (element.id) {
                    return '//*[@id="' + element.id + '"]';
                  }
                  if (element === document.body) {
                    return '/html/body';
                  }
                  if (element === document.documentElement) {
                    return '/html';
                  }
                  
                  var ix = 0;
                  var siblings = element.parentNode.childNodes;
                  for (var i = 0; i < siblings.length; i++) {
                    var sibling = siblings[i];
                    if (sibling === element) {
                      return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                    }
                    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                      ix++;
                    }
                  }
                }

                function getCSSSelector(element) {
                  if (element.id) {
                    return '#' + element.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
                  }
                  
                  var path = [];
                  while (element && element.nodeType === Node.ELEMENT_NODE) {
                    var selector = element.tagName.toLowerCase();
                    if (element.className && typeof element.className === 'string') {
                      var classes = element.className.trim().split(/\s+/).filter(function(c) { return c.length > 0; });
                      if (classes.length > 0) {
                        selector += '.' + classes.join('.');
                      }
                    }
                    var parent = element.parentNode;
                    if (parent) {
                      var siblings = Array.from(parent.children).filter(function(s) {
                        return s.tagName === element.tagName;
                      });
                      if (siblings.length > 1) {
                        var index = siblings.indexOf(element) + 1;
                        selector += ':nth-of-type(' + index + ')';
                      }
                    }
                    path.unshift(selector);
                    element = parent;
                  }
                  return path.join(' > ');
                }

                function getElementDescription(element) {
                  const tagName = element.tagName.toLowerCase();
                  const text = element.textContent ? element.textContent.trim().substring(0, 100) : '';
                  const ariaLabel = element.getAttribute('aria-label') || '';
                  const title = element.getAttribute('title') || '';
                  const id = element.id || '';
                  const className = element.className ? (typeof element.className === 'string' ? element.className : element.className.toString()) : '';
                  const href = element.href || '';
                  const type = element.type || '';
                  const value = element.value || '';
                  const placeholder = element.placeholder || '';
                  const role = element.getAttribute('role') || '';
                  
                  var xpath = '';
                  var cssSelector = '';
                  try {
                    xpath = getXPath(element) || '';
                    cssSelector = getCSSSelector(element) || '';
                  } catch (e) {
                    // If XPath/CSS generation fails, continue without them
                  }

                  return {
                    tagName: tagName,
                    text: text,
                    ariaLabel: ariaLabel,
                    title: title,
                    id: id,
                    className: className,
                    href: href,
                    type: type,
                    value: value,
                    placeholder: placeholder,
                    role: role,
                    xpath: xpath,
                    cssSelector: cssSelector,
                    boundingBox: element.getBoundingClientRect()
                  };
                }

                function traverseDOM(node) {
                  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
                    return;
                  }

                  if (isInteractive(node)) {
                    const description = getElementDescription(node);
                    selectorMap.set(elementIndex, {
                      index: elementIndex,
                      element: node,
                      tagName: description.tagName,
                      text: description.text,
                      ariaLabel: description.ariaLabel,
                      title: description.title,
                      id: description.id,
                      className: description.className,
                      href: description.href,
                      type: description.type,
                      value: description.value,
                      placeholder: description.placeholder,
                      role: description.role,
                      xpath: description.xpath,
                      cssSelector: description.cssSelector,
                      boundingBox: description.boundingBox
                    });
                    elementIndex++;
                  }

                  var children = Array.from(node.children);
                  for (var i = 0; i < children.length; i++) {
                    traverseDOM(children[i]);
                  }
                }

                traverseDOM(document.body);
                return selectorMap;
              }

              const selectorMap = buildSelectorMap();
              const elements = [];
              var entries = Array.from(selectorMap.entries());
              for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var idx = entry[0];
                var data = entry[1];
                var rect = data.boundingBox;
                elements.push({
                  index: data.index,
                  tagName: data.tagName,
                  text: data.text,
                  ariaLabel: data.ariaLabel,
                  title: data.title,
                  id: data.id,
                  className: data.className,
                  href: data.href,
                  type: data.type,
                  value: data.value,
                  placeholder: data.placeholder,
                  role: data.role,
                  xpath: data.xpath || '',
                  cssSelector: data.cssSelector || '',
                  boundingBox: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom
                  }
                });
              }
              return elements;
            }
          });

          if (results && results[0]) {
            // Store the selector map for this tab
            const tabId = tabs[0].id;
            tabSelectorMaps.set(tabId, results[0].result);
            
            sendResponse({
              success: true,
              data: {
                elements: results[0].result,
                count: results[0].result.length
              }
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

  if (request.action === 'clickElementByIndex') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const elementIndex = request.index;
          console.log('Attempting to click element with index:', elementIndex);

          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: async function(index) {
              function buildSelectorMap() {
                const selectorMap = new Map();
                let elementIndex = 0;

                function isInteractive(element) {
                  if (!element || element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'NOSCRIPT') {
                    return false;
                  }

                  const rect = element.getBoundingClientRect();
                  const style = window.getComputedStyle(element);
                  const isVisible = rect.width > 0 && rect.height > 0 && 
                                    style.display !== 'none' && 
                                    style.visibility !== 'hidden' && 
                                    style.opacity !== '0';

                  if (!isVisible) {
                    return false;
                  }

                  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
                  if (interactiveTags.indexOf(element.tagName) !== -1) {
                    return true;
                  }

                  if (element.hasAttribute('onclick') ||
                      (element.hasAttribute('role') && ['button', 'link', 'menuitem', 'tab', 'option'].indexOf(element.getAttribute('role')) !== -1) ||
                      (element.hasAttribute('tabindex') && parseInt(element.getAttribute('tabindex')) >= 0) ||
                      element.hasAttribute('data-testid') ||
                      element.classList.contains('clickable') ||
                      style.cursor === 'pointer' ||
                      element.getAttribute('href') ||
                      element.getAttribute('type') === 'submit' ||
                      element.getAttribute('type') === 'button' ||
                      element.onclick) {
                    return true;
                  }

                  return false;
                }

                function getElementDescription(element) {
                  const tagName = element.tagName.toLowerCase();
                  const text = element.textContent ? element.textContent.trim().substring(0, 100) : '';
                  const ariaLabel = element.getAttribute('aria-label') || '';
                  const title = element.getAttribute('title') || '';
                  const id = element.id || '';
                  const className = element.className ? (typeof element.className === 'string' ? element.className : element.className.toString()) : '';
                  const href = element.href || '';
                  const type = element.type || '';
                  const value = element.value || '';
                  const placeholder = element.placeholder || '';
                  const role = element.getAttribute('role') || '';

                  return {
                    tagName: tagName,
                    text: text,
                    ariaLabel: ariaLabel,
                    title: title,
                    id: id,
                    className: className,
                    href: href,
                    type: type,
                    value: value,
                    placeholder: placeholder,
                    role: role,
                    boundingBox: element.getBoundingClientRect()
                  };
                }

                function traverseDOM(node) {
                  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
                    return;
                  }

                  if (isInteractive(node)) {
                    const description = getElementDescription(node);
                    selectorMap.set(elementIndex, {
                      index: elementIndex,
                      element: node,
                      tagName: description.tagName,
                      text: description.text,
                      ariaLabel: description.ariaLabel,
                      title: description.title,
                      id: description.id,
                      className: description.className,
                      href: description.href,
                      type: description.type,
                      value: description.value,
                      placeholder: description.placeholder,
                      role: description.role,
                      boundingBox: description.boundingBox
                    });
                    elementIndex++;
                  }

                  var children = Array.from(node.children);
                  for (var i = 0; i < children.length; i++) {
                    traverseDOM(children[i]);
                  }
                }

                traverseDOM(document.body);
                return selectorMap;
              }

              const selectorMap = buildSelectorMap();
              const elementData = selectorMap.get(index);

              if (!elementData || !elementData.element) {
                return {
                  clicked: false,
                  message: 'No element found at index ' + index,
                  index: index
                };
              }

              var element = elementData.element;
              
              // Function to scroll element into view
              function scrollIntoViewIfNeeded(el) {
                var rect = el.getBoundingClientRect();
                var isInViewport = rect.top >= 0 && 
                                  rect.left >= 0 && 
                                  rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                                  rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                
                if (!isInViewport) {
                  el.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center'
                  });
                  // Wait a bit for scroll to complete
                  return new Promise(function(resolve) {
                    setTimeout(resolve, 300);
                  });
                }
                return Promise.resolve();
              }

              // Scroll element into view before clicking
              await scrollIntoViewIfNeeded(element);
              
              // Wait for element to be stable (no position changes)
              var lastRect = element.getBoundingClientRect();
              var stable = false;
              for (var attempt = 0; attempt < 10; attempt++) {
                await new Promise(function(resolve) { setTimeout(resolve, 50); });
                var currentRect = element.getBoundingClientRect();
                if (Math.abs(currentRect.x - lastRect.x) < 2 &&
                    Math.abs(currentRect.y - lastRect.y) < 2 &&
                    Math.abs(currentRect.width - lastRect.width) < 2 &&
                    Math.abs(currentRect.height - lastRect.height) < 2) {
                  stable = true;
                  break;
                }
                lastRect = currentRect;
              }

              var rect = element.getBoundingClientRect();
              var centerX = rect.left + rect.width / 2;
              var centerY = rect.top + rect.height / 2;

              // Highlight the element briefly
              var originalOutline = element.style.outline;
              element.style.outline = '3px solid green';
              setTimeout(function() {
                element.style.outline = originalOutline;
              }, 2000);

              // Try multiple click methods for better compatibility
              // Method 1: Direct click
              element.click();

              // Method 2: Mouse events sequence
              var mouseDownEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
              });
              var mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
              });
              var clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
              });

              element.dispatchEvent(mouseDownEvent);
              element.dispatchEvent(mouseUpEvent);
              element.dispatchEvent(clickEvent);

              // Method 3: Focus if it's an input or link
              var clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
              if (clickableTags.indexOf(element.tagName) !== -1) {
                element.focus();
              }

              return {
                clicked: true,
                index: index,
                element: element.tagName,
                text: (element.textContent ? element.textContent.substring(0, 100) : '') || element.getAttribute('aria-label') || 'No text',
                href: element.href || null
              };
            },
            args: [elementIndex]
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

  if (request.action === 'navigateToUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          await chrome.tabs.update(tabs[0].id, { url: request.url });
          sendResponse({
            success: true,
            data: { message: `Navigated to ${request.url}` }
          });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }

  if (request.action === 'goBack') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
              window.history.back();
              return { success: true };
            }
          });
          
          if (results && results[0]) {
            sendResponse({
              success: true,
              data: { message: 'Navigated back' }
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

  if (request.action === 'goForward') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
              window.history.forward();
              return { success: true };
            }
          });
          
          if (results && results[0]) {
            sendResponse({
              success: true,
              data: { message: 'Navigated forward' }
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
