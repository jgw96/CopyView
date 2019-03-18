import { Component } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  componentWillLoad() {
    if ((window as any).Windows && (window as any).Windows.UI.ViewManagement.ApplicationView) {
      const titleBar = (window as any).Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
      titleBar.backgroundColor = { a: 255, r: 231, g: 72, b: 86 };
      titleBar.foregroundColor = { a: 255, r: 255, g: 255, b: 255 };
      titleBar.inactiveBackgroundColor = { a: 255, r: 231, g: 72, b: 86 };
      titleBar.inactiveForegroundColor = { a: 255, r: 231, g: 72, b: 86 };
      titleBar.buttonBackgroundColor = { a: 255, r: 231, g: 72, b: 86 };
    }
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/profile/:name" component="app-profile" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
