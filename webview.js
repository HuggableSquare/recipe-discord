const { ipcRenderer } = require('electron');
const path = require('path');

const getGuildIcon = function getGuildIcon() {
  const guildIcon = document.querySelector('.guild-1EfMGQ.selected-ML3OIq a > div');
  if (guildIcon) {
    let iconImage = window.getComputedStyle(guildIcon, null).getPropertyValue('background-image')
    iconImage = iconImage.match(/url\("(.*)"\)/)[1];
    ipcRenderer.sendToHost('avatar', iconImage);
  }
};

const getSidebarColor = function getSidebarColor() {
  const sidebar = document.querySelector('#app-mount');
  if (sidebar) {
    const color = window.getComputedStyle(sidebar, null).getPropertyValue('background');
    ipcRenderer.sendToHost('sidebarColor', color);
  }
};

module.exports = (Franz) => {
  const getMessages = function getMessages() {
    // get unread messages
    const directMessages = document.querySelectorAll('.contentUnreadText-2vNnZc > div:nth-child(3) > div > div');
    const directCount = Array.forEach(directMessages).reduce((previous, current) => previous + parseInt(current.innerText), 0);
    const indirectMessages = document.querySelectorAll('.contentUnreadText-2vNnZc').length - directMessages.length;

    // set Franz badge
    Franz.setBadge(directCount, indirectMessages);
  };

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);

  setTimeout(() => {
    getSidebarColor();
    getGuildIcon();
  }, 4000);

  // Hide download message
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};
