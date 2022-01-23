var layoutPlaystore = document.querySelector('.playstore');

layoutPlaystore.addEventListener('click', function onClick() {
    var play_url = 'https://play.google.com/store/apps/details?id=com.lostark.lostarkapplication';
    var newWindow = window.open("about:blank");
    newWindow.location.href = play_url;
});