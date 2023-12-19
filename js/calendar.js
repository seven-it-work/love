function renderingTips(events) {
    if (events && events.events && events.events.length > 0) {
        let detailHtml = ''
        const detailHtmlList = events.events.filter(jsDateObjInfo => jsDateObjInfo && jsDateObjInfo.detailHtml);
        if (detailHtmlList.length === 1) {
            detailHtml = detailHtmlList[0].detailHtml
        } else {
            for (let i = 0; i < detailHtmlList.length; i++) {
                detailHtml += `<div>记录${i + 1}</div>`
                detailHtml += detailHtmlList[i].detailHtml
            }
        }
        // 鼠标悬浮
        const elementsByClassName = events.element;
        if (!elementsByClassName.innerHTML.includes('popover above')) {
            elementsByClassName.innerHTML = `<span class="qs">${elementsByClassName.innerHTML}<span class="popover above">${detailHtml}</span></span>`
        }
    }
}
new Calendar('#calendar_card', {
    language: 'zh-CN',
    startDate: new Date(),
    numberMonthsDisplayed: 1,
    displayHeader: true,
    displayWeekNumber: true,
    clickDay: function (events) {
        renderingTips(events)
    },
    dataSource: [
        {
            startDate: new Date(2023, 8, 4),
            endDate: new Date(2023, 8, 20),
            detailHtml: `<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/jess-harding-lqT6NAmTaiY-unsplash.jpg"></img>`,
        },
        {
            startDate: new Date(2023, 8, 4),
            endDate: new Date(2023, 10, 20),
            detailHtml: 222,
        }
    ],
    customDataSourceRenderer: (events) => {
        console.log(events)
    },
    mouseOnDay: (events) => {
        renderingTips(events)
    }
})
const imgSr = ['https://pic.616pic.com/bg_w1180/00/09/75/6eISyvLqRL.jpg!/fh/300', 'https://pic.616pic.com/bg_w1180/00/01/91/NvUeblaOUi.jpg!/fh/300']
self.setInterval("changeBackgroundImage()", 5000);
let index = 0;

function changeBackgroundImage() {
    const elementById1 = document.getElementsByClassName('calendar-card-class')[0];
    const elementById2 = document.getElementsByClassName('glass')[0];
    index++;
    index = index % imgSr.length
    elementById1.style.backgroundImage = `url('${imgSr[index]}')`
    elementById2.style.backgroundImage = `url('${imgSr[index]}')`
}
changeBackgroundImage();