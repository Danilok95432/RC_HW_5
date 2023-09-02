class timerView extends HTMLElement{

    constructor(interval, finishTime = 0, option){
        super();
        this.addEventListener('starttimer', this.start)
        this.addEventListener('pausetimer', this.pauseTimer)
        this.addEventListener('resettimer', this.resetTimer)
        this.addEventListener('endtimer', this.endTimer)
        this.addEventListener('updateShadow', this.updateShadow)
        this.interval = interval
        this.finishTime = finishTime
        this.option = option
        this.isPaused = false
        this.isChanged = false
        this.countChanges = 0
        this.observeChanges(this, this.countChanges)
    }

    connectedCallback(){
        this.className = 'timer'
        let attributeTimer;
        if(this.hasAttribute('seconds')){
            attributeTimer = 'seconds'  
        }
        else if(this.hasAttribute('to-time')){
            attributeTimer = 'to-time' 
        }
        this._shadow = this.attachShadow({mode: 'closed'})
        const p = document.createElement('p')
        p.setAttribute('id', 'timer')
        switch(attributeTimer){
            case 'seconds': {
                p.innerHTML = this.getAttribute(attributeTimer) + ' seconds'
                break
            }
            case 'to-time': {
                p.innerHTML = 'Timer to ' + this.getAttribute(attributeTimer)
                break
            }
        }
        this._shadow.append(p)
    }

    updateShadow(e){
        this._shadow.getElementById("timer").innerHTML = e.detail
    }

    start(){
        if(this.hasAttribute('seconds') && !this.isPaused && !this.isChanged){
            this.finishTime = Number(this.getAttribute('seconds'))
        }
        else if(this.hasAttribute('seconds') && this.isPaused && this.isChanged){
            this.finishTime = Number(this.getAttribute('seconds'))
        }
        else if(this.hasAttribute('to-time')){
            this.finishTime = this.getAttribute('to-time')
            let currentTime = new Date()
            let timeArr = this.finishTime.split(':')
            let curTime = new Array(3)
            timeArr[0] = Number(timeArr[0]) * 3600
            timeArr[1] = Number(timeArr[1]) * 60
            timeArr[2] = Number(timeArr[2])
            curTime[0] = currentTime.getHours() * 3600
            curTime[1] = currentTime.getMinutes() * 60
            curTime[2] = currentTime.getSeconds()
            this.finishTime = (timeArr[0] + timeArr[1] + timeArr[2]) - (curTime[0] + curTime[1] + curTime[2]) 
        }
        this.isPaused = false
        this.interval = setInterval(this.startTimer, 1000, this)
    }

    startTimer(obj){
        if(obj.finishTime >= 0)
        {
            let hours = Math.floor( obj.finishTime / 3600) % 60
            let minutes = Math.floor( obj.finishTime / 60) % 60
            let seconds = Math.floor( obj.finishTime ) % 60
            if(seconds < 10){
                seconds = '0' + seconds
            }
            if(minutes < 10){
                minutes = '0' + minutes
            }
            if(hours < 10){
                hours = '0' + hours
            }

            let time = (hours == 0 ? `${minutes} : ${seconds}` : `${hours} : ${minutes} : ${seconds}`)

            let updateShadowEvent = new CustomEvent('updateShadow', {composed: true, detail: `${time}`})
            obj.dispatchEvent(updateShadowEvent)
        }
        else{
            let endTimer = new Event('endtimer', {bubbles: true})
            obj.dispatchEvent(endTimer)
        }
        obj.finishTime--;
    }

    pauseTimer(){
        console.log('timer paused')
        this.isPaused = true
        clearInterval(this.interval)
    }

    resetTimer(){
        let value;
        let updateShadowEvent;
        clearInterval(this.interval)
        if(this.hasAttribute('seconds')){
            value = this.getAttribute('seconds')
            updateShadowEvent = new CustomEvent('updateShadow', {composed: true, detail: `${value} seconds`})
        }
        if(this.hasAttribute('to-time')){
            value = this.getAttribute('to-time')
            updateShadowEvent = new CustomEvent('updateShadow', {composed: true, detail: `Timer to ${value}`})
        }
        this.dispatchEvent(updateShadowEvent)
        console.log('timer reseted')
    }

    endTimer(){
        let value;
        let updateShadowEvent;
        clearInterval(this.interval)
        if(this.hasAttribute('seconds')){
            value = this.getAttribute('seconds')
            updateShadowEvent = new CustomEvent('updateShadow', {composed: true, detail: `${value} seconds have passed`})
        }
        if(this.hasAttribute('to-time')){
            value = this.getAttribute('to-time')
            updateShadowEvent = new CustomEvent('updateShadow', {composed: true, detail: `${value} already`})
        }
        this.dispatchEvent(updateShadowEvent)
    }

    observeChanges(obj, countChanges){
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                countChanges++
                if (mutation.type === "attributes" && countChanges >= 3) {
                    obj.isChanged = true
                    obj.pauseTimer()
                    obj.resetTimer()
                    obj.start()
                }
              
              console.log(mutation.target);
            });
          });
          
        observer.observe(this, {
            attributes: true 
        });
    }
}

customElements.define('timer-view', timerView)