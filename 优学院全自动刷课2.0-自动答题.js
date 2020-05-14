
// ==========================================================================================================
// 
// 优学院刷课脚本-V2.0
//
// @author xiaobu   QQ:1714005186
//
// 介绍:
// 自动刷优学院视频，8倍速火力全开，自动答题！！
// 
// 推荐使用油猴脚本管理器运行，避免手动复制出现错误
// 油猴脚本地址：https://greasyfork.org/zh-CN/scripts/403270-%E4%BC%98%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE
// 油猴脚本管理器的使用请自行搜索
//
// 如果一定要手动运行，按照下面的方式即可
//
// 使用方法：
// 1.复制全文
// 2.打开基于google内核的浏览器（比如chorme，360浏览器，百分浏览器）,推荐 谷歌浏览器，无法保证其他浏览器的功能完整。
// 3.登录优学院，并将页面跳转到看视频的界面，可以点击到任意章节，刷课脚本会从你当前选择的章节开始往下刷
// 4.打开浏览器的调试界面（F12 或者 右键-检查）
// 3.此时已经打开了浏览器的开发者面板，将面板切换到 console 面板（也叫控制台）
// 5.将复制的代码全部粘贴，并点击回车按键
// 6.此时页面上的 <联系客服> 按钮会被替换为 <开刷> 按钮，点击此按钮，开始愉快的刷课之旅，再次点击会会暂停刷课
//
// 注意事项：
// 1.无法保证其他浏览器的可用性，请自行保证浏览器内核为谷歌浏览器的内核，或直接使用谷歌浏览器
// 2.附上百分浏览器（基于谷歌）下载地址：http://www.centbrowser.cn/
// 3.刷课的过程中如果关闭了浏览器，下次在刷请将使用方法重新执行一遍
// 4.出现任何安全问题与本人无关（并不会出现），当你执行脚本的那一刻，就代表你已经接受了所有条例
// 5.此段为注释，复制不会影响正常运行
// 6.由于优学院代码会更新，不能保证该脚本长时间有效，如果失效可联系作者
// 
// 更新时间 -- 2020/5/9 
// 
// ==========================================================================================================


(function () {

    init();

})();

// 准备工作
function init() {
    createBtn();
    bindEvent();

    document.querySelector('.operating-area').removeChild(document.querySelector('.custom-service'));
    document.querySelector('.operating-area').appendChild(startBtn);
}

// 创建全局元素
function createBtn() {
    // ===== 定义开始按钮 ===== //
    window.startBtn = document.createElement("div");
    startBtn.setAttribute("class", "custom-service");
    startBtn.setAttribute("style", "z-index:9999");
    startBtn.innerHTML = '<button class="btn-hollow" onclick="start_watch();"><span>老铁开刷</span></button>';

    // ===== 定义暂停按钮 =====  //
    window.stopBtn = document.createElement("div");
    stopBtn.setAttribute("class", "custom-service");
    stopBtn.setAttribute("style", "z-index:9999");
    stopBtn.innerHTML = '<button class="btn-hollow" onclick="stop_watch();"><span>爷不刷了</span></button>';

}

// 定义全局事件
function bindEvent() {

    window.start_watch = function () {
        document.querySelector('.operating-area').removeChild(window.startBtn);
        document.querySelector('.operating-area').appendChild(window.stopBtn);
        // 定义一个全局定时器
        window.myVar = setInterval(function () {
            logic();
        }, 1000);
    };

    window.stop_watch = function () {
        document.querySelector('.operating-area').removeChild(stopBtn);
        document.querySelector('.operating-area').appendChild(startBtn);
        // 如果页面有视频，且视频是正在观看状态，需要停止
        if (document.querySelector(".file-media")) {
            let allVideos = document.querySelectorAll(".file-media");
            for (let i = 0; i < allVideos.length; i++) {
                if (document.querySelectorAll('.mejs__button.mejs__playpause-button button')[i].getAttribute('title') != 'Play') {
                    document.querySelectorAll(".mejs__speed-selector-input")[i].value = 1.50;
                    document.querySelectorAll(".mejs__speed-selector-input")[i].click();
                    document.querySelectorAll('.mejs__button.mejs__speed-button button')[i].innerText = '1.50x'
                    document.querySelectorAll('.mejs__button.mejs__playpause-button button')[i].click();
                }
            }
        }
        clearInterval(window.myVar);
    };
}

