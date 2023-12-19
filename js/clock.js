let realIp = weather_city.en
// https://pv.sohu.com/cityjson?ie=utf-8 的结果解析
if (returnCitySN) {
    if (returnCitySN["cip"] !== '127.0.0.1') {
        realIp = returnCitySN["cip"]
    }
}
// http://whois.pconline.com.cn/ipJson.jsp 的解析结果
if (whoisIpInfo){
    if (whoisIpInfo["ip"] !== '127.0.0.1') {
        realIp = whoisIpInfo["ip"]
    }
}

// 缓存工具
// 存储数据
function setWithExpires(key, value, expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires);
    document.cookie = `${key}=${encodeURI(value)};expires=${date.toGMTString()}`;
    // window.localStorage.setItem(key, value);
}

// 获取数据
function getWithExpires(key) {
    // const value = window.localStorage.getItem(key);
    const arr = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`));
    if (arr) {
        return decodeURI(arr[2]);
    }
}

// 缓存
const localStorageWeather = getWithExpires(realIp);
if (localStorageWeather && localStorageWeather.length >= 4) {
    renderClock(JSON.parse(localStorageWeather))
} else {
    /**
     *     c    Weather condition,
     *     C    Weather condition textual name,
     *     x    Weather condition, plain-text symbol,
     *     h    Humidity,
     *     t    Temperature (Actual),
     *     f    Temperature (Feels Like),
     *     w    Wind,
     *     l    Location,
     *     m    Moon phase 🌑🌒🌓🌔🌕🌖🌗🌘,
     *     M    Moon day,
     *     p    Precipitation (mm/3 hours),
     *     P    Pressure (hPa),
     *     u    UV index (1-12),
     *
     *     D    Dawn*,
     *     S    Sunrise*,
     *     z    Zenith*,
     *     s    Sunset*,
     *     d    Dusk*,
     *     T    Current time*,
     *     Z    Local timezone.
     *
     * c天气状况，
     * C天气状况文本名称，
     * x天气状况，纯文本符号，
     * h湿度，
     * t温度（实际），
     * f温度（感觉像），
     * w风，
     * l位置，
     * m月相🌑🌒🌓🌔🌕🌖🌗🌘，
     * M月日，
     * p降水量（毫米/3小时），
     * P压力（hPa），
     * u UV指数（1-12），
     *
     * D黎明*，
     * S日出*，
     * z天顶*，
     * s日落*，
     * d黄昏*，
     * T当前时间*，
     * Z本地时区。
     */
    fetch('https://wttr.in/' + realIp + '?format=%l,%c,%t,%h').then(res => res.text()).then(
        data => {
            const wttrInfo = data.split(",");
            if (wttrInfo.length !== 4) {
                console.error("请求错误")
            } else {
                setWithExpires(realIp, JSON.stringify(wttrInfo), 1000 * 60 * 60 * 12)
                renderClock(wttrInfo);
            }
        }
    )
}


/**
 * [ChengDu,⛅,+33°C,47%]
 * @param data
 */
function renderClock(data) {
    if (document.getElementById('hexo_electric_clock')) {
        var clock_box = document.getElementById('hexo_electric_clock');
        clock_box_html = `
          <div class="clock-row">
            <span class="card-clock-ip">${realIp}</span>
            <span class="card-clock-weather">${data[1]} ${data[2]}</span>
            <span class="card-clock-humidity">💧 ${data[3]}</span>
          </div>
          <div class="clock-row">
            <span id="card-clock-time" class="card-clock-time"></span>
          </div>
          <div class="clock-row">
            <span id="card-clock-clockdate" class="card-clock-clockdate"></span>
            <span class="card-clock-location">${weather_city.zh}</span>
            <span id="card-clock-dackorlight" class="card-clock-dackorlight"></span>
          </div>
          `;
        var week = ['天', '一', '二', '三', '四', '五', '六'];
        var card_clock_loading_dom = document.getElementById('card-clock-loading');
        card_clock_loading_dom.innerHTML = '';
        clock_box.innerHTML = clock_box_html;

        function updateTime() {
            var cd = new Date();
            var card_clock_time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
            var card_clock_date = zeroPadding(cd.getFullYear(), 2) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' 周' + week[cd.getDay()];
            var card_clock_dackorlight = cd.getHours();
            var card_clock_dackorlight_str;
            if (card_clock_dackorlight > 12) {
                card_clock_dackorlight_str = " 下午";
            } else {
                card_clock_dackorlight_str = " 上午";
            }
            if (document.getElementById('card-clock-time')) {
                var card_clock_time_dom = document.getElementById('card-clock-time');
                var card_clock_date_dom = document.getElementById('card-clock-clockdate');
                var card_clock_dackorlight_dom = document.getElementById('card-clock-dackorlight');
                card_clock_time_dom.innerHTML = card_clock_time;
                card_clock_date_dom.innerHTML = card_clock_date;
                card_clock_dackorlight_dom.innerHTML = card_clock_dackorlight_str
            }
        }

        function zeroPadding(num, digit) {
            var zero = '';
            for (var i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
        }

        setInterval(updateTime, 1000);
        updateTime();
    }
}
