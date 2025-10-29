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
});
