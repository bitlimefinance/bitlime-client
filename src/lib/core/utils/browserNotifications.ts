
export function askNotificationPermission(): void {
    const notificationBtn = document.querySelector('#notification-button') as HTMLElement;
  
    // function to actually ask the permissions
    // function handlePermission(permission: NotificationPermission): void {
    //   // set the button to shown or hidden, depending on what the user answers
    //   notificationBtn.style.display =
    //     Notification.permission === 'granted' ? 'none' : 'block';
    // }
  
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log("This browser does not support notifications.");
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then((permission: NotificationPermission) => {
        //handlePermission(permission);
      });
    } else {
      Notification.requestPermission((permission: NotificationPermission) => {
        //handlePermission(permission);
      });
    }
  
    // function to check if the browser supports the Promise-based version of Notification.requestPermission()
    function checkNotificationPromise(): boolean {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    }
  }
  

export function showNotification(title: string, options?: NotificationOptions): Notification | undefined {
  if (!('Notification' in window)) {
    console.warn("This browser does not support notifications.");
    return;
  }
  const logo = "/assets/bl-logos/logo.png"; // "https://s3.amazonaws.com/appforest_uf/f1670644353042x979300179939404800/logo.png"
  if (Notification.permission === 'granted') {
    const notification = new Notification(title,  { ...options, badge:logo, icon:logo, vibrate: [200, 100, 200]});
    return notification;
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification(title, { ...options, badge:logo, icon:logo, vibrate: [200, 100, 200]});
        return notification;
      }
    });
  }
}
