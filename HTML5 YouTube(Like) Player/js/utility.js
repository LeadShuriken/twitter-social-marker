/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.addEventListener("DOMContentLoaded", function (event) {
 
    zero_base = function (n) {
        return (n < 10) ? ("0" + n) : n;
    };
    
    setVariableInterval = function (callbackFunc, timing) {
        var variableInterval = {
            interval: timing,
            callback: callbackFunc,
            started: false,
            stopped: false,
            runLoop: function () {
                if (variableInterval.stopped)
                    return;
                var result = variableInterval.callback.call(variableInterval);
                if (typeof result == 'number')
                {
                    if (result === 0)
                        return;
                    variableInterval.interval = result;
                }
                variableInterval.loop();
            },
            stop: function () {
                this.stopped = true;
                this.started = false;
                window.clearTimeout(this.timeout);
            },
            start: function () {
                if (!this.started) {
                    this.started = true;
                    this.stopped = false;
                    return this.loop();
                } else {
                    return
                }
                ;
            },
            loop: function () {
                this.timeout = window.setTimeout(this.runLoop, this.interval);
                return this;
            }
        };
        return variableInterval.start();
    };
});