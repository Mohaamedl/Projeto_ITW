document.querySelector('.activate-animation').addEventListener('click', function () {
    document.querySelector('.animated-icon').classList.toggle('open');
});
/* dark mode
function addDarkmodeWidget() {
    const options = {
        bottom: '32px', // default: '32px'
        right: '32px', // default: '32px'
        left: 'unset', // default: 'unset'
        time: '0.8s', // default: '0.3s'
        mixColor: '#f2c4b8', // default: '#fff'
        backgroundColor: '#fff',  // default: '#fff'
        buttonColorDark: '#100f2c',  // default: '#100f2c'
        buttonColorLight: '#fff', // default: '#fff'
        saveInCookies: true, // default: true,
        label: '🌓', // default: ''
        autoMatchOsTheme: false // default: true
    }

    const darkmode = new Darkmode(options);
    darkmode.showWidget();
}
window.addEventListener('load', addDarkmodeWidget);
*/