// 刷课逻辑
function logic() {
    console.log('执行逻辑中>>>');

    // 如果页面中弹出了对话框
    if (document.querySelector('.modal.fade.in')) {
        // 统计弹框
        if (document.querySelector('.modal.fade.in').getAttribute('id') == 'statModal') {
            document.querySelectorAll("#statModal .btn-hollow")[1].click();
            console.log('干掉统计弹框~');
        }
        // 提示框
        else if (document.querySelector('.modal.fade.in').getAttribute('id') == 'alertModal') {
            if (document.querySelector("#alertModal .btn-hollow")) {
                document.querySelector("#alertModal .btn-hollow").click();
            }
            else {
                document.querySelector("#alertModal .btn-submit").click();
            }
            console.log('干掉提示框~');
        }
        return;
    }



    // 如果页面中有视频 
    if (document.querySelector(".file-media")) {
        let allVideos = document.querySelectorAll(".file-media");
        let i = 0;
        for (; i < allVideos.length; i++) {
            // 已经看完了，跳到到下一页，由于判断是否刷完的逻辑有些复杂， 故不做判断，可以自己手动返回
            if (document.querySelectorAll("[data-bind='text: $root.i18nMessageText().finished']")[i]) {
                console.log(document.querySelector('.course-title.small').innerText + '  >>> 看完了~');
            }
            // 还没有看完，需要将本视频看完
            else {
                // 如果本视频不是正在观看状态，则高倍速开始播放
                if (document.querySelectorAll('.mejs__button.mejs__playpause-button button')[i].getAttribute('title') == 'Play') {
                    console.log('火力全开!目标：' + document.querySelector('.course-title.small').innerText);

                    document.querySelectorAll(".mejs__speed-selector-input")[i * 4].value = 8.00;
                    document.querySelectorAll(".mejs__speed-selector-input")[i * 4].click();
                    document.querySelectorAll('.mejs__button.mejs__speed-button button')[i].innerText = '8.00x'
                    document.querySelectorAll('.mejs__button.mejs__playpause-button button')[i].click();
                }
                break;
            }
        }
        if (i == allVideos.length) {
            document.querySelector('.next-page-btn.cursor').click();
        }
    }
    // 如果是做题界面
    else if (document.querySelector('.question-setting-panel')) {
        console.log('精神小伙开始答题！！');

        autoAnswer();
        setTimeout(() => {
            autoAnswer();
            // 下一页
            document.querySelector('.next-page-btn.cursor').click();
        }, 500)

    }
    // 直接下一页
    else {
        document.querySelector('.next-page-btn.cursor').click();
    }
}

// 自动答题
function autoAnswer() {
    // 点一下提交拉取答案
    let content = document.querySelector('.question-operation-area button').innerText;
    if (content == '重做') {
        document.querySelector('.question-operation-area button').click();
    }
    document.querySelector('.question-operation-area button').click();

    let answers = document.querySelectorAll('.correct-answer-area');
    // 存放题目
    let questionRootNodes = [];
    for (let i = 0; i < answers.length; i++) {
        questionRootNodes.push(answers[i].parentNode.parentNode.parentNode);
    }

    document.querySelector('.question-operation-area button').click();

    for (let i = 0; i < answers.length; i++) {
        // 答案节点的内容
        let answer = answers[i].querySelector('span:nth-child(2)').innerText;

        // 判断题
        if (answer == '正确') {
            questionRootNodes[i].querySelector('.right-btn').click();
        }
        else if (answer == '错误') {
            questionRootNodes[i].querySelector('.wrong-btn').click();
        }
        // 多选题
        else if (answer.indexOf(',') != -1) {
            // 所有已经选择的项去掉
            let allSelectedBox = questionRootNodes[i].querySelectorAll('.checkbox.selected');
            for (let i = 0; i < allSelectedBox.length; i++) {
                allSelectedBox[i].click();
            }
            // 重新选择
            let answerArray = answer.split(',');

            let allBox = questionRootNodes[i].querySelectorAll('.checkbox');
            for (let i = 0; i < answerArray.length; i++) {
                console.log(answerArray[i]);

                switch (answerArray[i]) {
                    case 'A': {
                        allBox[0].click();
                        console.log('选择了 A');
                        break;
                    }
                    case 'B': {
                        allBox[1].click();
                        console.log('选择了 B');
                        break;
                    }
                    case 'C': {
                        allBox[2].click();
                        console.log('选择了 C');
                        break;
                    }
                    case 'D': {
                        allBox[3].click();
                        console.log('选择了 D');
                        break;
                    }
                    case 'E': {
                        allBox[4].click();
                        console.log('选择了 E');
                        break;
                    }
                }
            }
        }
        // 单选题
        else {
            let allBox = questionRootNodes[i].querySelectorAll('.radio');
            switch (answer) {
                case 'A': {
                    allBox[0].click();
                    console.log('选择了 A');
                    break;
                }
                case 'B': {
                    allBox[1].click();
                    console.log('选择了 B');
                    break;
                }
                case 'C': {
                    allBox[2].click();
                    console.log('选择了 C');
                    break;
                }
                case 'D': {
                    allBox[3].click();
                    console.log('选择了 D');
                    break;
                }
                case 'E': {
                    allBox[4].click();
                    console.log('选择了 E');
                    break;
                }
            }
        }
    }
    // 真正提交
    document.querySelector('.question-operation-area button').click();

}